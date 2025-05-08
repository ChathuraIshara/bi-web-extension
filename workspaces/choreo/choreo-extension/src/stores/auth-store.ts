/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { AuthState, Organization, UserInfo } from "@wso2-enterprise/choreo-core";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { ext } from "../extensionVariables";
import { contextStore } from "./context-store";
import { dataCacheStore } from "./data-cache-store";
import { getGlobalStateStore } from "./store-utils";

interface AuthStore {
	state: AuthState;
	resetState: () => void;
	loginSuccess: (userInfo: UserInfo) => void;
	logout: () => Promise<void>;
	initAuth: () => Promise<void>;
}

const initialState: AuthState = { userInfo: null };

export const authStore = createStore(
	persist<AuthStore>(
		(set, get) => ({
			state: initialState,
			resetState: () => set(() => ({ state: initialState })),
			loginSuccess: (userInfo) => {
				dataCacheStore.getState().setOrgs(userInfo.organizations);
				set(({ state }) => ({ state: { ...state, userInfo } }));
				contextStore.getState().refreshState();
			},
			logout: async () => {
				get().resetState();
				ext.clients.rpcClient.signOut().catch(() => {
					// ignore error
				});
			},
			initAuth: async () => {
				try {
					const userInfo = await ext.clients.rpcClient.getUserInfo();
					if (userInfo) {
						get().loginSuccess(userInfo);
						const contextStoreState = contextStore.getState().state;
						if (contextStoreState.selected?.org) {
							ext?.clients?.rpcClient?.changeOrgContext(contextStoreState.selected?.org?.id?.toString());
						}
					} else {
						get().logout();
					}
				} catch (err) {
					get().logout();
				}
			},
		}),
		getGlobalStateStore("auth-zustand-storage"),
	),
);

export const waitForLogin = async (): Promise<UserInfo> => {
	return new Promise((resolve) => {
		authStore.subscribe(({ state }) => {
			if (state.userInfo) {
				resolve(state.userInfo);
			}
		});
	});
};
