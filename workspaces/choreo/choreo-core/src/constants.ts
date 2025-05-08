/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ChoreoBuildPackNames } from "./types/common.types";

export const CommandIds = {
	FocusChoreoProjectActivity: "choreo.activity.project.focus",
	SignIn: "wso2.choreo.sign.in",
	SignInWithAuthCode: "wso2.choreo.sign.in.with.authCode",
	SignOut: "wso2.choreo.sign.out",
	AddComponent: "wso2.choreo.add.component",
	CreateNewComponent: "wso2.choreo.create.component",
	DeleteComponent: "wso2.choreo.delete.component",
	OpenWalkthrough: "wso2.choreo.getStarted",
	OpenInConsole: "wso2.choreo.open.external",
	ViewComponent: "wso2.choreo.component.view",
	CloneProject: "wso2.choreo.project.clone",
	CreateDirectoryContext: "wso2.choreo.project.create.context",
	ManageDirectoryContext: "wso2.choreo.project.manage.context",
	RefreshDirectoryContext: "wso2.choreo.project.refresh",
	CreateProjectWorkspace: "wso2.choreo.project.create.workspace",
	CreateComponentDependency: "wso2.choreo.component.create.dependency",
	ViewDependency: "wso2.choreo.component.view.dependency",
	// TODO: add command & code lens to delete dependency
};

export const WebAppSPATypes = [ChoreoBuildPackNames.React, ChoreoBuildPackNames.Vue, ChoreoBuildPackNames.Angular];
