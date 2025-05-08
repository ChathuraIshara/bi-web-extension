/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { URI, Utils } from "vscode-uri";
import { ARTIFACT_TYPE, Artifacts, ArtifactsNotification, BaseArtifact, DIRECTORY_MAP, EVENT_TYPE, MACHINE_VIEW, NodePosition, ProjectStructureArtifactResponse, ProjectStructureResponse, SourceUpdateResponse, VisualizerLocation } from "@wso2-enterprise/ballerina-core";
import { StateMachine } from "../stateMachine";
import * as fs from 'fs';
import * as path from 'path';
import { ExtendedLangClient } from "../core/extended-language-client";
import { ServiceDesignerRpcManager } from "../rpc-managers/service-designer/rpc-manager";
import { injectAgent, injectAgentCode, injectImportIfMissing } from "./source-utils";
import { tmpdir } from "os";

export async function buildProjectArtifactsStructure(projectDir: string, langClient: ExtendedLangClient): Promise<ProjectStructureResponse> {
    const result: ProjectStructureResponse = {
        projectName: "",
        directoryMap: {
            [DIRECTORY_MAP.AUTOMATION]: [],
            [DIRECTORY_MAP.SERVICE]: [],
            [DIRECTORY_MAP.LISTENER]: [],
            [DIRECTORY_MAP.FUNCTION]: [],
            [DIRECTORY_MAP.CONNECTION]: [],
            [DIRECTORY_MAP.TYPE]: [],
            [DIRECTORY_MAP.CONFIGURABLE]: [],
            [DIRECTORY_MAP.DATA_MAPPER]: [],
            [DIRECTORY_MAP.NP_FUNCTION]: [],
            [DIRECTORY_MAP.AGENTS]: [],
            [DIRECTORY_MAP.LOCAL_CONNECTORS]: [],
        }
    };
    const designArtifacts = await langClient.getProjectArtifacts({ projectPath: projectDir });
    console.log("designArtifacts", designArtifacts);
    if (designArtifacts?.artifacts) {
        traverseComponents(designArtifacts.artifacts, result);
        await populateLocalConnectors(projectDir, result);
    }
    return result;
}

export async function forceUpdateProjectArtifacts() {
    return new Promise(async (resolve) => {
        const result: ProjectStructureResponse = {
            projectName: "",
            directoryMap: {
                [DIRECTORY_MAP.AUTOMATION]: [],
                [DIRECTORY_MAP.SERVICE]: [],
                [DIRECTORY_MAP.LISTENER]: [],
                [DIRECTORY_MAP.FUNCTION]: [],
                [DIRECTORY_MAP.CONNECTION]: [],
                [DIRECTORY_MAP.TYPE]: [],
                [DIRECTORY_MAP.CONFIGURABLE]: [],
                [DIRECTORY_MAP.DATA_MAPPER]: [],
                [DIRECTORY_MAP.NP_FUNCTION]: [],
                [DIRECTORY_MAP.AGENTS]: [],
                [DIRECTORY_MAP.LOCAL_CONNECTORS]: [],
            }
        };
        const langClient = StateMachine.context().langClient;
        const projectDir = StateMachine.context().projectUri;
        const designArtifacts = await langClient.getProjectArtifacts({ projectPath: projectDir });
        if (designArtifacts?.artifacts) {
            traverseComponents(designArtifacts.artifacts, result);
            await populateLocalConnectors(projectDir, result);
        }
        StateMachine.updateProjectStructure({ ...result }, true);
        resolve(true);
    });
}

