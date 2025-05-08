/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FileStructure, ImportProjectRequest, ImportProjectResponse } from '@wso2-enterprise/mi-core';
import * as fs from 'fs';
import * as path from 'path';
import { parseString } from 'xml2js';
import { v4 as uuidv4 } from 'uuid';
import { dockerfileContent, rootPomXmlContent } from './templates';
import { createFolderStructure, copyDockerResources } from '.';
import { commands, Uri, window, workspace } from 'vscode';
import { extension } from '../MIExtensionContext';
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { LATEST_MI_VERSION } from './onboardingUtils';
import { changeRootPomForClassMediator } from './fileOperations';

enum Nature {
    MULTIMODULE,
    ESB,
    DS,
    DATASOURCE,
    CONNECTOR,
    REGISTRY,
    CLASS
}

export async function importProject(params: ImportProjectRequest): Promise<ImportProjectResponse> {
    const { source, directory, open } = params;

    const projectUuid = uuidv4();

    let { projectName, groupId, artifactId, version, runtimeVersion } = getProjectDetails(source);

    if (projectName && groupId && artifactId && version) {
        const folderStructure: FileStructure = {
            'pom.xml': rootPomXmlContent(projectName, groupId, artifactId, projectUuid, version, runtimeVersion ?? LATEST_MI_VERSION, ""),
            '.env': '',
            'src': {
                'main': {
                    'java': '',
                    'wso2mi': {
                        'artifacts': {
                            'apis': '',
                            'endpoints': '',
                            'inbound-endpoints': '',
                            'local-entries': '',
                            'message-processors': '',
                            'message-stores': '',
                            'proxy-services': '',
                            'sequences': '',
                            'tasks': '',
                            'templates': '',
                            'data-services': '',
                            'data-sources': '',
                        },
                        'resources': {
                            'registry': {
                                'gov': '',
                                'conf': '',
                            },
                            'metadata': '',
                            'connectors': '',
                            'conf': {
                                'config.properties': ''
                            }
                        },
                    },
                },
                'test': {
                    'wso2mi': '',
                    'resources': {
                        "mock-services": '',
                    }
                }
            },
            'deployment': {
                'docker': {
                    'Dockerfile': dockerfileContent(),
                    'resources': ''
                },
                'libs': '',
            },
        };
        // Need to close all the opened editors before migrating the project
        // if not, it will cause issues with the file operations
        await commands.executeCommand('workbench.action.closeAllEditors');

        const destinationFolderPath = path.join(source, ".backup");
        moveFiles(source, destinationFolderPath);

        await createFolderStructure(directory, folderStructure);
        copyDockerResources(extension.context.asAbsolutePath(path.join('resources', 'docker-resources')), directory);

        console.log("Created project structure for project: " + projectName);
        await migrateConfigs(path.join(source, ".backup"), directory);

        window.showInformationMessage(`Successfully imported ${projectName} project`);

        if (open) {
            commands.executeCommand("workbench.action.reloadWindow");
            return { filePath: directory };
        }

        return { filePath: directory };
    } else {
        window.showErrorMessage('Could not find the project details from the provided project: ', source);
        return { filePath: "" };
    }
}

export function getProjectDetails(filePath: string) {
    let projectName: string | undefined;
    let groupId: string | undefined;
    let artifactId: string | undefined;
    let version: string | undefined;
    let runtimeVersion: string | undefined;
    const pomContent = fs.readFileSync(path.join(filePath, "pom.xml"), 'utf8');

    parseString(pomContent, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
        if (err) {
            console.error('Error parsing pom.xml:', err);
            return;
        }

        projectName = result?.project?.name;
        groupId = result?.project?.groupId;
        artifactId = result?.project?.artifactId;
        version = result?.project?.version;
        runtimeVersion = result?.project?.properties["project.runtime.version"];
    });

    return { projectName, groupId, artifactId, version, runtimeVersion };
}

export async function migrateConfigs(source: string, target: string) {
    // determine the project type here
    const projectType = determineProjectType(source);
    let hasClassMediatorModule = false;
    if (projectType === Nature.MULTIMODULE) {
        const items = fs.readdirSync(source, { withFileTypes: true });
        items.forEach(item => {
            if (item.isDirectory()) {
                const sourceAbsolutePath = path.join(source, item.name);
                const moduleType = determineProjectType(path.join(source, item.name));
                if (moduleType === Nature.ESB || moduleType === Nature.DS ||
                    moduleType === Nature.DATASOURCE || moduleType === Nature.CONNECTOR ||
                    moduleType === Nature.REGISTRY || moduleType === Nature.CLASS) {
                    copyConfigsToNewProjectStructure(moduleType, sourceAbsolutePath, target);
                }
                if (moduleType === Nature.CLASS) {
                    hasClassMediatorModule = true;
                }
            }
        });
    }
    if (hasClassMediatorModule) {
        await changeRootPomForClassMediator();
    }
}

