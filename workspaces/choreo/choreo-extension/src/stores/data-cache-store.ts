/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { CommitHistory, ComponentKind, DataCacheState, Environment, Organization, Project } from "@wso2-enterprise/choreo-core";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import { getGlobalStateStore } from "./store-utils";

interface DataCacheStore {
	state: DataCacheState;
	setOrgs: (orgs: Organization[]) => void;
	setProjects: (orgHandle: string, projects: Project[]) => void;
	getProjects: (orgHandle: string) => Project[];
	setComponents: (orgHandle: string, projectHandle: string, components: ComponentKind[]) => void;
	getComponents: (orgHandle: string, projectHandle: string) => ComponentKind[];
	setCommits: (orgHandle: string, projectHandle: string, componentHandle: string, branch: string, commits: CommitHistory[]) => void;
	getCommits: (orgHandle: string, projectHandle: string, componentHandle: string, branch: string) => CommitHistory[];
	setEnvs: (orgHandle: string, projectHandle: string, envs: Environment[]) => void;
	getEnvs: (orgHandle: string, projectHandle: string) => Environment[];
}

export const dataCacheStore = createStore(
	persist<DataCacheStore>(
		(set, get) => ({
			state: {},
			setOrgs: (orgs) => {
				const updatedOrgs = get().state?.orgs ?? {};
				orgs.forEach((item) => {
					updatedOrgs[item.handle] = { projects: updatedOrgs[item.handle]?.projects || {}, data: item };
				});
				set(({ state }) => ({ state: { ...state, orgs: updatedOrgs } }));
			},
			setProjects: (orgHandle, projects) => {
				const updatedProjects: {
					[projectHandle: string]: {
						data?: Project;
						components?: { [componentHandle: string]: { data?: ComponentKind; commits?: { [branch: string]: CommitHistory[] } } };
					};
				} = {};
				projects.forEach((item) => {
					updatedProjects[item.handler] = {
						components: get().state?.orgs?.[orgHandle]?.projects?.[item.handler]?.components || {},
						data: item,
					};
				});

				const updatedOrgs = {
					...(get().state?.orgs ?? {}),
					[orgHandle]: { ...(get().state?.orgs?.[orgHandle] ?? {}), projects: updatedProjects },
				};

				set(({ state }) => ({ state: { ...state, orgs: updatedOrgs } }));
			},
			setEnvs: (orgHandle, projectHandle, envs) => {
				set(({ state }) => ({
					state: {
						...state,
						orgs: {
							...(get().state?.orgs ?? {}),
							[orgHandle]: {
								...(get().state?.orgs?.[orgHandle] ?? {}),
								projects: {
									...(get().state?.orgs?.[orgHandle]?.projects ?? {}),
									[projectHandle]: { ...(get().state?.orgs?.[orgHandle]?.projects?.[projectHandle] ?? {}), envs },
								},
							},
						},
					},
				}));
			},
			getEnvs: (orgHandle, projectHandle) => {
				return get().state.orgs?.[orgHandle]?.projects?.[projectHandle]?.envs || [];
			},
			getProjects: (orgHandle) => {
				const projectList = Object.values(get().state.orgs?.[orgHandle]?.projects ?? {})
					.filter((item) => item.data)
					.map((item) => item.data);
				return projectList as Project[];
			},
			setComponents: (orgHandle, projectHandle, components) => {
				const newComponents: { [componentHandle: string]: { data?: ComponentKind; commits?: { [branch: string]: CommitHistory[] } } } = {};
				const prevComponents = get().state.orgs?.[orgHandle]?.projects?.[projectHandle]?.components ?? {};
				components.forEach((item) => {
					const matchingItem = prevComponents[item.metadata.name];
					newComponents[item.metadata.name] = { ...matchingItem, data: item };
				});

				const updatedOrgs = {
					...(get().state?.orgs ?? {}),
					[orgHandle]: {
						...(get().state?.orgs?.[orgHandle] ?? {}),
						projects: {
							...(get().state?.orgs?.[orgHandle]?.projects ?? {}),
							[projectHandle]: {
								...(get().state?.orgs?.[orgHandle]?.projects?.[projectHandle] ?? {}),
								components: newComponents,
							},
						},
					},
				};

				set(({ state }) => ({ state: { ...state, orgs: updatedOrgs } }));
			},
			getComponents: (orgHandle, projectHandle) => {
				const componentList = Object.values(get().state.orgs?.[orgHandle]?.projects?.[projectHandle]?.components ?? {})
					.filter((item) => item.data)
					.map((item) => item.data);
				return componentList as ComponentKind[];
			},
			setCommits: (orgHandle, projectHandle, componentHandle, branch, commits) => {
				const updatedOrgs = {
					...(get().state?.orgs ?? {}),
					[orgHandle]: {
						...(get().state?.orgs?.[orgHandle] ?? {}),
						projects: {
							...(get().state?.orgs?.[orgHandle]?.projects ?? {}),
							[projectHandle]: {
								...(get().state?.orgs?.[orgHandle]?.projects?.[projectHandle] ?? {}),
								components: {
									...(get().state?.orgs?.[orgHandle]?.projects?.[projectHandle]?.components ?? {}),
									[componentHandle]: {
										...(get().state?.orgs?.[orgHandle]?.projects?.[projectHandle]?.components?.[componentHandle] ?? {}),
										commits: {
											...(get().state?.orgs?.[orgHandle]?.projects?.[projectHandle]?.components?.[componentHandle]?.commits ?? {}),
											[branch]: commits,
										},
									},
								},
							},
						},
					},
				};

				set(({ state }) => ({ state: { ...state, orgs: updatedOrgs } }));
			},
			getCommits: (orgHandle, projectHandle, componentHandle, branch) => {
				const commitList = get().state.orgs?.[orgHandle]?.projects?.[projectHandle]?.components?.[componentHandle]?.commits?.[branch] ?? [];
				return commitList;
			},
		}),
		getGlobalStateStore("data-cache-zustand-storage-v1"),
	),
);
