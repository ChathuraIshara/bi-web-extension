/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CommandIds, type ContextItemEnriched } from "@wso2-enterprise/choreo-core";
import { type ExtensionContext, ProgressLocation, type QuickPickItem, QuickPickItemKind, commands, window } from "vscode";
import { ext } from "../extensionVariables";
import { authStore } from "../stores/auth-store";
import { contextStore, waitForContextStoreToLoad } from "../stores/context-store";
import { removeContext } from "./create-directory-context-cmd";

export function manageProjectContextCommand(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(CommandIds.ManageDirectoryContext, async (params: { onlyShowSwitchProject?: boolean }) => {
			try {
				const userInfo = authStore.getState().state.userInfo;
				if (!userInfo) {
					throw new Error("User is not logged in");
				}

				const quickPickOptions: QuickPickItem[] = [];

				const selected = contextStore.getState().state?.selected;
				if (selected) {
					quickPickOptions.push(
						{ kind: QuickPickItemKind.Separator, label: "Selected Project" },
						{ label: selected?.project?.name!, detail: selected?.org?.name, picked: true },
						{ label: "Open in Console", detail: `Open the project '${selected.project?.name}' in Choreo console` },
					);
				}

				const contextItems = contextStore.getState().getValidItems();
				const unSelectedItems = contextItems.filter((item) => item.project?.id !== selected?.project?.id);
				if (unSelectedItems.length > 0) {
					quickPickOptions.push(
						{ kind: QuickPickItemKind.Separator, label: "Associated Projects" },
						...unSelectedItems.map((item) => ({
							label: item.project?.name!,
							detail: item.org?.name,
							item,
						})),
					);
				}

				quickPickOptions.push(
					{ kind: QuickPickItemKind.Separator, label: "Other options" },
					{
						label: selected ? "Link with a different project" : "Link with a project",
						detail: "Associate your workspace with a different Choreo project",
					},
				);

				if (!params?.onlyShowSwitchProject) {
					if (selected) {
						quickPickOptions.push({
							label: "Unlink workspace",
							detail: `Remove the association between ${selected?.project?.name} and currently opened workspace`,
						});
					}
				}

				const selection = await window.showQuickPick(quickPickOptions, {
					title: "Manage Project",
				});

				if (selection?.label === "Open in Console") {
					commands.executeCommand(CommandIds.OpenInConsole, { project: selected?.project, organization: selected?.org });
				} else if (selection?.label === "Link with a different project" || selection?.label === "Link with a project") {
					commands.executeCommand(CommandIds.CreateDirectoryContext);
				} else if ((selection as any)?.item) {
					const selectedItem: ContextItemEnriched = (selection as any)?.item;
					await waitForContextStoreToLoad();
					if (selectedItem.org?.id) {
						await window.withProgress(
							{ title: `Switching to organization ${selectedItem.org.name}...`, location: ProgressLocation.Notification },
							() => ext?.clients?.rpcClient?.changeOrgContext(selectedItem.org?.id?.toString()!),
						);
					}
					contextStore.getState().changeContext(selectedItem);
				} else if (selection?.label === "Unlink workspace") {
					await waitForContextStoreToLoad();
					removeContext(selected?.project!, selected?.org!, selected?.contextDirs.map((item) => item.projectRootFsPath)!);
					contextStore.getState().refreshState();
				}
			} catch (err: any) {
				console.error("Failed to run manage project context", err);
				window.showErrorMessage(`Failed to run manage project context. ${err?.message}`);
			}
		}),
	);
}
