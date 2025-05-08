/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as path from "path";
import {
	CommandIds,
	ComponentViewDrawers,
	type ConnectionListItem,
	type ContextStoreComponentState,
	getComponentKey,
} from "@wso2-enterprise/choreo-core";
import { type ExtensionContext, ProgressLocation, ViewColumn, commands, window } from "vscode";
import { ext } from "../extensionVariables";
import { contextStore } from "../stores/context-store";
import { webviewStateStore } from "../stores/webview-state-store";
import { showComponentDetailsView } from "../webviews/ComponentDetailsView";
import { getUserInfoForCmd, resolveQuickPick } from "./cmd-utils";

export function viewComponentDependencyCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(
			CommandIds.ViewDependency,
			async (params: { componentFsPath?: string; isCodeLens?: boolean; connectionName: string }) => {
				try {
					const userInfo = await getUserInfoForCmd("view component dependency");
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

						let connectionItem: ConnectionListItem | undefined;
						const connectionList = await window.withProgress(
							{ title: "Fetching connection list....", location: ProgressLocation.Notification },
							async () => {
								const [componentConnections, projectConnections] = await Promise.all([
									ext.clients.rpcClient.getConnections({
										orgId: selected?.org?.id?.toString()!,
										projectId: selected.project?.id!,
										componentId: component?.component?.metadata?.id!,
									}),
									ext.clients.rpcClient.getConnections({ orgId: selected?.org?.id?.toString()!, projectId: selected.project?.id!, componentId: "" }),
								]);
								return [...componentConnections, ...projectConnections];
							},
						);
						if (params?.connectionName) {
							connectionItem = connectionList.find((item) => item.name === params?.connectionName);
							if (!connectionItem) {
								throw new Error("Failed to find matching connection details");
							}
						} else {
							connectionItem = await resolveQuickPick(connectionList?.map((item) => ({ label: item.name, item })));
						}

						showComponentDetailsView(
							selected.org,
							selected.project,
							component.component,
							component.componentFsPath,
							params?.isCodeLens ? ViewColumn.Beside : undefined,
						);

						// todo: move this to component state instead of global state
						webviewStateStore
							.getState()
							.onOpenComponentDrawer(getComponentKey(selected.org, selected.project, component.component), ComponentViewDrawers.ConnectionGuide, {
								connection: connectionItem,
							});
					}
				} catch (err: any) {
					console.error("Failed to view component dependency", err);
					window.showErrorMessage(err?.message || "Failed to view component dependency");
				}
			},
		),
	);
}

export const getComponentStateOfPath = async (componentFsPath = "", components: ContextStoreComponentState[] = []) => {
	const selected = contextStore.getState().state.selected;
	let component: ContextStoreComponentState | undefined;
	if (!componentFsPath) {
		component = await resolveQuickPick(components?.map((item) => ({ label: item.component?.metadata?.displayName!, item })));
	} else {
		component = components?.find((item) => path.normalize(item.componentFsPath).toLowerCase() === path.normalize(componentFsPath).toLowerCase());
		if (!component?.component) {
			window
				.showInformationMessage(
					`Could not find any Choreo components that match this directory within the the linked project context. (${selected?.project?.name})`,
					"Create Component",
					"Manage Context",
				)
				.then((res) => {
					if (res === "Create Component") {
						commands.executeCommand(CommandIds.CreateNewComponent);
					}
					if (res === "Manage Context") {
						commands.executeCommand(CommandIds.ManageDirectoryContext);
					}
				});
		}
	}
	return component;
};
