/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import path = require("path");
import { RelativePattern, TestItem, Uri, commands, workspace } from "vscode";

export function getProjectRoot(uri: Uri): string | undefined {
    const ws = workspace.getWorkspaceFolder(uri);
    if (!ws) {
        return;
    }
    return ws.uri.fsPath;
}

export function getProjectName(uri: Uri): string | undefined {
    const ws = workspace.getWorkspaceFolder(uri);
    if (!ws) {
        return;
    }
    return path.basename(ws.uri.fsPath);
}

export function startWatchingWorkspace(matchPattern: string, refresh: () => void) {
    if (!workspace.workspaceFolders) {
        return [];
    }

    return workspace.workspaceFolders.map(workspaceFolder => {
        const pattern = new RelativePattern(workspaceFolder, matchPattern);
        const watcher = workspace.createFileSystemWatcher(pattern);

        watcher.onDidCreate(uri => refresh());
        watcher.onDidChange(async uri => refresh());
        watcher.onDidDelete(uri => refresh());

        return watcher;
    });
}
