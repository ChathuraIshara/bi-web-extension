/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds } from "@wso2-enterprise/choreo-core";
import * as vscode from "vscode";
import { type ConfigurationChangeEvent, commands, window, workspace } from "vscode";
import { ChoreoExtensionApi } from "./ChoreoExtensionApi";
import { ChoreoRPCClient } from "./choreo-rpc";
import { initRPCServer } from "./choreo-rpc/activate";
import { activateCmds } from "./cmds";
import { continueCreateComponent } from "./cmds/create-component-cmd";
import { activateCodeLenses } from "./code-lens";
import { ext } from "./extensionVariables";
import { getLogger, initLogger } from "./logger/logger";
import { authStore } from "./stores/auth-store";
import { contextStore } from "./stores/context-store";
import { dataCacheStore } from "./stores/data-cache-store";
import { locationStore } from "./stores/location-store";
import { ChoreoConfigurationProvider, addTerminalHandlers } from "./tarminal-handlers";
import { activateTelemetry } from "./telemetry/telemetry";
import { activateURIHandlers } from "./uri-handlers";
import { activateActivityWebViews } from "./webviews/utils";
import { registerYamlLanguageServer } from "./yaml-ls";

export async function activate(context: vscode.ExtensionContext) {
	activateTelemetry(context);
	await initLogger(context);
	getLogger().debug("Activating Choreo Extension");
	ext.context = context;
	ext.api = new ChoreoExtensionApi();

	// Initialize stores
	await authStore.persist.rehydrate();
	await contextStore.persist.rehydrate();
	await dataCacheStore.persist.rehydrate();
	await locationStore.persist.rehydrate();

	// Set context values
	authStore.subscribe(({ state }) => {
		vscode.commands.executeCommand("setContext", "isLoggedIn", !!state.userInfo);
	});
	contextStore.subscribe(({ state }) => {
		vscode.commands.executeCommand("setContext", "isLoadingContextDirs", state.loading);
		vscode.commands.executeCommand("setContext", "hasSelectedProject", !!state.selected);
	});
	workspace.onDidChangeWorkspaceFolders(() => {
		vscode.commands.executeCommand("setContext", "notUsingWorkspaceFile", !workspace.workspaceFile);
	});
	vscode.commands.executeCommand("setContext", "notUsingWorkspaceFile", !workspace.workspaceFile);

	const rpcClient = new ChoreoRPCClient();
	ext.clients = { rpcClient: rpcClient };

	initRPCServer()
		.then(async () => {
			await ext.clients.rpcClient.init();

			authStore.getState().initAuth();

			activateCmds(context);
			activateActivityWebViews(context); // activity web views
			activateURIHandlers();
			activateCodeLenses(context);
			continueCreateComponent();
			addTerminalHandlers();
			context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider("*", new ChoreoConfigurationProvider()));
			getLogger().debug("Choreo Extension activated");
		})
		.catch((e) => {
			getLogger().error("Failed to initialize rpc client", e);
		});

	// activateStatusBarItem();
	commands.registerCommand(CommandIds.OpenWalkthrough, () => {
		commands.executeCommand("workbench.action.openWalkthrough", "wso2.choreo#choreo.getStarted", false);
	});
	registerPreInitHandlers();
	registerYamlLanguageServer();
	return ext.api;
}

function registerPreInitHandlers(): any {
	workspace.onDidChangeConfiguration(async ({ affectsConfiguration }: ConfigurationChangeEvent) => {
		if (affectsConfiguration("Advanced.ChoreoEnvironment") || affectsConfiguration("Advanced.RpcPath")) {
			const selection = await window.showInformationMessage(
				"Choreo extension configuration changed. Please restart vscode for changes to take effect.",
				"Restart Now",
			);
			if (selection === "Restart Now") {
				if (affectsConfiguration("Advanced.ChoreoEnvironment")) {
					authStore.getState().logout();
				}
				commands.executeCommand("workbench.action.reloadWindow");
			}
		}
	});
}

export function deactivate() {}
