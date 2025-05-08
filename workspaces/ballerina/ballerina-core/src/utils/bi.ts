// /**
//  * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */

// import { STKindChecker } from "@wso2-enterprise/syntax-tree";
// import { ComponentInfo } from "../interfaces/ballerina";
// import { DIRECTORY_MAP, ProjectStructureArtifactResponse, ProjectStructureResponse } from "../interfaces/bi";
// import { BallerinaProjectComponents, ExtendedLangClientInterface } from "../interfaces/extended-lang-client";
// import { CDModel } from "../interfaces/component-diagram";
// import { URI, Utils } from "vscode-uri";
// import path from "path";
// import { LineRange } from "../interfaces/common";
// import { ServiceModel } from "../interfaces/service";

// export async function buildProjectStructure(projectDir: string, langClient: ExtendedLangClientInterface): Promise<ProjectStructureResponse> {
//     const result: ProjectStructureResponse = {
//         projectName: "",
//         directoryMap: {
//             [DIRECTORY_MAP.SERVICES]: [],
//             [DIRECTORY_MAP.AUTOMATION]: [],
//             [DIRECTORY_MAP.LISTENERS]: [],
//             [DIRECTORY_MAP.FUNCTIONS]: [],
//             [DIRECTORY_MAP.TRIGGERS]: [],
//             [DIRECTORY_MAP.CONNECTIONS]: [],
//             [DIRECTORY_MAP.TYPES]: [],
//             [DIRECTORY_MAP.CONFIGURATIONS]: [],
//             [DIRECTORY_MAP.RECORDS]: [],
//             [DIRECTORY_MAP.DATA_MAPPERS]: [],
//             [DIRECTORY_MAP.ENUMS]: [],
//             [DIRECTORY_MAP.CLASSES]: [],
//             [DIRECTORY_MAP.NATURAL_FUNCTIONS]: [],
//             [DIRECTORY_MAP.LOCAL_CONNECTORS]: [],
//         }
//     };
//     const components = await langClient.getBallerinaProjectComponents({
//         documentIdentifiers: [{ uri: URI.file(projectDir).toString() }]
//     });
//     const designArtifacts = await langClient.getProjectArtifacts({ projectPath: projectDir });
//     console.log("designArtifacts", designArtifacts);
//     const componentModel = await langClient.getDesignModel({
//         projectPath: projectDir
//     });
//     await traverseComponents(components, result, langClient, componentModel?.designModel);
//     await populateLocalConnectors(projectDir, result, langClient);
//     return result;
// }

// async function traverseComponents(components: BallerinaProjectComponents, response: ProjectStructureResponse, langClient: ExtendedLangClientInterface, designModel: CDModel) {
//     const designServices: ComponentInfo[] = [];
//     const connectionServices: ComponentInfo[] = [];
//     if (designModel) {
//         designModel.connections.forEach(connection => {
//             const connectionInfo: ComponentInfo = {
//                 name: connection.symbol,
//                 filePath: path.basename(connection.location.filePath),
//                 startLine: connection.location.startLine.line,
//                 startColumn: connection.location.startLine.offset,
//                 endLine: connection.location.endLine.line,
//                 endColumn: connection.location.endLine.offset,
//             }
//             connectionServices.push(connectionInfo);
//         });
//         designModel?.services.forEach(service => {
//             const resources: ComponentInfo[] = [];
//             service.resourceFunctions.forEach(func => {
//                 const resourceInfo: ComponentInfo = {
//                     name: service?.type === "graphql:Service" ? `${func.path}` : `${func.accessor}-${func.path}`,
//                     filePath: path.basename(func.location.filePath),
//                     startLine: func.location.startLine.line,
//                     startColumn: func.location.startLine.offset,
//                     endLine: func.location.endLine.line,
//                     endColumn: func.location.endLine.offset,
//                 }
//                 resources.push(resourceInfo);
//             })

//             service.remoteFunctions.forEach(func => {
//                 const resourceInfo: ComponentInfo = {
//                     name: func.name,
//                     filePath: path.basename(func.location.filePath),
//                     startLine: func.location.startLine.line,
//                     startColumn: func.location.startLine.offset,
//                     endLine: func.location.endLine.line,
//                     endColumn: func.location.endLine.offset,
//                 }
//                 resources.push(resourceInfo);
//             })

//             const serviceInfo: ComponentInfo = {
//                 name: service.absolutePath ? service.absolutePath : service.type,
//                 filePath: path.basename(service.location.filePath),
//                 startLine: service.location.startLine.line,
//                 startColumn: service.location.startLine.offset,
//                 endLine: service.location.endLine.line,
//                 endColumn: service.location.endLine.offset,
//                 resources
//             }
//             designServices.push(serviceInfo);
//         });
//     }

