/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Uri, Webview, commands, window } from "vscode";

export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
    if (process.env.WEB_VIEW_DEV_MODE === "true") {
        return new URL(pathList[pathList.length - 1], process.env.WEB_VIEW_DEV_HOST as string).href;
    }
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export function checkDocumentContext(documentText?: string, fileName?: string) {
    if (documentText && fileName) {
        if (fileName.endsWith('.txt') || fileName.endsWith('.hl7')) {
            const firstLine = documentText.split('\n')[0];
            const isHL7v2 = /^MSH\|([\^~\\&\s,.\w#-]*\|){10}2/.test(firstLine);
            commands.executeCommand('setContext', 'isHL7v2', isHL7v2);
            commands.executeCommand('setContext', 'isCDA', false);
            commands.executeCommand('setContext', 'webViewEditorFocus', false);
        } else if (fileName.endsWith('.xml')) {
            const fileContent = documentText;
            const isCDA = fileContent.includes('<ClinicalDocument');
            commands.executeCommand('setContext', 'isCDA', isCDA);
            commands.executeCommand('setContext', 'isHL7v2', false);
            commands.executeCommand('setContext', 'webViewEditorFocus', false);
        } else {
            commands.executeCommand('setContext', 'isCDA', false);
            commands.executeCommand('setContext', 'isHL7v2', false);
        }
    } else {
        commands.executeCommand('setContext', 'isCDA', false);
        commands.executeCommand('setContext', 'isHL7v2', false);
    }
}

export function setWebViewActiveContext(value: boolean) {
    if (value){
        commands.executeCommand('setContext', 'isCDA', false);
        commands.executeCommand('setContext', 'isHL7v2', false);
    }
    else{
        checkDocumentContext(
            window.activeTextEditor?.document.getText(),
            window.activeTextEditor?.document.fileName,
        );
    }
    commands.executeCommand('setContext', 'webViewEditorFocus', value);
}