export async function updateProjectArtifacts(publishedArtifacts: ArtifactsNotification) {
    // Current project structure
    const currentProjectStructure: ProjectStructureResponse = StateMachine.context().projectStructure;
    if (publishedArtifacts && currentProjectStructure) {
        const tmpUri = URI.file(tmpdir());
        const publishedArtifactsUri = URI.parse(publishedArtifacts.uri);
        if (publishedArtifactsUri.path.toLowerCase().includes(tmpUri.path.toLowerCase())) {
            // Skip the temp dirs
            return;
        }
        const entryLocation = await traverseUpdatedComponents(publishedArtifacts.artifacts, currentProjectStructure);
        StateMachine.setReadyMode();
        // Skip if the user is in diagram view
        const currentView = StateMachine.context().view;
        const skipOpeningViews = [MACHINE_VIEW.BIDiagram, MACHINE_VIEW.ServiceDesigner, MACHINE_VIEW.GraphQLDiagram, MACHINE_VIEW.DataMapper];
        if (entryLocation) {
            const location: VisualizerLocation = {
                documentUri: entryLocation?.path,
                position: entryLocation?.position
            };
            if (!skipOpeningViews.includes(currentView)) { // Check if the user is in a view that should not be opened
                StateMachine.updateProjectStructure({ ...currentProjectStructure }, true, location); // Open new view
                return;
            } else {
                StateMachine.updateProjectStructure({ ...currentProjectStructure }, true); // Refresh the current view
                return;
            }
        }
        StateMachine.updateProjectStructure({ ...currentProjectStructure }, false); // Send notification to the current view
        return;
    }
}

async function traverseComponents(artifacts: Artifacts, response: ProjectStructureResponse) {
    response.directoryMap[DIRECTORY_MAP.AUTOMATION].push(...await getComponents(artifacts[ARTIFACT_TYPE.EntryPoints], DIRECTORY_MAP.AUTOMATION, "task"));
    response.directoryMap[DIRECTORY_MAP.SERVICE].push(...await getComponents(artifacts[ARTIFACT_TYPE.EntryPoints], DIRECTORY_MAP.SERVICE, "http-service"));
    response.directoryMap[DIRECTORY_MAP.LISTENER].push(...await getComponents(artifacts[ARTIFACT_TYPE.Listeners], DIRECTORY_MAP.LISTENER, "http-service"));
    response.directoryMap[DIRECTORY_MAP.FUNCTION].push(...await getComponents(artifacts[ARTIFACT_TYPE.Functions], DIRECTORY_MAP.FUNCTION, "function"));
    response.directoryMap[DIRECTORY_MAP.DATA_MAPPER].push(...await getComponents(artifacts[ARTIFACT_TYPE.DataMappers], DIRECTORY_MAP.DATA_MAPPER, "dataMapper"));
    response.directoryMap[DIRECTORY_MAP.CONNECTION].push(...await getComponents(artifacts[ARTIFACT_TYPE.Connections], DIRECTORY_MAP.CONNECTION, "connection"));
    response.directoryMap[DIRECTORY_MAP.TYPE].push(...await getComponents(artifacts[ARTIFACT_TYPE.Types], DIRECTORY_MAP.TYPE, "type"));
    response.directoryMap[DIRECTORY_MAP.CONFIGURABLE].push(...await getComponents(artifacts[ARTIFACT_TYPE.Configurations], DIRECTORY_MAP.CONFIGURABLE, "config"));
    response.directoryMap[DIRECTORY_MAP.NP_FUNCTION].push(...await getComponents(artifacts[ARTIFACT_TYPE.NaturalFunctions], DIRECTORY_MAP.NP_FUNCTION, "function"));
}

async function getComponents(artifacts: Record<string, BaseArtifact>, artifactType: DIRECTORY_MAP, icon: string, moduleName?: string): Promise<ProjectStructureArtifactResponse[]> {
    const entries: ProjectStructureArtifactResponse[] = [];
    if (!artifacts) {
        return entries;
    }
    // Loop though the artifact records and create the project structure artifact response
    for (const [key, artifact] of Object.entries(artifacts)) {
        // Skip the entry to the entries array if the artifact type does not match the requested artifact type
        if (artifact.type !== artifactType) {
            continue;
        }
        const entryValue = await getEntryValue(artifact, icon, moduleName);
        entries.push(entryValue);
    }
    return entries;
}

