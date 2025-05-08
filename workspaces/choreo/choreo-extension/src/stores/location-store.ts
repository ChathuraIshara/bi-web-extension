/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { existsSync } from "fs";
import type { ContextItemEnriched, ContextStoreComponentState, LocationStoreState } from "@wso2-enterprise/choreo-core";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { getGlobalStateStore } from "./store-utils";

interface LocationStore {
	state: LocationStoreState;
	setLocation: (selectedContextItem: ContextItemEnriched, componentItems: ContextStoreComponentState[]) => void;
	getLocations: (projectHandle: string, orgHandle: string) => { fsPath: string; componentItems: ContextStoreComponentState[] }[];
}

const initialState: LocationStoreState = { projectLocations: {} };

export const locationStore = createStore(
	persist<LocationStore>(
		(set, get) => ({
			state: initialState,
			setLocation: (selectedContextItem, componentItems) => {
				const projectKey = `${selectedContextItem.org?.handle}-${selectedContextItem.project?.handler}`;
				for (const contextDirItem of selectedContextItem.contextDirs) {
					set(({ state }) => ({
						state: {
							...state,
							projectLocations: {
								...state.projectLocations,
								[projectKey]: {
									...state.projectLocations?.[projectKey],
									[contextDirItem.projectRootFsPath]: componentItems,
								},
							},
						},
					}));
				}
			},
			getLocations: (projectHandle, orgHandle) => {
				const projectKey = `${orgHandle}-${projectHandle}`;
				return Object.keys(get().state.projectLocations?.[projectKey] ?? {})
					.map((fsPath) => ({ fsPath, componentItems: get().state.projectLocations?.[projectKey]?.[fsPath] }))
					.filter((item) => existsSync(item.fsPath));
			},
		}),
		getGlobalStateStore("location-zustand-storage"),
	),
);
