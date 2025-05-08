/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { ProjectStructureResponse, RegistryStructureEntry, RegistryResourcesFolder, ListRegistryArtifactsResponse } from '@wso2-enterprise/mi-core';
import { COMMANDS } from '../constants';
import { window } from 'vscode';
import * as path from 'path';
import { getAvailableRegistryResources } from '../util/fileOperations';
import { ExtendedLanguageClient } from '../lang-client/ExtendedLanguageClient';

let registryDetails: ListRegistryArtifactsResponse;
let extensionContext: vscode.ExtensionContext;
export class RegistryExplorerEntry extends vscode.TreeItem {
	children: RegistryExplorerEntry[] | undefined;
	info: RegistryStructureEntry | undefined;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		info: RegistryStructureEntry | undefined = undefined,
		icon?: string,
		isCodicon: boolean = false
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
		this.info = info;
		if (icon && isCodicon) {
			this.iconPath = new vscode.ThemeIcon(icon);
		} else if (icon) {
			this.iconPath = {
				light: path.join(extensionContext.extensionPath, 'assets', `light-${icon}.svg`),
				dark: path.join(extensionContext.extensionPath, 'assets', `dark-${icon}.svg`)
			};
		}
	}
}

export class RegistryExplorerEntryProvider implements vscode.TreeDataProvider<RegistryExplorerEntry> {
	private _data: RegistryExplorerEntry[];
	private _onDidChangeTreeData: vscode.EventEmitter<RegistryExplorerEntry | undefined | null | void>
		= new vscode.EventEmitter<RegistryExplorerEntry | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<RegistryExplorerEntry | undefined | null | void>
		= this._onDidChangeTreeData.event;

	refresh(langClient: ExtendedLanguageClient) {
		return window.withProgress({
			location: { viewId: 'MI.registry-explorer' },
			title: 'Loading registry structure'
		}, async () => {
			try {
				this._data = await getRegistryStrutureData(langClient);
				this._onDidChangeTreeData.fire();
			} catch (err) {
				console.error(err);
				this._data = [];
			}
		});
	}

	constructor(private context: vscode.ExtensionContext) {
		this._data = [];
		extensionContext = context;
	}

	getTreeItem(element: RegistryExplorerEntry): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: RegistryExplorerEntry | undefined): vscode.ProviderResult<RegistryExplorerEntry[]> {
		if (element === undefined) {
			return this._data;
		}
		return element.children;
	}

	getParent(element: RegistryExplorerEntry): vscode.ProviderResult<RegistryExplorerEntry> {
		if (element.info?.path === undefined) return undefined;

		const projects = (this._data);
		for (const project of projects) {
			if (project.children?.find(child => child.info?.path === element.info?.path)) {
				return project;
			}
			const fileElement = this.recursiveSearchParent(project, element.info?.path);
			if (fileElement) {
				return fileElement;
			}
		}
		return element;
	}

	recursiveSearchParent(element: RegistryExplorerEntry, path: string): RegistryExplorerEntry | undefined {
		if (!element.children) {
			return undefined;
		}
		for (const child of element.children) {
			if (child.info?.path === path) {
				return element;
			}
			const foundParent = this.recursiveSearchParent(child, path);
			if (foundParent) {
				return foundParent;
			}
		}
		return undefined;
	}
}

async function getRegistryStrutureData(langClient: ExtendedLanguageClient): Promise<RegistryExplorerEntry[]> {
	if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
		const data: RegistryExplorerEntry[] = [];
		if (!!langClient) {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			for (const workspace of workspaceFolders) {
				const rootPath = workspace.uri.fsPath;

				const resp = await langClient.getProjectStructure(rootPath);
				registryDetails = getAvailableRegistryResources(rootPath);
				const projectTree = generateTreeData(workspace, resp);
				if (projectTree) {
					data.push(projectTree);
				}
			};
		}
		if (data.length > 0) {
			return data;
		}
	}
	return [];

}

function generateTreeData(project: vscode.WorkspaceFolder, data: ProjectStructureResponse): RegistryExplorerEntry | undefined {
	const directoryMap = data.directoryMap;
	if (directoryMap) {
		const projectRoot = new RegistryExplorerEntry(
			`Registry ${project.name}`,
			vscode.TreeItemCollapsibleState.Expanded,
			{ name: project.name, path: project.uri.fsPath, type: 'registry' },
			'registry'
		);

		projectRoot.contextValue = 'registry';
		generateTreeDataOfRegistry(project, data, projectRoot);
		return projectRoot;
	}
}

