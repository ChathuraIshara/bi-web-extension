/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { ComponentKind, IWso2PlatformExtensionAPI } from "@wso2-enterprise/wso2-platform-core";
import { ext } from "./extensionVariables";
import { hasDirtyRepo } from "./git/util";
import { authStore } from "./stores/auth-store";
import { contextStore } from "./stores/context-store";
import { getNormalizedPath, isSamePath } from "./utils";

export class PlatformExtensionApi implements IWso2PlatformExtensionAPI {
	public isLoggedIn = () => !!authStore.getState().state?.userInfo;
	public getDirectoryComponents = (fsPath: string) =>
		(contextStore
			.getState()
			.state?.components?.filter((item) => isSamePath(item?.componentFsPath, fsPath))
			?.map((item) => item?.component)
			?.filter((item) => !!item) as ComponentKind[]) ?? [];
	public localRepoHasChanges = (fsPath: string) => hasDirtyRepo(fsPath, ext.context, ["context.yaml"]);
}