function determineProjectType(source: string): Nature | undefined {
    const rootMetaDataFilePath = path.join(source, '.project');
    let configType;
    if (fs.existsSync(rootMetaDataFilePath)) {
        const projectFileContent = fs.readFileSync(rootMetaDataFilePath, 'utf-8');
        parseString(projectFileContent, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
            if (err) {
                console.error('Error occured while reading ' + rootMetaDataFilePath, err);
                return;
            }
            const projectDescription = result.projectDescription;
            if (projectDescription && projectDescription.natures && projectDescription.natures.nature) {
                let nature = projectDescription.natures.nature;
                if (Array.isArray(nature)) {
                    nature = nature.find(element => element.startsWith("org.wso2.developerstudio.eclipse"));
                }

                switch (nature) {
                    case 'org.wso2.developerstudio.eclipse.mavenmultimodule.project.nature':
                        configType = Nature.MULTIMODULE;
                        break;
                    case 'org.wso2.developerstudio.eclipse.esb.project.nature':
                        configType = Nature.ESB;
                        break;
                    case 'org.wso2.developerstudio.eclipse.ds.project.nature':
                        configType = Nature.DS;
                        break;
                    case 'org.wso2.developerstudio.eclipse.datasource.project.nature':
                        configType = Nature.DATASOURCE;
                        break;
                    case 'org.wso2.developerstudio.eclipse.artifact.connector.project.nature':
                        configType = Nature.CONNECTOR;
                        break;
                    case 'org.wso2.developerstudio.eclipse.general.project.nature':
                        configType = Nature.REGISTRY;
                        break;
                    case 'org.wso2.developerstudio.eclipse.artifact.mediator.project.nature':
                        configType = Nature.CLASS;
                        break;
                }
            }
        });
    }
    return configType;
}

function copyConfigsToNewProjectStructure(nature: Nature, source: string, target: string) {
    switch (nature) {
        case Nature.ESB:
            processArtifactsFolder(source, target);
            processMetaDataFolder(source, target);
            processTestsFolder(source, target);
            break;
        case Nature.DATASOURCE:
            processDataSourcesFolder(source, target);
            break;
        case Nature.DS:
            processDataServicesFolder(source, target);
            break;
        case Nature.CONNECTOR:
            processConnectors(source, target);
            break;
        case Nature.REGISTRY:
            processRegistryResources(source, target);
            break;
        case Nature.CLASS:
            processClassMediators(source, target);
            break;

    }
}

function processArtifactsFolder(source: string, target: string) {
    const synapseConfigsPath = path.join(source, 'src', 'main', 'synapse-config');
    const artifactsPath = path.join(target, 'src', 'main', 'wso2mi', 'artifacts');
    const sourceFolders = [
        'api',
        'endpoints',
        'inbound-endpoints',
        'local-entries',
        'message-processors',
        'message-stores',
        'proxy-services',
        'sequences',
        'tasks',
        'templates',
    ];
    const targetFolders = [
        'apis',
        'endpoints',
        'inbound-endpoints',
        'local-entries',
        'message-processors',
        'message-stores',
        'proxy-services',
        'sequences',
        'tasks',
        'templates',
    ];

    sourceFolders.forEach((sourceFolder, index) => {
        const sourcePath = path.join(synapseConfigsPath, sourceFolder);
        const targetPath = path.join(artifactsPath, targetFolders[index]);

        copy(sourcePath, targetPath);
    });

}

function processMetaDataFolder(source: string, target: string) {
    const oldMetaDataPath = path.join(source, 'src', 'main', 'resources', 'metadata');
    const newMetaDataPath = path.join(target, 'src', 'main', 'wso2mi', 'resources', 'metadata');

    copy(oldMetaDataPath, newMetaDataPath);
}

function processDataSourcesFolder(source: string, target: string) {
    const oldDataSourcePath = path.join(source, 'datasource');
    const newDataSourcePath = path.join(target, 'src', 'main', 'wso2mi', 'artifacts', 'data-sources');

    copy(oldDataSourcePath, newDataSourcePath);
}

function processDataServicesFolder(source: string, target: string) {
    const oldDataServicePath = path.join(source, 'dataservice');
    const newDataServicePath = path.join(target, 'src', 'main', 'wso2mi', 'artifacts', 'data-services');

    copy(oldDataServicePath, newDataServicePath);
}

