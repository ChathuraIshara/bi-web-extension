/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { existsSync } from "fs";
import * as path from "path";
import { CommandIds, type IViewComponentDetailsCmdParams, getComponentKindRepoSource } from "@wso2-enterprise/wso2-platform-core";
import { type ExtensionContext, commands, window } from "vscode";
import { ext } from "../extensionVariables";
import { contextStore } from "../stores/context-store";
import { webviewStateStore } from "../stores/webview-state-store";
import { showComponentDetailsView } from "../webviews/ComponentDetailsView";
import { getUserInfoForCmd, isRpcActive, selectComponent, selectOrg, selectProject, setExtensionName } from "./cmd-utils";

export function viewComponentCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.ViewComponent, async (params: IViewComponentDetailsCmdParams) => {
			setExtensionName(params?.extName);
			const extName = webviewStateStore.getState().state?.extensionName;
			try {
				isRpcActive(ext);
				const userInfo = await getUserInfoForCmd(`view ${extName === "Devant" ? "integration" : "component"} details`);
				if (userInfo) {
					let selectedOrg = params?.organization;
					let selectedProject = params?.project;

					const selected = contextStore.getState().state.selected;

					if (!selectedOrg) {
						if (selected) {
							selectedOrg = selected.org!;
						} else {
							selectedOrg = await selectOrg(userInfo, "Select organization");
						}
					}
					if (!selectedProject) {
						if (selected) {
							selectedProject = selected.project!;
						} else {
							selectedProject = await selectProject(
								selectedOrg,
								`Loading projects from '${selectedOrg.name}'`,
								`Select project from '${selectedOrg.name}'`,
							);
						}
					}

					const selectedComponent =
						params?.component ??
						(await selectComponent(
							selectedOrg,
							selectedProject,
							`Loading ${extName === "Devant" ? "integrations" : "components"} from '${selectedProject.name}...'`,
							`Select ${extName === "Devant" ? "integration" : "component"} from '${selectedProject.name}' to view`,
						));

					let matchingPath: string = params?.componentPath;

					if (!matchingPath) {
						const contextItems = contextStore.getState().getValidItems();
						for (const item of contextItems) {
							if (item.orgHandle === selectedOrg.handle && item.projectHandle === selectedProject.handler) {
								const matchingCts = item.contextDirs.find((ctxItem) => {
									const componentPath = path.join(ctxItem.projectRootFsPath, getComponentKindRepoSource(selectedComponent.spec.source).path);
									return existsSync(componentPath);
								});
								if (matchingCts) {
									matchingPath = path.join(matchingCts.projectRootFsPath, getComponentKindRepoSource(selectedComponent.spec.source).path);
									break;
								}
							}
						}
					}

					showComponentDetailsView(selectedOrg, selectedProject, selectedComponent, matchingPath);
				}
			} catch (err: any) {
				console.error(`Failed to view ${extName === "Devant" ? "integration" : "component"}`, err);
				window.showErrorMessage(err?.message || `Failed to view ${extName === "Devant" ? "integration" : "component"}`);
			}
		}),
	);
}
