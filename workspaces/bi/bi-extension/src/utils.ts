/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Uri, Webview, workspace } from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { extension } from "./biExtentionContext";
import { isWebMode } from "./project-explorer/activate";
import * as vscode from 'vscode';

export interface ProjectInfo {
    isBI: boolean;
    isBallerina: boolean;
    isMultiRoot: boolean;
};

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
    if (process.env.WEB_VIEW_DEV_MODE === "true") {
        return new URL(pathList[pathList.length - 1], process.env.WEB_VIEW_DEV_HOST as string).href;
    }
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export async function fetchProjectInfo(): Promise<ProjectInfo> {
    const workspaceUris = workspace.workspaceFolders ? workspace.workspaceFolders.map(folder => folder.uri) : [];
    console.log("workspace uris", workspaceUris);
    let isBICount = 0; // Counter for workspaces with isBI set to true
    let isBalCount = 0; // Counter for workspaces with Ballerina project

    // Check each workspace folder's configuration for 'isBI'
    for (const uri of workspaceUris) {
        const isBallerina = await checkIsBallerina(uri);
        console.log("isBallerina", isBallerina, uri);
        if (isBallerina) {
            isBalCount++;
            if (checkIsBI(uri)) {
                isBICount++;
            }
        }
    }

    return {
        isBI: isBICount > 0,
        isBallerina: isBalCount > 0,
        isMultiRoot: isBalCount > 1 // Set to true only if more than one workspace has a Ballerina project
    };
}

export function checkIsBI(uri: Uri): boolean {
    const config = workspace.getConfiguration('ballerina', uri);
    const inspected = config.inspect<boolean>('isBI');
    //manually true the biSupported value only for webmode
    if(extension.isWebMode)
    {
      extension.biSupported = true;
    }
    const isBISupported = extension.biSupported;
    

    if (inspected && isBISupported) { // Added a check to see if the current version of ballerina supports bi
        const valuesToCheck = [
            inspected.workspaceFolderValue,
            inspected.workspaceValue,
            inspected.globalValue
        ];
        return valuesToCheck.find(value => value === true) !== undefined; // Return true if isBI is set to true
    }
    return false; // Return false if isBI is not set
}

export async function checkIsBallerina(uri: Uri): Promise<boolean> {
     
    console.log("Checking if the workspace is a Ballerina project at:", uri);
    const ballerinaTomlPath = extension.isWebMode ? Uri.joinPath(uri, 'Ballerina.toml') : path.join(uri.fsPath, 'Ballerina.toml');
    if (extension.isWebMode) {
        return await listDirectoryContents(Uri.parse(uri.toString()), Uri.parse(ballerinaTomlPath.toString()));
    } else {
        return fs.existsSync(ballerinaTomlPath.toString());
    }
}

export function checkBallerinTomlPath(tomlUri:string):boolean{
    const workspaceUris = workspace.workspaceFolders ? workspace.workspaceFolders.map(folder => folder.uri) : [];
      for (const uri of workspaceUris) {
          console.log("uri in workspace",uri);
          if(uri.toString()==tomlUri)
          {
            return true;
          }
        }
      return false;
}



export async function listDirectoryContents(Baseuri: vscode.Uri,targetUri:vscode.Uri): Promise<boolean> {
  try {
    // Read directory entries (files + folders)
    const entries = await vscode.workspace.fs.readDirectory(Baseuri);
    const targetUriString = Uri.parse(targetUri.toString());

    for (const [name, type] of entries) {
      const fullPath = vscode.Uri.joinPath(Baseuri, name).toString();
      if(targetUriString.toString() === fullPath) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error reading ${Baseuri.toString()}:`, error);
  }
}







