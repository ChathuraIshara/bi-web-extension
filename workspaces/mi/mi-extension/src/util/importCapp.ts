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
import { v4 as uuidv4 } from 'uuid';
import { dockerfileContent, rootPomXmlContent } from './templates';
import { createFolderStructure, copyDockerResources } from '.';
import { commands, Uri, window } from 'vscode';
import { extension } from '../MIExtensionContext';
import { XMLParser, XMLBuilder, X2jOptions, XmlBuilderOptions } from "fast-xml-parser";
import { LATEST_MI_VERSION } from './onboardingUtils';
const AdmZip = require('adm-zip');

const parserOptions: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
};

const builderOptions: XmlBuilderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    oneListGroup: true,
    format: true,
};

const xmlParser = new XMLParser(parserOptions);
const xmlBuilder = new XMLBuilder(builderOptions);

interface RegistryPath {
    relativePath: string;
    isGov: boolean;
}

interface RegistryInfo {
    artifacts: RegistryArtifact[];
}

interface RegistryArtifact {
    artifact: ArtifactInfo;
}

interface ArtifactInfo {
    "@_name": string;
    "@_groupId": string;
    "@_version": string;
    "@_type": string;
    "@_serverRole": string;
    item?: RegistryItem;
    collection?: RegistryCollection;
}

interface RegistryItem {
    file: string;
    path: string;
    mediaType: string;
    properties: string;
}

interface RegistryCollection {
    directory: string;
    path: string;
    mediaType: string;
    properties: string;
}


