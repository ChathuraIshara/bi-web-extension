/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { ComponentViewDrawers, ExtensionName, WebviewState } from "@wso2-enterprise/wso2-platform-core";
import { workspace } from "vscode";
import { createStore } from "zustand";

interface WebviewStateStore {
	state: WebviewState;
	setOpenedComponentKey: (openedComponentKey: string) => void;
	onCloseComponentView: (openedComponentKey: string) => void;
	onOpenComponentDrawer: (componentKey: string, drawer: ComponentViewDrawers, params?: any) => void;
	onCloseComponentDrawer: (componentKey: string) => void;
	setExtensionName: (name: ExtensionName) => void;
}

export const webviewStateStore = createStore<WebviewStateStore>((set) => ({
	state: {
		extensionName: "WSO2",
		openedComponentKey: "",
		componentViews: {},
		choreoEnv: workspace.getConfiguration().get<string>("WSO2.WSO2-Platform.Advanced.ChoreoEnvironment") || "prod",
	},
	setExtensionName: (extensionName) => set(({ state }) => ({ state: { ...state, extensionName } })),
	setOpenedComponentKey: (openedComponentKey) => set(({ state }) => ({ state: { ...state, openedComponentKey } })),
	onCloseComponentView: (openedComponentKey) =>
		set(({ state }) => ({
			state: {
				...state,
				openedComponentKey: openedComponentKey === state.openedComponentKey ? "" : state.openedComponentKey,
			},
		})),
	onOpenComponentDrawer: (componentKey, openedDrawer, drawerParams) =>
		set(({ state }) => ({
			state: {
				...state,
				componentViews: { ...state.componentViews, [componentKey]: { ...state.componentViews[componentKey], openedDrawer, drawerParams } },
			},
		})),
	onCloseComponentDrawer: (componentKey) =>
		set(({ state }) => ({
			state: {
				...state,
				componentViews: {
					...state.componentViews,
					[componentKey]: { ...state.componentViews[componentKey], openedDrawer: undefined, drawerParams: undefined },
				},
			},
		})),
}));
