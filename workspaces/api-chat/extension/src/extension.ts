/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { activateConsole } from './console';
import { activateTelemetry } from './telemetry/telemetry';
// import { getLogger, initLogger } from './logger/logger';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Initialize logger
	activateTelemetry(context);
	// await initLogger(context);
	// getLogger().debug("Activating API Chat Extension");

	// Check the content of the active document when the extension is activated
	checkDocumentForOpenAPI(vscode.window.activeTextEditor?.document);

	// Listen for document changes
	vscode.window.onDidChangeActiveTextEditor(editor => {
		checkDocumentForOpenAPI(editor?.document);
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		checkDocumentForOpenAPI(event.document);
	}, null, context.subscriptions);

	activateConsole(context);
	// getLogger().debug("API Chat Extension activated");
}

function checkDocumentForOpenAPI(document?: vscode.TextDocument) {
	if (document) {
		// check if document is yaml or json
		const fileName = document.fileName;
		if (fileName.endsWith('.yaml') || fileName.endsWith('.yml') || fileName.endsWith('.json')) {
			//check if document contains openapi
			const fileContent = document.getText();
			const isOpenAPI = fileContent.includes('openapi');
			vscode.commands.executeCommand('setContext', 'isFileOpenAPI', isOpenAPI);
		} else {
			vscode.commands.executeCommand('setContext', 'isFileOpenAPI', false);
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
