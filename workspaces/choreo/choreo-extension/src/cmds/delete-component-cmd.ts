/*
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { basename } from "path";
import { CommandIds, type ComponentKind, type Organization, type Project, WorkspaceConfig } from "@wso2-enterprise/choreo-core";
import { type ExtensionContext, ProgressLocation, QuickPickItem, Uri, commands, window, workspace } from "vscode";
import { ext } from "../extensionVariables";
import { contextStore } from "../stores/context-store";
import { dataCacheStore } from "../stores/data-cache-store";
import { closeComponentDetailsView } from "../webviews/ComponentDetailsView";
import { getUserInfoForCmd, selectComponent, selectOrg, selectProject } from "./cmd-utils";

export function deleteComponentCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(
			CommandIds.DeleteComponent,
			async (params: { organization: Organization; project: Project; component: ComponentKind }) => {
				try {
					const userInfo = await getUserInfoForCmd("delete a component");
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
								`Loading components from '${selectedProject.name}'`,
								`Select component from '${selectedProject.name}' to delete`,
							));

						const accepted = await window.showInformationMessage(
							"Are you sure you want to delete this Choreo component? This action will not affect any local files and will only delete the component created in Choreo. Please note that this action is not reversible.",
							{ modal: true },
							"Delete",
						);
						if (accepted === "Delete") {
							await window.withProgress(
								{
									title: `Deleting component ${selectedComponent.metadata.displayName}...`,
									location: ProgressLocation.Notification,
								},
								async () => {
									await ext.clients.rpcClient.deleteComponent({
										orgId: selectedOrg.id.toString(),
										orgHandler: selectedOrg.handle,
										projectId: selectedProject.id,
										componentId: selectedComponent.metadata.id,
										componentName: selectedComponent.metadata.displayName,
									});

									closeComponentDetailsView(selectedOrg.handle, selectedProject.handler, selectedComponent.metadata.name);

									const compCache = dataCacheStore.getState().getComponents(selectedOrg.handle, selectedProject.handler);
									dataCacheStore.getState().setComponents(
										selectedOrg.handle,
										selectedProject.handler,
										compCache.filter((item) => item.metadata.id !== selectedComponent.metadata.id),
									);

									if (workspace.workspaceFile && basename(workspace.workspaceFile.path) === `${selectedProject?.handler}.code-workspace`) {
										const folderIndex = workspace.workspaceFolders?.findIndex((item) => item.name === selectedComponent.metadata.name) ?? -1;
										workspace.updateWorkspaceFolders(folderIndex, 1);
									}

									contextStore.getState().refreshState();

									window.showInformationMessage(`Component ${selectedComponent.metadata.displayName} has been successfully deleted`);
								},
							);
						}
					}
				} catch (err: any) {
					console.error("Failed to delete component", err);
					window.showErrorMessage(err?.message || "Failed to delete component");
				}
			},
		),
	);
}