function processConnectors(source: string, target: string) {
    const newConnectorPath = path.join(target, 'src', 'main', 'wso2mi', 'resources', 'connectors');

    fs.readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Failed to list contents of the folder: ${source}`, err);
            return;
        }

        files.forEach(file => {
            if (file.isFile()) {
                if (path.extname(file.name).toLowerCase() === '.zip') {
                    copyFile(path.join(source, file.name), path.join(newConnectorPath, file.name));
                }
            }
        });
    });
}

function processRegistryResources(source: string, target: string) {
    const artifactXMLPath = path.join(source, 'artifact.xml');
    const newRegistryPath = path.join(target, 'src', 'main', 'wso2mi', 'resources', 'registry');
    copyFile(artifactXMLPath, path.join(newRegistryPath, 'artifact.xml'));

    //read artifact.xml
    const xmlContent = fs.readFileSync(artifactXMLPath, 'utf-8');

    parseString(xmlContent, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
        if (err) {
            console.error('Error parsing pom.xml:', err);
            return;
        }

        const artifactsData = result.artifacts.artifact;
        const artifacts = Array.isArray(artifactsData) ? artifactsData : [artifactsData];

        artifacts.forEach(artifact => {
            const fileName = artifact.item.file;
            const relativePath = artifact.item.path;
            let targetAbsolutePath;

            if (relativePath.startsWith('/_system/governance')) {
                targetAbsolutePath = path.join(newRegistryPath, path.normalize(relativePath.replace(/^\/_system\/governance/, 'gov')));
            } else if (relativePath.startsWith('/_system/config')) {
                targetAbsolutePath = path.join(newRegistryPath, path.normalize(relativePath.replace(/^\/_system\/config/, 'conf')));
            }
            const sourceFile = path.join(source, fileName);
            const targetFile = path.join(targetAbsolutePath, fileName);
            try {
                fs.mkdirSync(targetAbsolutePath, { recursive: true });
                copyFile(sourceFile, targetFile);
            } catch (err) {
                console.error(`Failed to create folder structure ${targetAbsolutePath}`, err);
            }
        });
    });
}

function processTestsFolder(source: string, target: string) {
    const oldTestPath = path.join(source, 'test');
    const newTestPath = path.join(target, 'src', 'test', 'wso2mi');
    copy(oldTestPath, newTestPath);
    const oldResPath = path.join(oldTestPath, 'resources', 'mock-services');
    const newResPath = path.join(target, 'src', 'test', 'resources', 'mock-services');
    copy(oldResPath, newResPath);
    fixTestFilePaths(target);
}

function processClassMediators(source: string, target: string) {
    const oldClassMediatorPath = path.join(source, 'src', 'main', 'java');
    const newClassMediatorPath = path.join(target, 'src', 'main', 'java');

    copyFilesAndDirectories();

    function copyFilesAndDirectories() {
        function copyRecursive(source: string, target: string) {
            if (!fs.existsSync(source)) {
                return;
            }
            const items = fs.readdirSync(source, { withFileTypes: true });
            items.forEach(item => {
                const sourceItemPath = path.join(source, item.name);
                const targetItemPath = path.join(target, item.name);
                if (item.isDirectory()) {
                    fs.mkdirSync(targetItemPath, { recursive: true });
                    copyRecursive(sourceItemPath, targetItemPath);
                } else {
                    fs.copyFileSync(sourceItemPath, targetItemPath);
                }
            });
        }

        copyRecursive(oldClassMediatorPath, newClassMediatorPath);
    }
}

function fixTestFilePaths(source: string) {
    const testPath = path.join(source, 'src', 'test', 'wso2mi');
    const items = fs.readdirSync(testPath, { withFileTypes: true });
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@",
        parseTagValue: true,
        format: true,
    };
    const parser = new XMLParser(options);
    items.forEach(item => {
        if (!item.isDirectory()) {
            const filePath = path.join(testPath, item.name);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = parser.parse(fileContent);
            if (jsonData['unit-test']['artifacts']) {
                let artifacts = jsonData['unit-test']['artifacts'];
                let testArtifact = artifacts['test-artifact']['artifact'];
                if (testArtifact) {
                    artifacts['test-artifact']['artifact'] = updateArtifactPath(testArtifact);
                }
                let supportArtifact = artifacts['supportive-artifacts'];
                if (supportArtifact) {
                    let supportArtifactArr = supportArtifact["artifact"];
                    if (supportArtifactArr && Array.isArray(supportArtifactArr)) {
                        supportArtifactArr.forEach((supportArtifact, index) => {
                            supportArtifactArr[index] = updateArtifactPath(supportArtifact);
                        });
                    } else if (supportArtifactArr) {
                        supportArtifact["artifact"] = updateArtifactPath(supportArtifactArr);
                    }
                }
                let registryResources = artifacts['registry-resources'];
                if (registryResources) {
                    const registryResourcesArr = registryResources["registry-resource"];
                    if (registryResourcesArr && Array.isArray(registryResourcesArr)) {
                        registryResourcesArr.forEach(registryResource => {
                            updateRegistryArtifactPath(registryResource);
                        });
                    } else if (registryResourcesArr) {
                        updateRegistryArtifactPath(registryResourcesArr);
                    }
                }
                let connectorResources = artifacts['connector-resources'];
                if (connectorResources) {
                    let connectorResourcesArr = connectorResources["connector-resource"];
                    if (connectorResourcesArr && Array.isArray(connectorResourcesArr)) {
                        connectorResourcesArr.forEach((connectorResource, index) => {
                            connectorResourcesArr[index] = updateConnectorPath(connectorResource);
                        });
                    } else if (connectorResourcesArr) {
                        connectorResources["connector-resource"] = updateConnectorPath(connectorResourcesArr);
                    }
                }
            }
            let mockServices = jsonData["unit-test"]["mock-services"]
            if (mockServices) {
                let mockServicesArr = mockServices["mock-service"];
                if (mockServicesArr && Array.isArray(mockServicesArr)) {
                    mockServicesArr.forEach((mockService, index) => {
                        mockServicesArr[index] = updateMockServicePath(mockService);
                    });
                } else if (mockServicesArr) {
                    mockServices["mock-service"] = updateMockServicePath(mockServicesArr);
                }
            }
            const builder = new XMLBuilder(options);
            const updatedXmlString = builder.build(jsonData);
            fs.writeFileSync(filePath, updatedXmlString);
        }
    });
}

function updateArtifactPath(artifact: any): string {
    let index = artifact.lastIndexOf("/src/main/synapse-config/");
    index += "/src/main/synapse-config/".length;
    artifact = artifact.substring(index);
    if (artifact.startsWith("api")) {
        artifact = artifact.substring("api".length);
        artifact = "apis" + artifact;
    }
    return `src/main/wso2mi/artifacts/${artifact}`;
}

function updateConnectorPath(connector: any): string {
    let index = connector.lastIndexOf("/");
    connector = connector.substring(index + 1);
    return `src/main/wso2mi/resources/connectors/${connector}`;
}

function updateMockServicePath(mockService: any): string {
    let index = mockService.lastIndexOf("/test/resources/mock-services/");
    index += "/test/resources/mock-services/".length;
    mockService = mockService.substring(index);
    return `src/test/resources/mock-services/${mockService}`;
}

function updateRegistryArtifactPath(registryResource: any) {
    let registryResourcePath = registryResource['registry-path'];
    const newRegPath = "src/main/wso2mi/resources/registry/";
    if (registryResourcePath.startsWith("/_system/governance")) {
        registryResourcePath = registryResourcePath.substring("/_system/governance".length);
        registryResourcePath = newRegPath + "gov" + registryResourcePath + "/" + registryResource['file-name'];
    } else if (registryResourcePath.startsWith("/_system/config")) {
        registryResourcePath = registryResourcePath.substring("/_system/config".length);
        registryResourcePath = newRegPath + "conf" + registryResourcePath + "/" + registryResource['file-name'];
    }
    registryResource['artifact'] = registryResourcePath;
}

function copy(source: string, target: string) {
    if (!fs.existsSync(source)) {
        return;
    }
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourceItemPath = path.join(source, file);
        const destinationItemPath = path.join(target, file);
        if (!fs.statSync(sourceItemPath).isDirectory()) {
            copyFile(sourceItemPath, destinationItemPath);
        }
    });
}

function copyFile(sourcePath: string, targetPath: string) {
    try {
        fs.copyFileSync(sourcePath, targetPath);
    } catch (err) {
        console.error(`Failed to copy file from ${sourcePath} to ${targetPath}`, err);
    }
}

function moveFiles(sourcePath: string, destinationPath: string) {

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }
    const items = fs.readdirSync(sourcePath);

    items.forEach(item => {
        if (item === '.backup') {
            return;
        }
        const sourceItemPath = path.join(sourcePath, item);
        const destinationItemPath = path.join(destinationPath, item);
        const isDirectory = fs.statSync(sourceItemPath).isDirectory();

        if (isDirectory) {
            moveFiles(sourceItemPath, destinationItemPath);
            fs.rmSync(sourceItemPath, { recursive: true });
        } else {
            fs.renameSync(sourceItemPath, destinationItemPath);
        }
    });
}
