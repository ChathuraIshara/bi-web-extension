/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds, ComponentViewDrawers, type ICreateDependencyParams, getComponentKey } from "@wso2-enterprise/wso2-platform-core";
import { type ExtensionContext, ViewColumn, commands, window } from "vscode";
import { ext } from "../extensionVariables";
import { contextStore } from "../stores/context-store";
import { webviewStateStore } from "../stores/webview-state-store";
import { showComponentDetailsView } from "../webviews/ComponentDetailsView";
import { getUserInfoForCmd, isRpcActive, setExtensionName } from "./cmd-utils";
import { getComponentStateOfPath } from "./view-comp-dependency-cmd";

export function createComponentDependencyCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.CreateComponentDependency, async (params: ICreateDependencyParams) => {
			setExtensionName(params?.extName);
			try {
				isRpcActive(ext);
				const extensionName = webviewStateStore.getState().state.extensionName;
				const userInfo = await getUserInfoForCmd(`create dependency`);
				if (userInfo) {
					const selected = contextStore.getState().state.selected;
					if (!selected?.org || !selected.project) {
						window.showInformationMessage(`This directory has not yet been linked to a ${extensionName} project`, "Link Directory").then((res) => {
							if (res === "Link Directory") {
								commands.executeCommand(CommandIds.CreateDirectoryContext);
							}
						});
						return;
					}

					const components = contextStore.getState().state.components;

					if (components?.length === 0) {
						window
							.showInformationMessage(
								`No ${extensionName === "Devant" ? "integrations" : "components"} available within the project directory`,
								`Create ${extensionName === "Devant" ? "Integration" : "Component"}`,
							)
							.then((res) => {
								if (res === "Create Component" || res === "Create Integration") {
									commands.executeCommand(CommandIds.CreateNewComponent);
								}
							});
						return;
					}

					const component = await getComponentStateOfPath(params?.componentFsPath, components);

					if (!component?.component) {
						throw new Error(`Failed to select ${extensionName === "Devant" ? "integration" : "component"}`);
					}

					showComponentDetailsView(
						selected.org,
						selected.project,
						component.component,
						component.componentFsPath,
						params?.isCodeLens ? ViewColumn.Beside : undefined,
					);

					// TODO: passing this as a prop to component details view seems cleaner
					// remove this and try to pass opened drawer a a prop
					webviewStateStore
						.getState()
						.onOpenComponentDrawer(getComponentKey(selected.org, selected.project, component.component), ComponentViewDrawers.CreateConnection);
				}
			} catch (err: any) {
				console.error("Failed to create dependency", err);
				window.showErrorMessage(err?.message || "Failed to create dependency");
			}
		}),
	);
}
