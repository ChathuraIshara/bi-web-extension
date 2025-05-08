/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ProjectExplorerEntryProvider } from './project-explorer-provider';
import { COMMANDS } from '../constants';
import { ExtensionContext, commands, window } from 'vscode';

export async function activateProjectExplorer(context: ExtensionContext) {
	const projectExplorerDataProvider = new ProjectExplorerEntryProvider(context);
	await projectExplorerDataProvider.refresh();
	const projectTree = window.createTreeView(COMMANDS.PROJECT_EXPLORER, { treeDataProvider: projectExplorerDataProvider });
	commands.registerCommand(COMMANDS.PROJECT_EXPLORER_REFRESH, () => { return projectExplorerDataProvider.refresh(); });
}