async function getEntryValue(artifact: BaseArtifact, icon: string, moduleName?: string) {
    const targetFile = Utils.joinPath(URI.parse(StateMachine.context().projectUri), artifact.location.fileName).fsPath;
    const entryValue: ProjectStructureArtifactResponse = {
        id: artifact.id,
        name: artifact.name,
        path: targetFile,
        moduleName: artifact.module,
        type: artifact.type,
        icon: artifact.module ? `bi-${artifact.module}` : icon,
        context: artifact.name === "automation" ? "main" : artifact.name,
        resources: [],
        position: {
            endColumn: artifact.location.endLine.offset,
            endLine: artifact.location.endLine.line,
            startColumn: artifact.location.startLine.offset,
            startLine: artifact.location.startLine.line
        }
    };
    switch (artifact.type) {
        case DIRECTORY_MAP.AUTOMATION:
            // Do things related to automation
            entryValue.name = `Automation`;
            break;
        case DIRECTORY_MAP.SERVICE:
            // Do things related to service
            entryValue.name = artifact.name; // GraphQL Service - /foo
            entryValue.icon = getCustomEntryNodeIcon(artifact.module);
            if (artifact.module === "ai") {
                entryValue.resources = [];
                const aiResourceLocation = Object.values(artifact.children).find(child => child.type === DIRECTORY_MAP.RESOURCE)?.location;
                entryValue.position = {
                    endColumn: aiResourceLocation.endLine.offset,
                    endLine: aiResourceLocation.endLine.line,
                    startColumn: aiResourceLocation.startLine.offset,
                    startLine: aiResourceLocation.startLine.line
                };
                // Hack to handle AI services --------------------------------->
                // Inject the AI agent code into the service when new service is created
                const isNewService = StateMachine.context().tempData?.isNewService;
                const agentName = artifact.name.split('-')[1].trim().replace(/\//g, '');
                const tempServiceAgentName = StateMachine.context().tempData?.serviceModel?.properties["basePath"]?.value.trim().replace(/\//g, '');
                if (isNewService && artifact.module === "ai" && agentName === tempServiceAgentName) {
                    const injectedResult = await injectAIAgent(artifact);
                    entryValue.position = injectedResult.position;
                }
            } else {
                // Get the children of the service
                const resourceFunctions = await getComponents(artifact.children, DIRECTORY_MAP.RESOURCE, icon, artifact.module);
                const remoteFunctions = await getComponents(artifact.children, DIRECTORY_MAP.REMOTE, icon, artifact.module);
                const privateFunctions = await getComponents(artifact.children, DIRECTORY_MAP.FUNCTION, icon, artifact.module);
                entryValue.resources = [...resourceFunctions, ...remoteFunctions, ...privateFunctions];
            }
            break;
        case DIRECTORY_MAP.LISTENER:
            // Do things related to listener
            entryValue.icon = getCustomEntryNodeIcon(getTypePrefix(artifact.module));
            break;
        case DIRECTORY_MAP.CONNECTION:
            entryValue.icon = icon;
            break;
        case DIRECTORY_MAP.RESOURCE:
            // Do things related to resource
            let resourceName = `${artifact.name}`;
            let resourceIcon = `${artifact.accessor}-api`;
            if (moduleName && moduleName === "graphql") {
                resourceName = `${artifact.name}`;
                resourceIcon = ``;
            }
            entryValue.name = resourceName;
            entryValue.icon = resourceIcon;
            break;
        case DIRECTORY_MAP.REMOTE:
            // Do things related to remote
            entryValue.icon = ``;
            break;
    }
    return entryValue;
}

// This is a hack to inject the AI agent code into the chat service function
// This has to be replaced once we have a proper design for AI Agent Chat Service
async function injectAIAgent(serviceArtifact: BaseArtifact) {
    // Inject the import if missing
    const importStatement = `import ballerinax/ai`;
    await injectImportIfMissing(importStatement, path.join(StateMachine.context().projectUri, `agents.bal`));

    //get AgentName
    const agentName = serviceArtifact.name.split('-')[1].trim().replace(/\//g, '');

    // Inject the agent code
    await injectAgent(agentName, StateMachine.context().projectUri);
    // Retrieve the service model
    const targetFile = Utils.joinPath(URI.parse(StateMachine.context().projectUri), serviceArtifact.location.fileName).fsPath;
    const updatedService = await new ServiceDesignerRpcManager().getServiceModelFromCode({
        filePath: targetFile,
        codedata: {
            lineRange: {
                startLine: { line: serviceArtifact.location.startLine.line, offset: serviceArtifact.location.startLine.offset },
                endLine: { line: serviceArtifact.location.endLine.line, offset: serviceArtifact.location.endLine.offset }
            }
        }
    });
    if (!updatedService?.service?.functions?.[0]?.codedata?.lineRange?.endLine) {
        console.error('Unable to determine injection position: Invalid service structure');
        return;
    }
    const injectionPosition = updatedService.service.functions[0].codedata.lineRange.endLine;
    const serviceFile = path.join(StateMachine.context().projectUri, `main.bal`);
    ensureFileExists(serviceFile);
    await injectAgentCode(agentName, serviceFile, injectionPosition);
    const functionPosition: NodePosition = {
        startLine: updatedService.service.functions[0].codedata.lineRange.startLine.line,
        startColumn: updatedService.service.functions[0].codedata.lineRange.startLine.offset,
        endLine: updatedService.service.functions[0].codedata.lineRange.endLine.line + 3,
        endColumn: updatedService.service.functions[0].codedata.lineRange.endLine.offset
    };
    return {
        position: functionPosition
    };
}

function ensureFileExists(targetFile: string) {
    // Check if the file exists
    if (!fs.existsSync(targetFile)) {
        // Create the file if it does not exist
        fs.writeFileSync(targetFile, "");
        console.log(`>>> Created file at ${targetFile}`);
    }
}


async function traverseUpdatedComponents(publishedArtifacts: Artifacts, currentProjectStructure: ProjectStructureResponse): Promise<ProjectStructureArtifactResponse | undefined> {
    let entryLocation: ProjectStructureArtifactResponse | undefined;
    for (const [key, directoryMaps] of Object.entries(publishedArtifacts)) { // key will be Entry Points, Listeners, Functions, etc as Directory Map
        for (const [actionKey, actionArtifacts] of Object.entries(directoryMaps)) { // actionKey will be deletions, creations, updates and actionsArtifacts will be the list of artifacts
            switch (actionKey) {
                case "deletions":
                    for (const [index, baseArtifact] of Object.entries(actionArtifacts)) {
                        handleDeletions(baseArtifact, key, currentProjectStructure);
                    }
                    break;
                case "additions":
                    for (const [index, baseArtifact] of Object.entries(actionArtifacts)) {
                        const createdLocation = await handleCreations(baseArtifact, key, currentProjectStructure);
                        if (createdLocation) {
                            entryLocation = createdLocation;
                        }
                    }
                    break;
                case "updates":
                    for (const [index, baseArtifact] of Object.entries(actionArtifacts)) {
                        const updatedLocation = await handleUpdates(baseArtifact, key, currentProjectStructure);
                        if (updatedLocation) {
                            entryLocation = updatedLocation;
                        }
                    }
                    break;
            }
        }
    }
    return entryLocation;
}

// Handle deletions
function handleDeletions(artifact: BaseArtifact, key: string, currentProjectStructure: ProjectStructureResponse) {
    switch (key) {
        case ARTIFACT_TYPE.EntryPoints:
            if (artifact.id === "automation") {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.AUTOMATION] = currentProjectStructure.directoryMap[DIRECTORY_MAP.AUTOMATION].filter(value => value.id !== artifact.id);
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.SERVICE] = currentProjectStructure.directoryMap[DIRECTORY_MAP.SERVICE].filter(value => value.id !== artifact.id);
            }
            break;
        case ARTIFACT_TYPE.Listeners:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.LISTENER] = currentProjectStructure.directoryMap[DIRECTORY_MAP.LISTENER].filter(value => value.id !== artifact.id);
            break;
        case ARTIFACT_TYPE.Functions:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.FUNCTION] = currentProjectStructure.directoryMap[DIRECTORY_MAP.FUNCTION].filter(value => value.id !== artifact.id);
            break;
        case ARTIFACT_TYPE.DataMappers:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.DATA_MAPPER] = currentProjectStructure.directoryMap[DIRECTORY_MAP.DATA_MAPPER].filter(value => value.id !== artifact.id);
            break;
        case ARTIFACT_TYPE.Connections:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.CONNECTION] = currentProjectStructure.directoryMap[DIRECTORY_MAP.CONNECTION].filter(value => value.id !== artifact.id);
            break;
        case ARTIFACT_TYPE.Types:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.TYPE] = currentProjectStructure.directoryMap[DIRECTORY_MAP.TYPE].filter(value => value.id !== artifact.id);
            break;
        case ARTIFACT_TYPE.Configurations:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.CONFIGURABLE] = currentProjectStructure.directoryMap[DIRECTORY_MAP.CONFIGURABLE].filter(value => value.id !== artifact.id);
            break;
        case ARTIFACT_TYPE.NaturalFunctions:
            currentProjectStructure.directoryMap[DIRECTORY_MAP.NP_FUNCTION] = currentProjectStructure.directoryMap[DIRECTORY_MAP.NP_FUNCTION].filter(value => value.id !== artifact.id);
            break;
        default:
            break;
    }

}
//Handle creations
async function handleCreations(artifact: BaseArtifact, key: string, currentProjectStructure: ProjectStructureResponse) {
    let visualizeEntry: ProjectStructureArtifactResponse;
    switch (key) {
        case ARTIFACT_TYPE.EntryPoints:
            if (artifact.id === "automation") {
                const entryValue = await getEntryValue(artifact, "task");
                currentProjectStructure.directoryMap[DIRECTORY_MAP.AUTOMATION].push(entryValue);
                visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.AUTOMATION, entryValue);
            } else {
                const entryValue = await getEntryValue(artifact, "http-service");
                currentProjectStructure.directoryMap[DIRECTORY_MAP.SERVICE].push(entryValue);
                visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.SERVICE, entryValue);
            }
            break;
        case ARTIFACT_TYPE.Listeners:
            const listenerValue = await getEntryValue(artifact, "http-service");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.LISTENER].push(listenerValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.LISTENER, listenerValue);
            break;
        case ARTIFACT_TYPE.Functions:
            const functionValue = await getEntryValue(artifact, "function");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.FUNCTION].push(functionValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.FUNCTION, functionValue);
            break;
        case ARTIFACT_TYPE.DataMappers:
            const dataMapperValue = await getEntryValue(artifact, "dataMapper");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.DATA_MAPPER].push(dataMapperValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.DATA_MAPPER, dataMapperValue);
            break;
        case ARTIFACT_TYPE.Connections:
            const connectionValue = await getEntryValue(artifact, "connection");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.CONNECTION].push(connectionValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.CONNECTION, connectionValue);
            break;
        case ARTIFACT_TYPE.Types:
            const typeValue = await getEntryValue(artifact, "type");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.TYPE].push(typeValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.TYPE, typeValue);
            break;
        case ARTIFACT_TYPE.Configurations:
            const configurableValue = await getEntryValue(artifact, "config");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.CONFIGURABLE].push(configurableValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.CONFIGURABLE, configurableValue);
            break;
        case ARTIFACT_TYPE.NaturalFunctions:
            const npFunctionValue = await getEntryValue(artifact, "function");
            currentProjectStructure.directoryMap[DIRECTORY_MAP.NP_FUNCTION].push(npFunctionValue);
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.NP_FUNCTION, npFunctionValue);
            break;
        default:
            break;
    }
    return visualizeEntry;
}

