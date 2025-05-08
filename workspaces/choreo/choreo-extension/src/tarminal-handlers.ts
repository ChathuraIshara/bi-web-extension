/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { ComponentKind, Environment } from "@wso2-enterprise/choreo-core";
import type vscode from "vscode";
import { commands, window, workspace } from "vscode";
import { getChoreoExecPath } from "./choreo-rpc/cli-install";
import { contextStore } from "./stores/context-store";
import { dataCacheStore } from "./stores/data-cache-store";
import { delay, getSubPath } from "./utils";

export class ChoreoConfigurationProvider implements vscode.DebugConfigurationProvider {
	resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration): vscode.DebugConfiguration | undefined {
		if (config.request === "launch" && typeof config.choreo === "object") {
			config.console = "integratedTerminal";
			const choreoConfig: { project?: string; component?: string; env?: string } = config.choreo;
			let connectCmd = "connect";
			if (choreoConfig.project) {
				connectCmd += ` --project \"${choreoConfig.project}\"`;
			} else if (contextStore.getState().state?.selected?.projectHandle) {
				connectCmd += ` --project \"${contextStore.getState().state?.selected?.projectHandle}\"`;
			}
			if (choreoConfig.component) {
				connectCmd += ` --component \"${choreoConfig.component}\"`;
			}
			if (choreoConfig.env) {
				connectCmd += ` --env \"${choreoConfig.env}\"`;
			}

			config.name += `[choreo-shell]${connectCmd}`;
		}

		return config;
	}
}

export function addTerminalHandlers() {
	window.onDidOpenTerminal(async (e) => {
		if (e.name?.includes("[choreo-shell]")) {
			let cliCommand = e.name.split("[choreo-shell]").pop()?.replaceAll(")","");
			const terminalPath = (e.creationOptions as any)?.cwd;
			const rpcPath = getChoreoExecPath();

			if (terminalPath && e.name) {
				if (!e.name?.includes("--project")) {
					window.showErrorMessage(
						"Pease link your directory with Choreo project or add you Choreo project name as choreo.project to your launch configuration",
					);
					return;
				}
				if (!e.name?.includes("--component")) {
					let selectedComp: ComponentKind | undefined = undefined;
					const components = contextStore.getState().state?.components;
					if (components && components.length > 0) {
						if (components.length === 1) {
							selectedComp = components[0]?.component;
						} else {
							const selectedComps = components.filter((item) => getSubPath(item.componentFsPath, terminalPath));
							if (selectedComps.length === 1) {
								selectedComp = selectedComps[0].component;
							} else {
								window.showErrorMessage("Pease add you Choreo component name as choreo.component to your launch configuration");
								return;
								// TODO: also show a button to open docs
							}
						}
					}
					if (selectedComp) {
						cliCommand += ` --component ${selectedComp.metadata?.handler}`;
					}
				}
				if (!e.name?.includes("--env")) {
					const envs = dataCacheStore
						.getState()
						.getEnvs(contextStore.getState().state?.selected?.orgHandle!, contextStore.getState().state?.selected?.projectHandle!);
					const nonCriticalEnvs = envs.filter((item) => !item.critical);
					if (nonCriticalEnvs.length > 0) {
						let selectedEnv: Environment | undefined = undefined;
						if (nonCriticalEnvs.length === 1) {
							selectedEnv = nonCriticalEnvs[0];
						} else {
							window.showErrorMessage("Pease add you Choreo project environment name as choreo.env to your launch configuration");
							return;
							// TODO: also show a button to open docs
						}
						if (selectedEnv) {
							cliCommand += ` --env ${selectedEnv.name}`;
						}
					}
				}
				await commands.executeCommand("workbench.action.terminal.sendSequence", {
					text: `export CHOREO_ENV=${workspace.getConfiguration().get("Advanced.ChoreoEnvironment")} && ${rpcPath} ${cliCommand}\r\n`,
				});
				await delay(2000)
				e.show()
			}
		}
	});
}