export async function importCapp(params: ImportProjectRequest): Promise<ImportProjectResponse> {
    const { source, directory, open } = params;

    const projectUuid = uuidv4();

    const extractFolderPath = path.join(directory, ".temp");
    await extractCapp(source, extractFolderPath);

    let { projectName, groupId, artifactId, version } = getProjectDetails(path.basename(source));

    if (projectName && groupId && artifactId && version) {
        const folderStructure: FileStructure = {
            'pom.xml': rootPomXmlContent(projectName, groupId, artifactId, projectUuid, version, LATEST_MI_VERSION, ""),
            '.env': '',
            'src': {
                'main': {
                    'wso2mi': {
                        'java': '',
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
                            },
                        },
                    },
                    'java': ''
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

        await createFolderStructure(directory, folderStructure);
        copyDockerResources(extension.context.asAbsolutePath(path.join('resources', 'docker-resources')), directory);

        console.log("Created project structure for project: " + projectName);
        importConfigs(extractFolderPath, directory);

        window.showInformationMessage(`Successfully imported ${projectName} project`);

        if (fs.existsSync(extractFolderPath)) {
            fs.rmSync(extractFolderPath, { recursive: true });
        }

        if (open) {
            commands.executeCommand("workbench.action.reloadWindow");
            return { filePath: directory };
        }
        commands.executeCommand('vscode.openFolder', Uri.file(directory));
        return { filePath: directory };
    } else {
        window.showErrorMessage('Could not find the project details from the provided project: ', source);
        return { filePath: "" };
    }
}

function getProjectDetails(source: string): { projectName: any; groupId: any; artifactId: any; version: any; } {

    const match = source.match(/^(.+)_(\d+(?:\.\d+){0,2})\.zip$/);
    const projectName = match ? match[1] : "sample";
    const version = match ? match[2] : "1.0.0";
    return { projectName: projectName, groupId: "org.wso2", artifactId: projectName, version: version };
}

async function extractCapp(source: string, extractFolderPath: string) {
    const zipFilePath = source.replace(/.car$/, ".zip");
    fs.renameSync(source, zipFilePath);
    const zip = new AdmZip(zipFilePath);

    if (fs.existsSync(extractFolderPath)) {
        fs.rmSync(extractFolderPath, { recursive: true });
    }
    zip.extractAllTo(extractFolderPath, true);
}

function importConfigs(source: string, directory: string) {

    let registryArtifactsInfo: RegistryInfo = { artifacts: [] };

    const metadataPath = path.join(source, "metadata.xml");
    const artifactFilePath = path.join(source, "artifacts.xml");
    let sourceMetadataPath: string;
    if (fs.existsSync(metadataPath)) {
        sourceMetadataPath = metadataPath;
    } else {
        sourceMetadataPath = artifactFilePath;
    }

    const metadataContent = fs.readFileSync(sourceMetadataPath, "utf-8");
    const metadataInfo = xmlParser.parse(metadataContent);
    const dependencies = metadataInfo["artifacts"]["artifact"]["dependency"];
    if (dependencies) {
        for (const dependency of dependencies) {
            const dependencyName = dependency["@_artifact"];
            const version = dependency["@_version"];
            let isFileAvailable: boolean;
            let dependencyPath = path.join(source, dependencyName + "_" + version);
            if (fs.existsSync(dependencyPath)) {
                isFileAvailable = true;
            } else {
                dependencyPath = path.join(source, "metadata", dependencyName + "_" + version);
                isFileAvailable = fs.existsSync(dependencyPath);
            }
            if (isFileAvailable) {
                const dependencyArtifactPath = path.join(dependencyPath, "artifact.xml");
                const dependencyArtifactContent = fs.readFileSync(dependencyArtifactPath, "utf-8");
                const artifactInfo = xmlParser.parse(dependencyArtifactContent);
                const dependencyType = artifactInfo["artifact"]["@_type"];
                const fileName = artifactInfo["artifact"]["file"];
                const sourceFilePath = path.join(dependencyPath, fileName);
                let targetFilePath: string;
                if (dependencyType === "registry/resource") {
                    let infoJson = { artifact: { ["@_name"]: artifactInfo["artifact"]["@_name"], "@_groupId": "com.microintegrator.projects", ["@_version"]: artifactInfo["artifact"]["@_version"], ["@_type"]: artifactInfo["artifact"]["@_type"], ["@_serverRole"]: artifactInfo["artifact"]["@_serverRole"] } };
                    if (fs.existsSync(sourceFilePath)) {
                        const registryInfo = fs.readFileSync(sourceFilePath, "utf-8");
                        const registryInfoJson = xmlParser.parse(registryInfo);
                        const resource = registryInfoJson["resources"];
                        if (resource["item"]) {
                            infoJson.artifact["item"] = resource["item"];
                            const resourceFileName = resource["item"]["file"];
                            const registryPath = extractRegistryPath(resource["item"]["path"])
                            const sourceResourcePath = path.join(dependencyPath, "resources", resourceFileName);
                            const targetResourcePath = path.join(directory, "src", "main", "wso2mi", "resources", "registry", registryPath.isGov ? "gov" : "conf", registryPath.relativePath, path.basename(resourceFileName));
                            moveFile(sourceResourcePath, targetResourcePath);
                        } else if (resource["collection"]) {
                            infoJson.artifact["collection"] = resource["collection"];
                            const resourceDirectory = resource["collection"]["directory"];
                            const registryPath = extractRegistryPath(resource["collection"]["path"]);
                            const sourceResourcePath = path.join(dependencyPath, "resources", resourceDirectory);
                            const targetResourcePath = path.join(directory, "src", "main", "wso2mi", "resources", "registry", registryPath.isGov ? "gov" : "conf", registryPath.relativePath);
                            moveFiles(sourceResourcePath, targetResourcePath);
                        }
                        registryArtifactsInfo.artifacts.push(infoJson);
                    }
                } else if (dependencyType === "synapse/lib") {
                    targetFilePath = path.join(directory, "src", "main", "wso2mi", "resources", "connectors", fileName);
                    moveFile(sourceFilePath, targetFilePath);
                } else if (dependencyType === "synapse/metadata") {
                    targetFilePath = path.join(directory, "src", "main", "wso2mi", "resources", "metadata", fileName);
                    moveFile(sourceFilePath, targetFilePath);
                } else if (dependencyType === "lib/synapse/mediator") {
                    targetFilePath = path.join(directory, "deployment", "libs", fileName);
                    moveFile(sourceFilePath, targetFilePath);
                } else {
                    const targetFolder = getTargetFolder(dependencyType, directory);
                    if (targetFolder) {
                        targetFilePath = path.join(targetFolder, fileName);
                        moveFile(sourceFilePath, targetFilePath);
                    }
                }
            }
        }
        const artifactXml = xmlBuilder.build(registryArtifactsInfo);
        const targetArtifactPath = path.join(directory, "src", "main", "wso2mi", "resources", "registry", "artifact.xml");
        fs.writeFileSync(targetArtifactPath, artifactXml);
    }
}

function moveFiles(sourcePath: string, destinationPath: string) {

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath);
    }
    const items = fs.readdirSync(sourcePath);

    items.forEach(item => {

        const sourceItemPath = path.join(sourcePath, item);
        const destinationItemPath = path.join(destinationPath, item);
        const isDirectory = fs.statSync(sourceItemPath).isDirectory();

        if (isDirectory) {
            moveFiles(sourceItemPath, destinationItemPath);
            fs.rmSync(sourceItemPath, { recursive: true });
        } else {
            moveFile(sourceItemPath, destinationItemPath);
        }
    });
}

function moveFile(sourcePath: string, destinationPath: string) {
    if (!fs.existsSync(path.dirname(destinationPath))) {
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    }
    fs.renameSync(sourcePath, destinationPath);
}

function getTargetFolder(type: string, source: string) {
    let artifactFolder = "";
    switch (type) {
        case "synapse/local-entry":
            artifactFolder = "local-entries";
            break;
        case "synapse/message-processors":
            artifactFolder = "message-processors";
            break;
        case "service/dataservice":
            artifactFolder = "data-services";
            break;
        case "datasource/datasource":
            artifactFolder = "data-sources";
            break;
        case "synapse/api":
        case "synapse/sequence":
        case "synapse/proxy-service":
        case "synapse/endpoint":
        case "synapse/inbound-endpoint":
        case "synapse/message-store":
        case "synapse/task":
        case "synapse/template":
            artifactFolder = type.split("/")[1] + "s";
    }
    return path.join(source, "src", "main", "wso2mi", "artifacts", artifactFolder);
}

function extractRegistryPath(path: string): RegistryPath {
    const match = path.match(/\/(governance)?(config)?(\/.*)/);
    let isGov = match ? match[1] === "governance" : false;
    let relativePath = match ? match[3] : "/";
    return { relativePath, isGov };
}
