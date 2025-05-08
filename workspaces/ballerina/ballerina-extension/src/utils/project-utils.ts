/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ballerinaExtInstance } from "../core";
import { Uri, window, workspace } from "vscode";
import * as path from 'path';
import { isSupportedVersion, VERSION } from "./config";
import { BallerinaProject } from "@wso2-enterprise/ballerina-core";

function getCurrentBallerinaProject(file?: string): Promise<BallerinaProject> {
    return new Promise((resolve, reject) => {
        const activeEditor = window.activeTextEditor;
        // get path of the current bal file
        const uri = file ? Uri.file(file) : activeEditor.document.uri;
        // if currently opened file is a bal file
        if (ballerinaExtInstance.langClient && isSupportedVersion(ballerinaExtInstance, VERSION.BETA, 1)) {
            // get Ballerina Project path for current Ballerina file
            ballerinaExtInstance.langClient.getBallerinaProject({
                documentIdentifier: {
                    uri: uri.toString(),
                }
            }).then((response) => {
                const project = response as BallerinaProject;
                if (!project.kind) {
                    reject(`Current file does not belong to a ballerina project.`);
                }
                resolve(project);
            }, _error => {
                reject("Language Client did not return a project");
            });
        } else {
            reject("Language Client is not available.");
        }
    });
}

function getCurrentBallerinaFile(): string {
    const activeEditor = window.activeTextEditor;
    if (activeEditor && activeEditor.document.fileName.endsWith('.bal')) {
        return activeEditor.document.fileName;
    }
    const document = ballerinaExtInstance.getDocumentContext().getLatestDocument();
    if (document) {
        return document.toString();
    }
    for (let editor of window.visibleTextEditors) {
        if (editor.document.fileName.endsWith('.bal')) {
            return editor.document.fileName;
        }
    }
    throw new Error("Current file is not a Ballerina file");
}

function getCurrenDirectoryPath(): string {
    const activeEditor = window.activeTextEditor;
    if (activeEditor) {
        return path.dirname(activeEditor.document.fileName);
    }
    throw new Error("There is no active editor");
}

function addToWorkspace(url: string) {
    workspace.updateWorkspaceFolders(workspace.workspaceFolders ? workspace.workspaceFolders.length : 0, null, { uri: Uri.parse(url) });
}

export { addToWorkspace, getCurrentBallerinaProject, getCurrentBallerinaFile, getCurrenDirectoryPath };
