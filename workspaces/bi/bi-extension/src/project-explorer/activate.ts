/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { SHARED_COMMANDS, BI_COMMANDS } from '@wso2-enterprise/ballerina-core';

import { ProjectExplorerEntry, ProjectExplorerEntryProvider } from './project-explorer-provider';
import { ExtensionContext, TreeView, commands, window, workspace } from 'vscode';
import { extension } from '../biExtentionContext';

interface ExplorerActivationConfig {
	context: ExtensionContext;
	isBI: boolean;
	isBallerina?: boolean;
	isMultiRoot?: boolean;
}

export function activateProjectExplorer(config: ExplorerActivationConfig) {
	const { context, isBI, isBallerina, isMultiRoot } = config;

	if (extension.langClient && extension.biSupported) {
		setLoadingStatus();
	}

	const projectExplorerDataProvider = new ProjectExplorerEntryProvider();
	const projectTree = createProjectTree(projectExplorerDataProvider);

	if (isBallerina) {
		registerBallerinaCommands(projectExplorerDataProvider, isBI, isMultiRoot);
	}

	handleVisibilityChangeEvents(projectTree, projectExplorerDataProvider, isBallerina);
	context.subscriptions.push(workspace.onDidDeleteFiles(() => projectExplorerDataProvider.refresh()));
}

function setLoadingStatus() {
	commands.executeCommand('setContext', 'BI.status', 'loading');
}

function createProjectTree(dataProvider: ProjectExplorerEntryProvider) {
	return window.createTreeView(BI_COMMANDS.PROJECT_EXPLORER, { treeDataProvider: dataProvider });
}

function registerBallerinaCommands(dataProvider: ProjectExplorerEntryProvider, isBI: boolean, isMultiRoot?: boolean) {
	commands.registerCommand(BI_COMMANDS.REFRESH_COMMAND, () => dataProvider.refresh());
	if (isBI) {
		registerBICommands(isMultiRoot);
	}
}

function handleVisibilityChangeEvents(tree: TreeView<ProjectExplorerEntry>, dataProvider: ProjectExplorerEntryProvider, isBallerina?: boolean) {
	tree.onDidChangeVisibility(async res => await handleVisibilityChange(res, dataProvider, isBallerina));
}

async function handleVisibilityChange(res: { visible: boolean }, dataProvider: ProjectExplorerEntryProvider, isBallerina?: boolean) {
	if (res.visible) {
		if (isBallerina && extension.biSupported) {
			commands.executeCommand(SHARED_COMMANDS.SHOW_VISUALIZER);
			await commands.executeCommand(SHARED_COMMANDS.FORCE_UPDATE_PROJECT_ARTIFACTS);
			dataProvider.refresh();
		} else {
			handleNonBallerinaVisibility();
		}
	}
}

function handleNonBallerinaVisibility() {
	if (extension.langClient) {
		if (!extension.biSupported) {
			commands.executeCommand('setContext', 'BI.status', 'updateNeed');
		} else {
			commands.executeCommand('setContext', 'BI.status', 'unknownProject');
		}
	} else {
		commands.executeCommand('setContext', 'BI.status', 'noLS');
	}
	commands.executeCommand(SHARED_COMMANDS.OPEN_BI_WELCOME);
}

function registerBICommands(isMultiRoot?: boolean) {
	commands.executeCommand(BI_COMMANDS.FOCUS_PROJECT_EXPLORER);
	commands.executeCommand(SHARED_COMMANDS.SHOW_VISUALIZER);
	commands.executeCommand('setContext', 'BI.project', true);
	if (isMultiRoot) {
		commands.executeCommand('setContext', 'BI.isMultiRoot', true);
	}
}
