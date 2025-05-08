/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { extension } from './biExtentionContext';
import { StateMachine } from './stateMachine';

export function activate(context: vscode.ExtensionContext) {
	const ballerinaExt = vscode.extensions.getExtension('wso2.ballerina');
	if (ballerinaExt) {
		extension.context = context;
		extension.langClient = ballerinaExt.exports.ballerinaExtInstance.langClient;
		extension.biSupported = ballerinaExt.exports.ballerinaExtInstance.biSupported;
		extension.isNPSupported = ballerinaExt.exports.ballerinaExtInstance.isNPSupported;
		extension.projectPath = ballerinaExt.exports.projectPath;
		StateMachine.initialize();
		return;
	}
	vscode.window.showErrorMessage('Ballerina extension is required to operate Ballerina Integrator extension effectively. Please install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina).');
}

export function deactivate() { }