//Handle updates
async function handleUpdates(artifact: BaseArtifact, key: string, currentProjectStructure: ProjectStructureResponse) {
    let visualizeEntry: ProjectStructureArtifactResponse;
    switch (key) {
        case ARTIFACT_TYPE.EntryPoints:
            if (artifact.id === "automation") {
                const entryValue = await getEntryValue(artifact, "task");
                const index = currentProjectStructure.directoryMap[DIRECTORY_MAP.AUTOMATION].findIndex(value => value.id === artifact.id);
                if (index !== -1) {
                    currentProjectStructure.directoryMap[DIRECTORY_MAP.AUTOMATION][index] = entryValue;
                } else {
                    currentProjectStructure.directoryMap[DIRECTORY_MAP.AUTOMATION].push(entryValue);
                }
                visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.AUTOMATION, entryValue);
            } else {
                const entryValue = await getEntryValue(artifact, "http-service");
                const index = currentProjectStructure.directoryMap[DIRECTORY_MAP.SERVICE].findIndex(value => value.id === artifact.id);
                if (index !== -1) {
                    currentProjectStructure.directoryMap[DIRECTORY_MAP.SERVICE][index] = entryValue;
                } else {
                    currentProjectStructure.directoryMap[DIRECTORY_MAP.SERVICE].push(entryValue);
                }
                visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.SERVICE, entryValue);
            }
            break;
        case ARTIFACT_TYPE.Listeners:
            const listenerValue = await getEntryValue(artifact, "http-service");
            const listenerValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.LISTENER].findIndex(value => value.id === artifact.id);
            if (listenerValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.LISTENER][listenerValueIndex] = listenerValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.LISTENER].push(listenerValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.LISTENER, listenerValue);
            break;
        case ARTIFACT_TYPE.Functions:
            const functionValue = await getEntryValue(artifact, "function");
            const functionValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.FUNCTION].findIndex(value => value.id === artifact.id);
            if (functionValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.FUNCTION][functionValueIndex] = functionValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.FUNCTION].push(functionValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.FUNCTION, functionValue);
            break;
        case ARTIFACT_TYPE.DataMappers:
            const dataMapperValue = await getEntryValue(artifact, "dataMapper");
            const dataMapperValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.DATA_MAPPER].findIndex(value => value.id === artifact.id);
            if (dataMapperValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.DATA_MAPPER][dataMapperValueIndex] = dataMapperValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.DATA_MAPPER].push(dataMapperValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.DATA_MAPPER, dataMapperValue);
            break;
        case ARTIFACT_TYPE.Connections:
            const connectionValue = await getEntryValue(artifact, "connection");
            const connectionValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.CONNECTION].findIndex(value => value.id === artifact.id);
            if (connectionValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.CONNECTION][connectionValueIndex] = connectionValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.CONNECTION].push(connectionValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.CONNECTION, connectionValue);
            break;
        case ARTIFACT_TYPE.Types:
            const typeValue = await getEntryValue(artifact, "type");
            const typeValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.TYPE].findIndex(value => value.id === artifact.id);
            if (typeValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.TYPE][typeValueIndex] = typeValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.TYPE].push(typeValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.TYPE, typeValue);
            break;
        case ARTIFACT_TYPE.Configurations:
            const configurableValue = await getEntryValue(artifact, "config");
            const configurableValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.CONFIGURABLE].findIndex(value => value.id === artifact.id);
            if (configurableValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.CONFIGURABLE][configurableValueIndex] = configurableValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.CONFIGURABLE].push(configurableValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.CONFIGURABLE, configurableValue);
            break;
        case ARTIFACT_TYPE.NaturalFunctions:
            const npFunctionValue = await getEntryValue(artifact, "function");
            const npFunctionValueIndex = currentProjectStructure.directoryMap[DIRECTORY_MAP.NP_FUNCTION].findIndex(value => value.id === artifact.id);
            if (npFunctionValueIndex !== -1) {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.NP_FUNCTION][npFunctionValueIndex] = npFunctionValue;
            } else {
                currentProjectStructure.directoryMap[DIRECTORY_MAP.NP_FUNCTION].push(npFunctionValue);
            }
            visualizeEntry = await findTempDataEntry(DIRECTORY_MAP.NP_FUNCTION, npFunctionValue);
            break;
        default:
            break;
    }
    return visualizeEntry;
}