//     for (const pkg of components.packages) {
//         response.projectName = pkg.name;
//         for (const module of pkg.modules) {
//             response.directoryMap[DIRECTORY_MAP.AUTOMATION].push(...await getComponents(langClient, module.automations, pkg.filePath, "task", DIRECTORY_MAP.AUTOMATION));
//             response.directoryMap[DIRECTORY_MAP.SERVICES].push(...await getComponents(langClient, designServices.length > 0 && !module?.name ? designServices : module.services, pkg.filePath, "http-service", DIRECTORY_MAP.SERVICES));
//             response.directoryMap[DIRECTORY_MAP.LISTENERS].push(...await getComponents(langClient, module.listeners, pkg.filePath, "http-service", DIRECTORY_MAP.LISTENERS, designModel));
//             response.directoryMap[DIRECTORY_MAP.FUNCTIONS].push(...await getComponents(langClient, module.functions, pkg.filePath, "function", DIRECTORY_MAP.FUNCTIONS));
//             response.directoryMap[DIRECTORY_MAP.CONNECTIONS].push(...await getComponents(langClient, module.moduleVariables.filter(item => connectionServices.map(conItem => conItem.name).includes(item.name.trim())), pkg.filePath, "connection", DIRECTORY_MAP.CONNECTIONS));
//             response.directoryMap[DIRECTORY_MAP.TYPES].push(...await getComponents(langClient, module.types, pkg.filePath, "type"));
//             response.directoryMap[DIRECTORY_MAP.RECORDS].push(...await getComponents(langClient, module.records, pkg.filePath, "type"));
//             response.directoryMap[DIRECTORY_MAP.ENUMS].push(...await getComponents(langClient, module.enums, pkg.filePath, "type"));
//             response.directoryMap[DIRECTORY_MAP.CLASSES].push(...await getComponents(langClient, module.classes, pkg.filePath, "type"));
//             response.directoryMap[DIRECTORY_MAP.CONFIGURATIONS].push(...await getComponents(langClient, module.configurableVariables, pkg.filePath, "config"));
//             response.directoryMap[DIRECTORY_MAP.NATURAL_FUNCTIONS].push(...await getComponents(langClient, module.naturalFunctions, pkg.filePath, "function"));
//         }
//     }

//     // Move data mappers to a separate category
//     const functions = response.directoryMap[DIRECTORY_MAP.FUNCTIONS];
//     response.directoryMap[DIRECTORY_MAP.FUNCTIONS] = [];
//     for (const func of functions) {
//         try {
//             const res = await langClient.getSTByRange({
//                 documentIdentifier: { uri: URI.file(func.path).toString() },
//                 lineRange: {
//                     start: {
//                         line: func.position.startLine,
//                         character: func.position.startColumn
//                     },
//                     end: {
//                         line: func.position.endLine,
//                         character: func.position.endColumn
//                     }
//                 }
//             });
//             if (res && 'syntaxTree' in res) {
//                 const funcST = res.syntaxTree;
//                 if (funcST
//                     && STKindChecker.isFunctionDefinition(funcST)
//                     && STKindChecker.isExpressionFunctionBody(funcST.functionBody)
//                 ) {
//                     func.icon = "dataMapper";
//                     response.directoryMap[DIRECTORY_MAP.DATA_MAPPERS].push(func);
//                 } else {
//                     response.directoryMap[DIRECTORY_MAP.FUNCTIONS].push(func);
//                 }
//             }
//         } catch (error) {
//             console.log("Data mapper ST fetch failed:", error);
//         }
//     }
// }

// async function getComponents(langClient: ExtendedLangClientInterface, components: ComponentInfo[], projectPath: string, icon: string, dtype?: DIRECTORY_MAP, designModel?: CDModel): Promise<ProjectStructureArtifactResponse[]> {
//     if (!components) {
//         return [];
//     }
//     const entries: ProjectStructureArtifactResponse[] = [];
//     let compType = "HTTP";
//     let serviceModel: ServiceModel = undefined;
//     for (const comp of components) {
//         if (dtype === DIRECTORY_MAP.FUNCTIONS && comp.name === "main") {
//             continue; // Skip main function
//         }
//         const componentFile = Utils.joinPath(URI.parse(projectPath), comp.filePath).fsPath;

