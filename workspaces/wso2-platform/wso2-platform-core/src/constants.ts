/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ChoreoBuildPackNames } from "./types/common.types";

export const CommandIds = {
	SignIn: "wso2.wso2-platform.sign.in",
	SignInWithAuthCode: "wso2.wso2-platform.sign.in.with.authCode",
	SignOut: "wso2.wso2-platform.sign.out",
	AddComponent: "wso2.wso2-platform.add.component",
	CreateNewComponent: "wso2.wso2-platform.create.component",
	DeleteComponent: "wso2.wso2-platform.delete.component",
	OpenInConsole: "wso2.wso2-platform.open.external",
	ViewComponent: "wso2.wso2-platform.component.view",
	CloneProject: "wso2.wso2-platform.project.clone",
	CreateDirectoryContext: "wso2.wso2-platform.project.create.context",
	ManageDirectoryContext: "wso2.wso2-platform.project.manage.context",
	RefreshDirectoryContext: "wso2.wso2-platform.project.refresh",
	CreateProjectWorkspace: "wso2.wso2-platform.project.create.workspace",
	CreateComponentDependency: "wso2.wso2-platform.component.create.dependency",
	ViewDependency: "wso2.wso2-platform.component.view.dependency",
	OpenCompSrcDir: "wso2.wso2-platform.open.component.src",
	// TODO: add command & code lens to delete dependency
};

export const WebAppSPATypes = [ChoreoBuildPackNames.React, ChoreoBuildPackNames.Vue, ChoreoBuildPackNames.Angular];