// Find the tempData Entry
async function findTempDataEntry(mapType: DIRECTORY_MAP, entryValue: ProjectStructureArtifactResponse) {
    let selectedEntry: ProjectStructureArtifactResponse;
    switch (mapType) {
        case DIRECTORY_MAP.SERVICE:
            // Check if the created entry matched the properties of the temp service model
            const tempServiceModel = StateMachine.context().tempData?.serviceModel;
            if (tempServiceModel) { // This is used to check if the created entry is a service model
                if (entryValue.moduleName === tempServiceModel.moduleName) {
                    if (entryValue.name.includes("-")) {
                        const servicePath = entryValue.name.split('-')[1].trim();
                        if (JSON.stringify(tempServiceModel.properties).includes(servicePath)) {
                            selectedEntry = entryValue;
                            break;
                        }
                    } else {
                        selectedEntry = entryValue;
                        break;
                    }
                }
            } else {
                const resources = entryValue.resources;
                // Check from current identifier
                const identifier = StateMachine.context().identifier;
                if (resources.length > 0) {
                    for (const resource of resources) {
                        if (resource.id === identifier) {
                            selectedEntry = entryValue;
                            break;
                        }
                    }
                }
            }
            break;
        case DIRECTORY_MAP.AUTOMATION:
            // Check from current identifier
            const automationIdentifier = StateMachine.context().identifier;
            if (automationIdentifier && automationIdentifier === "Automation") {
                selectedEntry = entryValue;
                break;
            } else {
                // Check if the created entry is a functionNode and matched the properties
                const tempFunction = StateMachine.context().tempData?.flowNode;
                if (tempFunction) {
                    if (tempFunction.properties?.functionName && entryValue.context === tempFunction.properties.functionName.value) {
                        selectedEntry = entryValue;
                        break;
                    }
                }
            }
            break;
        case DIRECTORY_MAP.FUNCTION:
        case DIRECTORY_MAP.NP_FUNCTION:
        case DIRECTORY_MAP.DATA_MAPPER:
            // Check from current identifier
            const identifier = StateMachine.context().identifier;
            if (identifier) {
                if (entryValue.context === identifier) {
                    selectedEntry = entryValue;
                    break;
                }
            } else {
                // Check if the created entry is a functionNode and matched the properties
                const tempFunction = StateMachine.context().tempData?.flowNode;
                if (tempFunction) {
                    if (tempFunction.properties?.functionName && entryValue.context === tempFunction.properties.functionName.value) {
                        selectedEntry = entryValue;
                        break;
                    }
                }
            }
            break;
        case DIRECTORY_MAP.CONNECTION:
        case DIRECTORY_MAP.TYPE:
        case DIRECTORY_MAP.CONFIGURABLE:
        case DIRECTORY_MAP.LOCAL_CONNECTORS:
        case DIRECTORY_MAP.LISTENER:
            // Check if the created entry matched the properties of the temp identifier
            const tempIdentifier = StateMachine.context().tempData?.identifier;
            if (tempIdentifier) {
                if (entryValue.name === tempIdentifier) {
                    selectedEntry = entryValue;
                }
            }
            break;
        default:
            break;
    }
    return selectedEntry;
}

