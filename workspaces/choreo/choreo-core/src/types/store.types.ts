/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { CommitHistory, ComponentKind, Environment, Organization, Project, UserInfo } from "./common.types";

export interface DataCacheState {
	orgs?: {
		[orgHandle: string]: {
			projects?: {
				[projectHandle: string]: {
					data?: Project;
					envs?: Environment[];
					components?: {
						[componentHandle: string]: {
							data?: ComponentKind;
							commits?: { [branch: string]: CommitHistory[] };
						};
					};
				};
			};
			data?: Organization;
		};
	};
	loading?: boolean;
}

export interface AuthState {
	userInfo: UserInfo | null;
}

export interface WebviewState {
	choreoEnv: string;
	openedComponentKey: string;
	componentViews: {
		[componentKey: string]: {
			openedDrawer?: string;
			// biome-ignore lint/suspicious/noExplicitAny: can be any type of data
			drawerParams?: any;
		};
	};
}

export interface ContextItem {
	project: string;
	org: string;
}

export interface ContextItemDir {
	workspaceName: string;
	contextFileFsPath: string;
	projectRootFsPath: string;
	dirFsPath: string;
}

export interface ContextItemEnriched {
	projectHandle: string;
	project?: Project;
	orgHandle: string;
	org?: Organization;
	contextDirs: ContextItemDir[];
}

export interface ContextStoreComponentState {
	component?: ComponentKind;
	workspaceName: string;
	componentFsPath: string;
	componentRelativePath: string;
}

export interface ContextStoreState {
	items: {
		[key: string]: ContextItemEnriched;
	};
	selected?: ContextItemEnriched;
	components?: ContextStoreComponentState[];
	loading?: boolean;
}

export interface LocationStoreState {
	projectLocations: {
		[projectKey: string]: {
			[fsPath: string]: ContextStoreComponentState[];
		};
	};
}
