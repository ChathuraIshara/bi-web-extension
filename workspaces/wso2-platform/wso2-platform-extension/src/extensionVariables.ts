/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { ExtensionContext, StatusBarItem } from "vscode";
import type { PlatformExtensionApi } from "./PlatformExtensionApi";
import type { ChoreoRPCClient } from "./choreo-rpc";

// TODO: move into seperate type file along with PlatformExtensionApi
export class ExtensionVariables {
	public context!: ExtensionContext;
	public api!: PlatformExtensionApi;
	public statusBarItem!: StatusBarItem;

	public clients!: {
		rpcClient: ChoreoRPCClient;
	};
}

export const ext = new ExtensionVariables();
