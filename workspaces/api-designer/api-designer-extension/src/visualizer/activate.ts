/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { openView } from '../stateMachine';
import { COMMANDS } from '../constants';
import { EVENT_TYPE, MACHINE_VIEW } from '@wso2-enterprise/api-designer-core';



export function activateVisualizer(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMANDS.OPEN_WELCOME, async (fileUri: vscode.Uri | string) => {
            let file: string | undefined;
            const activeDocument = vscode.window.activeTextEditor?.document;
            if (typeof fileUri === 'string') {
                file = fileUri;
            } else if (fileUri?.fsPath) {
                file = fileUri.fsPath;
            } else if (activeDocument) {
                file = activeDocument.fileName;
                // If the active document is not a yaml or json file, show an error message
                if (!file.endsWith('.yaml') && !file.endsWith('.yml') && !file.endsWith('.json')) {
                    vscode.window.showErrorMessage("No API definition found to visualize");
                    return;
                }
            } else {
                vscode.window.showErrorMessage("No file found to visualize");
                return;
            }
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.Welcome, documentUri: file });
        })
    );
}
