/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { ExtensionContext } from "vscode";
import { cloneRepoCommand } from "./clone-project-cmd";
import { createComponentDependencyCommand } from "./create-comp-dependency-cmd";
import { createNewComponentCommand } from "./create-component-cmd";
import { createDirectoryContextCommand } from "./create-directory-context-cmd";
import { createProjectWorkspaceCommand } from "./create-project-workspace-cmd";
import { deleteComponentCommand } from "./delete-component-cmd";
import { manageProjectContextCommand } from "./manage-dir-context-cmd";
import { openInConsoleCommand } from "./open-in-console-cmd";
import { refreshContextCommand } from "./refresh-directory-context-cmd";
import { signInCommand } from "./sign-in-cmd";
import { signInWithAuthCodeCommand } from "./sign-in-with-code-cmd";
import { signOutCommand } from "./sign-out-cmd";
import { viewComponentDependencyCommand } from "./view-comp-dependency-cmd";
import { viewComponentCommand } from "./view-component-cmd";

export function activateCmds(context: ExtensionContext) {
	createNewComponentCommand(context);
	refreshContextCommand(context);
	deleteComponentCommand(context);
	signInCommand(context);
	signInWithAuthCodeCommand(context);
	signOutCommand(context);
	openInConsoleCommand(context);
	viewComponentCommand(context);
	cloneRepoCommand(context);
	createProjectWorkspaceCommand(context);
	manageProjectContextCommand(context);
	createDirectoryContextCommand(context);
	createComponentDependencyCommand(context);
	viewComponentDependencyCommand(context);
}
