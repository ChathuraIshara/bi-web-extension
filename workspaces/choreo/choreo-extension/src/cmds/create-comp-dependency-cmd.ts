/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds, ComponentViewDrawers, getComponentKey } from "@wso2-enterprise/choreo-core";
import { type ExtensionContext, ViewColumn, commands, window } from "vscode";
import { contextStore } from "../stores/context-store";
import { webviewStateStore } from "../stores/webview-state-store";
import { showComponentDetailsView } from "../webviews/ComponentDetailsView";
import { getUserInfoForCmd } from "./cmd-utils";
import { getComponentStateOfPath } from "./view-comp-dependency-cmd";

export function createComponentDependencyCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.CreateComponentDependency, async (params: { componentFsPath?: string; isCodeLens?: boolean }) => {
			try {
				const userInfo = await getUserInfoForCmd("create component dependency");
				if (userInfo) {
					const selected = contextStore.getState().state.selected;
					if (!selected?.org || !selected.project) {
						window.showInformationMessage("This directory has not yet been linked to a Choreo project", "Link Directory").then((res) => {
							if (res === "Link Directory") {
								commands.executeCommand(CommandIds.CreateDirectoryContext);
							}
						});
						return;
					}

					const components = contextStore.getState().state.components;

					if (components?.length === 0) {
						window.showInformationMessage("No components available within the project directory", "Create Component").then((res) => {
							if (res === "Create Component") {
								commands.executeCommand(CommandIds.CreateNewComponent);
							}
						});
						return;
					}

					const component = await getComponentStateOfPath(params?.componentFsPath, components);

					if (!component?.component) {
						throw new Error("Failed to select component");
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
				console.error("Failed to create component dependency", err);
				window.showErrorMessage(err?.message || "Failed to create component dependency");
			}
		}),
	);
}