//         if (dtype === DIRECTORY_MAP.SERVICES) {
//             try {
//                 const lineRange: LineRange = { startLine: { line: comp.startLine, offset: comp.startColumn }, endLine: { line: comp.endLine, offset: comp.endColumn } };
//                 const serviceResponse = await langClient.getServiceModelFromCode({ filePath: componentFile, codedata: { lineRange } });
//                 if (serviceResponse?.service) {
//                     serviceModel = serviceResponse.service;
//                     const triggerType = serviceModel.displayName;
//                     const labelName = serviceModel.properties['name'].value;
//                     compType = triggerType;
//                     comp.name = `${triggerType} - ${labelName}`
//                     icon = `bi-${serviceModel.moduleName}`;
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }

//         let iconValue;
//         if (serviceModel?.listenerProtocol) {
//             iconValue = getCustomEntryNodeIcon(serviceModel?.listenerProtocol);
//         } else {
//             iconValue = comp.name.includes('-') && !serviceModel ? `${comp.name.split('-')[0]}-api` : icon;
//         }

//         if (designModel && dtype === DIRECTORY_MAP.LISTENERS) {
//             const listener = designModel.listeners.find(listener => listener.symbol === comp.name);
//             console.log("===>>> listener", { listener });
//             if (listener) {
//                 iconValue = getCustomEntryNodeIcon(getTypePrefix(listener.type));
//             }
//         }

//         if (!comp.name && serviceModel) {
//             comp.name = `${serviceModel?.listenerProtocol}:Service`
//         }


//         const fileEntry: ProjectStructureArtifactResponse = {
//             name: dtype === DIRECTORY_MAP.SERVICES ? getComponentName(comp.name, serviceModel) || comp.filePath.replace(".bal", "") : getComponentName(comp.name, serviceModel),
//             path: componentFile,
//             type: compType,
//             icon: iconValue,
//             context: comp.name,
//             serviceModel: serviceModel,
//             resources: serviceModel?.listenerProtocol === "agent" ? [] : comp?.resources ? await getComponents(langClient, comp?.resources, projectPath, "") : [],
//             position: serviceModel?.listenerProtocol === "agent" ? {
//                 endColumn: comp.resources[0].endColumn,
//                 endLine: comp.resources[0].endLine,
//                 startColumn: comp.resources[0].startColumn,
//                 startLine: comp.resources[0].startLine
//             } : {
//                 endColumn: comp.endColumn,
//                 endLine: comp.endLine,
//                 startColumn: comp.startColumn,
//                 startLine: comp.startLine
//             }
//         };
//         if (dtype === DIRECTORY_MAP.AUTOMATION) {
//             fileEntry.name = "automation"
//         }
//         if (dtype === DIRECTORY_MAP.CONNECTIONS) {
//             entries.push(fileEntry);
//         } else {
//             entries.push(fileEntry);
//         }

//     }
//     return entries;
// }

// function getComponentName(name: string, serviceModel: ServiceModel) {
//     if (serviceModel?.listenerProtocol === "agent") {
//         return name.startsWith('/') ? name.substring(1) : name;
//     }
//     return name;
// }

// async function populateLocalConnectors(projectDir: string, response: ProjectStructureResponse, langClient: ExtendedLangClientInterface) {
//     const filePath = `${projectDir}/Ballerina.toml`;
//     const localConnectors = (await langClient.getOpenApiGeneratedModules({ projectPath: projectDir })).modules;
//     const mappedEntries: ProjectStructureArtifactResponse[] = localConnectors.map(moduleName => ({
//         name: moduleName,
//         path: filePath,
//         type: "HTTP",
//         icon: "connection",
//         context: moduleName,
//         resources: [],
//         position: {
//             endColumn: 61,
//             endLine: 8,
//             startColumn: 0,
//             startLine: 5
//         }
//     }));

//     response.directoryMap[DIRECTORY_MAP.LOCAL_CONNECTORS].push(...mappedEntries);
// }

// function getCustomEntryNodeIcon(type: string) {
//     switch (type) {
//         case "tcp":
//             return "bi-tcp";
//         case "agent":
//             return "bi-ai-agent";
//         case "kafka":
//             return "bi-kafka";
//         case "rabbitmq":
//             return "bi-rabbitmq";
//         case "nats":
//             return "bi-nats";
//         case "mqtt":
//             return "bi-mqtt";
//         case "grpc":
//             return "bi-grpc";
//         case "graphql":
//             return "bi-graphql";
//         case "java.jms":
//             return "bi-java";
//         case "github":
//             return "bi-github";
//         case "salesforce":
//             return "bi-salesforce";
//         case "asb":
//             return "bi-asb";
//         case "ftp":
//             return "bi-ftp";
//         case "file":
//             return "bi-file";
//         default:
//             return "bi-http-service";
//     }
// }

// const getTypePrefix = (type: string): string => {
//     if (!type) return "";
//     const parts = type.split(":");
//     return parts.length > 1 ? parts[0] : type;
// };
