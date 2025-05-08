/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { type PersistOptions, createJSONStorage } from "zustand/middleware";
import { ext } from "../extensionVariables";

export const getGlobalStateStore = (storeName: string): PersistOptions<any, any> => {
	return {
		name: storeName,
		storage: createJSONStorage(() => ({
			getItem: async (name) => {
				const value = await ext.context.globalState.get(name);
				return value ? (value as string) : "";
			},
			removeItem: (name) => ext.context.globalState.update(name, undefined),
			setItem: (name, value) => ext.context.globalState.update(name, value),
		})),
		skipHydration: true,
	};
};

export const getWorkspaceStateStore = (storeName: string): PersistOptions<any, any> => {
	return {
		name: storeName,
		storage: createJSONStorage(() => ({
			getItem: async (name) => {
				const value = await ext.context.workspaceState.get(name);
				return value ? (value as string) : "";
			},
			removeItem: (name) => ext.context.workspaceState.update(name, undefined),
			setItem: (name, value) => ext.context.workspaceState.update(name, value),
		})),
		skipHydration: true,
	};
};