function generateTreeDataOfRegistry(project: vscode.WorkspaceFolder, data: ProjectStructureResponse, projectRoot: RegistryExplorerEntry) {
	const directoryMap = data.directoryMap;
	const resources = (directoryMap as any)?.src?.main?.wso2mi?.resources;
	if (resources && resources['registry']) {
		const regPath = path.join(project.uri.fsPath, 'src', 'main', 'wso2mi', 'resources', 'registry');
		const gov = resources['registry']['gov'];
		const conf = resources['registry']['conf'];
		// remove datamapper folder from gov 
		if (gov && gov.folders) {
			gov.folders = gov.folders.filter((folder: any) => folder.name !== 'datamapper');
		}
		const isCollapsibleGov = gov && ((gov.files && gov.files.length > 0) || (gov.folders && gov.folders.length > 0));
		const isCollapsibleConf = conf && ((conf.files && conf.files.length > 0) || (conf.folders && conf.folders.length > 0));
		if (gov) {
			const govEntry = new RegistryExplorerEntry(
				'gov',
				isCollapsibleState(isCollapsibleGov),
				{ name: 'gov', path: path.join(regPath, 'gov'), type: 'gov' },
			);
			govEntry.id = 'gov';
			govEntry.contextValue = 'gov';
			govEntry.children = genRegistryProjectStructureEntry(gov);
			projectRoot.children = projectRoot.children ?? [];
			projectRoot.children.push(govEntry);
		}
		if (conf) {
			const confEntry = new RegistryExplorerEntry(
				'conf',
				isCollapsibleState(isCollapsibleConf),
				{ name: 'conf', path: path.join(regPath, 'conf'), type: 'conf' },
			);
			confEntry.id = 'conf';
			confEntry.contextValue = 'conf';
			confEntry.children = genRegistryProjectStructureEntry(conf);
			projectRoot.children = projectRoot.children ?? [];
			projectRoot.children.push(confEntry);
		}
	}
}

function isCollapsibleState(state: boolean): vscode.TreeItemCollapsibleState {
	return state ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
}

function checkExistanceOfRegistryResource(registryPath: string): boolean {
	if (registryDetails.artifacts) {
		for (const artifact of registryDetails.artifacts) {
			let transformedPath = artifact.path.replace("/_system/governance", '/gov').replace("/_system/config", '/conf');
			if (!artifact.isCollection) {
				transformedPath = transformedPath.endsWith('/') ? transformedPath + artifact.file : transformedPath + "/" + artifact.file;
			}
			if (transformedPath === registryPath) {
				return true;
			}
		}
		return false;
	}
	return false;
}

function genRegistryProjectStructureEntry(data: RegistryResourcesFolder): RegistryExplorerEntry[] {
	const result: RegistryExplorerEntry[] = [];
	const regPathPrefix = path.join("wso2mi", "resources", "registry");
	if (data) {
		if (data.files) {
			for (const entry of data.files) {
				const explorerEntry = new RegistryExplorerEntry(entry.name, isCollapsibleState(false), {
					name: entry.name,
					type: 'resource',
					path: `${entry.path}`
				}, 'code', true);
				explorerEntry.id = entry.path;
				explorerEntry.command = {
					"title": "Edit Registry Resource",
					"command": COMMANDS.EDIT_REGISTERY_RESOURCE_COMMAND,
					"arguments": [vscode.Uri.file(entry.path)]
				};
				result.push(explorerEntry);
				const lastIndex = entry.path.indexOf(regPathPrefix) !== -1 ? entry.path.indexOf(regPathPrefix) + regPathPrefix.length : 0;
				const registryPath = entry.path.substring(lastIndex);
				if (checkExistanceOfRegistryResource(registryPath)) {
					explorerEntry.contextValue = "registry-with-metadata";
				} else {
					explorerEntry.contextValue = "registry-without-metadata";
				}
			}
		}
		if (data.folders) {
			for (const entry of data.folders) {
				if (entry.name !== ".meta") {
					const explorerEntry = new RegistryExplorerEntry(entry.name,
						isCollapsibleState(entry.files.length > 0 || entry.folders.length > 0),
						{
							name: entry.name,
							type: 'resource',
							path: `${entry.path}`
						}, 'folder', true);
					explorerEntry.children = genRegistryProjectStructureEntry(entry);
					result.push(explorerEntry);
					const lastIndex = entry.path.indexOf(regPathPrefix) !== -1 ? entry.path.indexOf(regPathPrefix) + regPathPrefix.length : 0;
					const registryPath = entry.path.substring(lastIndex);
					if (checkExistanceOfRegistryResource(registryPath)) {
						explorerEntry.contextValue = "registry-with-metadata";
					} else {
						explorerEntry.contextValue = "registry-without-metadata";
					}
				}
			}
		}
	}
	return result;
}