async function populateLocalConnectors(projectDir: string, response: ProjectStructureResponse) {
    const filePath = `${projectDir}/Ballerina.toml`;
    const localConnectors = (await StateMachine.langClient().getOpenApiGeneratedModules({ projectPath: projectDir })).modules;
    const mappedEntries: ProjectStructureArtifactResponse[] = localConnectors.map(moduleName => ({
        id: moduleName,
        name: moduleName,
        path: filePath,
        type: "HTTP",
        icon: "connection",
        context: moduleName,
        resources: [],
        position: {
            endColumn: 61,
            endLine: 8,
            startColumn: 0,
            startLine: 5
        }
    }));

    response.directoryMap[DIRECTORY_MAP.LOCAL_CONNECTORS].push(...mappedEntries);
}

function getCustomEntryNodeIcon(type: string) {
    switch (type) {
        case "tcp":
            return "bi-tcp";
        case "ai":
            return "bi-ai-agent";
        case "kafka":
            return "bi-kafka";
        case "rabbitmq":
            return "bi-rabbitmq";
        case "nats":
            return "bi-nats";
        case "mqtt":
            return "bi-mqtt";
        case "grpc":
            return "bi-grpc";
        case "graphql":
            return "bi-graphql";
        case "java.jms":
            return "bi-java";
        case "github":
            return "bi-github";
        case "salesforce":
            return "bi-salesforce";
        case "asb":
            return "bi-asb";
        case "ftp":
            return "bi-ftp";
        case "file":
            return "bi-file";
        default:
            return "bi-globe";
    }
}

const getTypePrefix = (type: string): string => {
    if (!type) { return ""; }
    const parts = type.split(":");
    return parts.length > 1 ? parts[0] : type;
};
