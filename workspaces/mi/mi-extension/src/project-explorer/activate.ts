/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { ProjectExplorerEntry, ProjectExplorerEntryProvider } from './project-explorer-provider';
import { StateMachine, openView, refreshUI } from '../stateMachine';
import { EVENT_TYPE, MACHINE_VIEW, VisualizerLocation } from '@wso2-enterprise/mi-core';
import { COMMANDS } from '../constants';
import { ExtensionContext, TreeItem, Uri, ViewColumn, commands, window, workspace } from 'vscode';
import path = require("path");
import { deleteRegistryResource, deleteDataMapperResources } from '../util/fileOperations';
import { extension } from '../MIExtensionContext';
import { ExtendedLanguageClient } from '../lang-client/ExtendedLanguageClient';
import { APIResource } from '../../../syntax-tree/lib/src';
import { MiDiagramRpcManager } from '../rpc-managers/mi-diagram/rpc-manager';
import { RegistryExplorerEntryProvider } from './registry-explorer-provider';
import { RUNTIME_VERSION_440 } from "../constants";
import { deleteSwagger } from '../util/swagger';
import { compareVersions } from '../util/onboardingUtils';
import { history, removeFromHistory } from '../history';
import * as fs from "fs";

export async function activateProjectExplorer(context: ExtensionContext, lsClient: ExtendedLanguageClient) {

	const projectExplorerDataProvider = new ProjectExplorerEntryProvider(context);
	await projectExplorerDataProvider.refresh(lsClient);
	let registryExplorerDataProvider;
	const projectTree = window.createTreeView('MI.project-explorer', { treeDataProvider: projectExplorerDataProvider });

	const projectDetailsRes = await lsClient?.getProjectDetails();
	const runtimeVersion = projectDetailsRes.primaryDetails.runtimeVersion.value;
	const isRegistrySupported = compareVersions(runtimeVersion, RUNTIME_VERSION_440) < 0;

	if (isRegistrySupported) {
		registryExplorerDataProvider = new RegistryExplorerEntryProvider(context);
		await registryExplorerDataProvider.refresh(lsClient);
		window.createTreeView('MI.registry-explorer', { treeDataProvider: registryExplorerDataProvider });
		vscode.commands.executeCommand('setContext', 'MI.registry-explorer.isVisible', true);
		commands.registerCommand(COMMANDS.REFRESH_REGISTRY_COMMAND, () => { return registryExplorerDataProvider.refresh(lsClient); });
	}

	commands.registerCommand(COMMANDS.REFRESH_COMMAND, () => { return projectExplorerDataProvider.refresh(lsClient); });
	// commands.registerCommand(COMMANDS.ADD_COMMAND, () => {
	// 	window.showQuickPick([
	// 		{ label: 'New Project', description: 'Create new project' }
	// 	], {
	// 		placeHolder: 'Select the construct to add'
	// 	}).then(selection => {
	// 		if (selection?.label === 'New Project') {
	// 			commands.executeCommand(COMMANDS.CREATE_PROJECT_COMMAND);
	// 		}
	// 	});
	// });
	commands.registerCommand(COMMANDS.ADD_ARTIFACT_COMMAND, () => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ADD_ARTIFACT });
		console.log('Add Artifact');
	});
	commands.registerCommand(COMMANDS.ADD_TO_REGISTRY_COMMAND, () => {
		const projectUri = StateMachine.context().projectUri;
		if (!projectUri) {
			window.showErrorMessage(
				'Unable to locate Project URI. Please try again after the extension has fully initialized.'
			);
			return;
		}
		const registryPath = path.join(projectUri, 'src', 'main', 'wso2mi', 'resources');
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.RegistryResourceForm, documentUri: registryPath });
		console.log('Add Registry Resource');
	});
	commands.registerCommand(COMMANDS.ADD_API_COMMAND, async (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.APIForm, documentUri: entry.info?.path });
		console.log('Add API');
	});

	commands.registerCommand(COMMANDS.ADD_RESOURCE_COMMAND, async (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.RegistryResourceForm, documentUri: entry.info?.path });
		console.log('Add Resource');
	});

	commands.registerCommand(COMMANDS.ADD_ENDPOINT_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.EndPointForm, documentUri: entry.info?.path });
		console.log('Add Endpoint');
	});

	commands.registerCommand(COMMANDS.ADD_SEQUENCE_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.SequenceForm, documentUri: entry.info?.path });
		console.log('Add Sequence');
	});

	commands.registerCommand(COMMANDS.MARK_SEQUENCE_AS_DEFAULT, async (entry: ProjectExplorerEntry) => {
		const filePath = entry.info?.path;
		const seqName = entry.info?.name;
		await setDefaultSequence(filePath, false, seqName);
	});

	commands.registerCommand(COMMANDS.UNMARK_SEQUENCE_AS_DEFAULT, async (entry: ProjectExplorerEntry) => {
		const filePath = entry.info?.path;
		await setDefaultSequence(filePath, true);
	});

	commands.registerCommand(COMMANDS.ADD_DATAMAPPER_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DatamapperForm, documentUri: entry.info?.path });
		console.log('Add Datamapper');
	});

	commands.registerCommand(COMMANDS.ADD_INBOUND_ENDPOINT_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.InboundEPForm, documentUri: entry.info?.path });
		console.log('Add Inbound API');
	});

	commands.registerCommand(COMMANDS.ADD_REGISTERY_RESOURCE_COMMAND, async (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.RegistryResourceForm, documentUri: entry.info?.path });
		console.log('Add Registry Resource');
	});

	commands.registerCommand(COMMANDS.ADD_CLASS_MEDIATOR_COMMAND, async (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ClassMediatorForm, documentUri: entry.info?.path });
		console.log('Add Class Mediator');
	});

	commands.registerCommand(COMMANDS.ADD_BALLERINA_MODULE_COMMAND, async (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.BallerinaModuleForm, documentUri: entry.info?.path });
		console.log('Add Ballerina Module');
	});

	commands.registerCommand(COMMANDS.EDIT_BALLERINA_MODULE_COMMAND, async (entry: string) => {
		workspace.openTextDocument(entry).then((doc) => {
			window.showTextDocument(doc, { preview: false });
		});
		commands.executeCommand('workbench.files.action.focusFilesExplorer');
	});

	commands.registerCommand(COMMANDS.ADD_DATA_SERVICE_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DataServiceForm, documentUri: entry.info?.path });
		console.log('Add Data Service');
	});

	commands.registerCommand(COMMANDS.ADD_MESSAGE_PROCESSOR_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.MessageProcessorForm, documentUri: entry.info?.path });
		console.log('Add Message Processor');
	});

	commands.registerCommand(COMMANDS.ADD_PROXY_SERVICE_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ProxyServiceForm, documentUri: entry.info?.path });
		console.log('Add Proxy Service');
	});

	commands.registerCommand(COMMANDS.ADD_TASK_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TaskForm, documentUri: entry.info?.path });
	});

	commands.registerCommand(COMMANDS.EDIT_REGISTERY_RESOURCE_COMMAND, async (entry: string) => {
		workspace.openTextDocument(entry).then((doc) => {
			window.showTextDocument(doc, { preview: false });
		});
	});

	commands.registerCommand(COMMANDS.EDIT_REGISTRY_RESOURCE_METADATA_COMMAND, async (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.RegistryMetadataForm, documentUri: entry.info?.path });
	});

	commands.registerCommand(COMMANDS.EDIT_CLASS_MEDIATOR_COMMAND, async (entry: string) => {
		workspace.openTextDocument(entry).then((doc) => {
			window.showTextDocument(doc, { preview: false });
		});
		commands.executeCommand('workbench.files.action.focusFilesExplorer');
	});

	commands.registerCommand(COMMANDS.SHOW_DATA_MAPPER, async (entry: string) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DataMapperView, documentUri: entry });
	});

	commands.registerCommand(COMMANDS.ADD_MESSAGE_STORE_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.MessageStoreForm, documentUri: entry.info?.path });
		console.log('Add Message Store');
	});

	commands.registerCommand(COMMANDS.ADD_TEMPLATE_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TemplateForm, documentUri: entry.info?.path });
		console.log('Add Template');
	});

	commands.registerCommand(COMMANDS.IMPORT_PROJECT_COMMAND, () => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ImportProjectForm });
		console.log('Import a Project');
	});

	commands.registerCommand(COMMANDS.ADD_LOCAL_ENTRY_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.LocalEntryForm, documentUri: entry.info?.path });
		console.log('Add Local Entry');
	});

	commands.registerCommand(COMMANDS.ADD_CONNECTION_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ConnectorStore, documentUri: entry.info?.path });
		console.log('Add Connection');
	});

	commands.registerCommand(COMMANDS.ADD_DATA_SOURCE_COMMAND, (entry: ProjectExplorerEntry) => {
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DataSourceForm, documentUri: entry.info?.path });
		console.log('Add Data Source');
	});

	commands.registerCommand(COMMANDS.REVEAL_ITEM_COMMAND, async (viewLocation: VisualizerLocation) => {
		const data = projectExplorerDataProvider.getChildren();

		if (viewLocation.documentUri && viewLocation.projectUri && data && projectTree.visible) {
			const project = (await data)?.find((project) => project.info?.path === viewLocation.projectUri);
			if (project) {
				projectTree.reveal(project, { select: true });
				const projectChildren = projectExplorerDataProvider.getChildren(project);
				if (projectChildren) {
					const projectResources = await projectChildren;
					if (!projectResources) return;

					for (const projectResource of projectResources) {
						if (projectResource.label === "Data Integration" || projectResource.label === "Common Artifacts" ||
							projectResource.label === "Advanced Artifacts") {
							const projectArtifacts = projectResource?.children;
							if (projectArtifacts) {
								for (const artifact of projectArtifacts) {
									const fileEntry = artifact.children?.find((file) => file !== undefined && file.info?.path === viewLocation.documentUri);
									if (fileEntry) {
										projectTree.reveal(fileEntry, { select: true });

										if (viewLocation.identifier !== undefined) {
											const resourceEntry = fileEntry.children?.find((file) => file.info?.path === `${viewLocation.documentUri}/${viewLocation.identifier}`);
											if (resourceEntry) {
												projectTree.reveal(resourceEntry, { select: true });
											}
										}
										break;
									}
								}
							}

						} else {
							const fileEntry = projectResource.children?.find((file) => file !== undefined && file.info?.path === viewLocation.documentUri);
							if (fileEntry) {
								projectTree.reveal(fileEntry, { select: true });

								if (viewLocation.identifier !== undefined) {
									const resourceEntry = fileEntry.children?.find((file) => file.info?.path === `${viewLocation.documentUri}/${viewLocation.identifier}`);
									if (resourceEntry) {
										projectTree.reveal(resourceEntry, { select: true });
									}
								}
								break;
							}
						}
					}
				}
			}
		}
	});

	// action items
	commands.registerCommand(COMMANDS.SHOW_RESOURCE_VIEW, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ResourceView, documentUri: documentUri?.fsPath, identifier: resourceIndex });
	});
	commands.registerCommand(COMMANDS.SHOW_SEQUENCE_VIEW, (documentUri: Uri, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.SequenceView, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_SEQUENCE_TEMPLATE_VIEW, (documentUri: Uri, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.SequenceTemplateView, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_PROXY_VIEW, (documentUri: Uri, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ProxyView, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_MESSAGE_STORE, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.MessageStoreForm, documentUri: documentUri?.fsPath });

	})
	commands.registerCommand(COMMANDS.SHOW_LOCAL_ENTRY, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.LocalEntryForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_CONNECTION, async (documentUri: Uri, connectionName: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, {
			view: MACHINE_VIEW.ConnectionForm, documentUri: documentUri?.fsPath,
			customProps: { connectionName: connectionName }
		});
	});
	commands.registerCommand(COMMANDS.SHOW_DATA_SOURCE, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DataSourceForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_TASK, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TaskForm, documentUri: documentUri?.fsPath, identifier: resourceIndex });
	});
	commands.registerCommand(COMMANDS.SHOW_TASK_VIEW, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TaskView, documentUri: documentUri?.fsPath, identifier: resourceIndex });
	});
	commands.registerCommand(COMMANDS.SHOW_INBOUND_ENDPOINT, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.InboundEPView, documentUri: documentUri?.fsPath, identifier: resourceIndex });
	});
	commands.registerCommand(COMMANDS.SHOW_SOURCE, (e: any) => {
		const documentUri = StateMachine.context().documentUri;
		if (documentUri) {
			const openedEditor = window.visibleTextEditors.find(editor => editor.document.uri.fsPath === documentUri);
			if (openedEditor) {
				window.showTextDocument(openedEditor.document, { viewColumn: openedEditor.viewColumn });
			} else {
				commands.executeCommand('vscode.open', Uri.file(documentUri), { viewColumn: ViewColumn.Beside });
			}
		}
	});
	commands.registerCommand(COMMANDS.SHOW_MESSAGE_PROCESSOR, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.MessageProcessorForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_XML, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		const uri = Uri.file(documentUri?.fsPath);
		workspace.openTextDocument(uri).then((document) => {
			window.showTextDocument(document);
		});
	});
	commands.registerCommand(COMMANDS.SHOW_TEMPLATE, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TemplateForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_ENDPOINT, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.EndPointForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_DEFAULT_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DefaultEndpointForm, documentUri: documentUri?.fsPath, customProps: { type: type } });
	});
	commands.registerCommand(COMMANDS.SHOW_ADDRESS_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.AddressEndpointForm, documentUri: documentUri?.fsPath, customProps: { type: type } });
	});
	commands.registerCommand(COMMANDS.SHOW_HTTP_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.HttpEndpointForm, documentUri: documentUri?.fsPath, customProps: { type: type } });
	});
	commands.registerCommand(COMMANDS.SHOW_WSDL_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.WsdlEndpointForm, documentUri: documentUri?.fsPath, customProps: { type: type } });
	});
	commands.registerCommand(COMMANDS.SHOW_LOAD_BALANCE_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.LoadBalanceEndPointForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_FAILOVER_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.FailoverEndPointForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_RECIPIENT_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.RecipientEndPointForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_TEMPLATE_ENDPOINT, (documentUri: Uri, type: string, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TemplateEndPointForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.SHOW_DATA_SERVICE, (documentUri: Uri, resourceIndex: string, beside: boolean = true) => {
		revealWebviewPanel(beside);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DataServiceForm, documentUri: documentUri?.fsPath });
	});
	commands.registerCommand(COMMANDS.OPEN_PROJECT_OVERVIEW, async (entry: ProjectExplorerEntry) => {
		revealWebviewPanel(false);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.Overview });
	});
	commands.registerCommand(COMMANDS.OPEN_SERVICE_DESIGNER, async (entry: ProjectExplorerEntry) => {
		revealWebviewPanel(false);
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ServiceDesigner, documentUri: entry.info?.path });
	});
	commands.registerCommand(COMMANDS.OPEN_DSS_SERVICE_DESIGNER, async (entry: ProjectExplorerEntry | Uri) => {
		revealWebviewPanel(false);
		const documentUri = entry instanceof ProjectExplorerEntry ? entry.info?.path : entry.fsPath;
		openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.DSSServiceDesigner, documentUri });
	});

	// delete
	commands.registerCommand(COMMANDS.DELETE_PROJECT_EXPLORER_ITEM, async (item: TreeItem) => {
		switch (item.contextValue) {
			case 'api':
			case 'endpoint':
			case 'sequence':
			case 'proxy-service':
			case 'inboundEndpoint':
			case 'messageStore':
			case 'message-processor':
			case 'task':
			case 'localEntry':
			case 'template':
			case 'dataSource':
			case 'connection':
			case 'data-service':
				{
					const fileUri = item.command?.arguments?.[0] || (item as any)?.info?.path;
					if (!fileUri) {
						window.showErrorMessage('Resource not found.');
						return;
					}
					const confirmation = await window.showWarningMessage(
						`Are you sure you want to delete ${item.contextValue} - ${item.label}?`,
						{ modal: true },
						'Yes'
					);

					if (confirmation === 'Yes') {
						try {
							await workspace.fs.delete(Uri.parse(fileUri), { recursive: true, useTrash: true });
							window.showInformationMessage(`${item.label} has been deleted.`);
							await vscode.commands.executeCommand(COMMANDS.REFRESH_COMMAND);

							const currentLocation = StateMachine.context();
							if (currentLocation.documentUri === fileUri) {
								openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.Overview });
							}
							removeFromHistory(fileUri.fsPath);

							if (item.contextValue === 'api') {
								deleteSwagger(fileUri);
							}
						} catch (error) {
							window.showErrorMessage(`Failed to delete ${item.label}: ${error}`);
						}
					}
					break;
				}
			case 'data-mapper':
				{
					const fileUri = item.command?.arguments?.[0];
					if (!fileUri) {
						window.showErrorMessage('Resource not found.');
						return;
					}
					const confirmation = await window.showWarningMessage(
						`Are you sure you want to delete Datamapper ${item.label} and its related contents?`,
						{ modal: true },
						'Yes'
					);

					if (confirmation === 'Yes') {
						try {
							// delete the file and the residing folder
							await deleteDataMapperResources(fileUri);
							window.showInformationMessage(`${item.label} has been deleted.`);
							await vscode.commands.executeCommand(COMMANDS.REFRESH_COMMAND);
							const currentLocation = StateMachine.context();
							if (currentLocation.documentUri === fileUri) {
								openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.Overview });
							}
							removeFromHistory(fileUri.fsPath);
						} catch (error) {
							window.showErrorMessage(`Failed to delete ${item.label}: ${error}`);
						}
					}
					break;
				}
			case 'resource':
				{
					const resourceId = item.command?.arguments?.[1];
					if (resourceId === undefined) {
						window.showErrorMessage('Resource ID not found.');
						return;
					}
					const langClient = StateMachine.context().langClient;
					const fileUri = item.command?.arguments?.[0];
					if (!langClient) {
						window.showErrorMessage('Language client not found.');
						return;
					}
					if (!fileUri) {
						window.showErrorMessage('Resource not found.');
						return;
					}
					const syntaxTree = await langClient.getSyntaxTree({ documentIdentifier: { uri: fileUri.fsPath } });
					const resource: APIResource = syntaxTree?.syntaxTree?.api?.resource[resourceId];

					if (!resource) {
						window.showErrorMessage(`Resource ${resourceId} not found.`);
					}
					const name = resource.uriTemplate || resource.urlMapping || "resource";
					const range = resource.range;
					const confirmation = await window.showWarningMessage(
						`Are you sure you want to delete resource - ${name}?`,
						{ modal: true },
						'Yes'
					);

					if (confirmation === 'Yes') {
						try {
							const rpcManager = new MiDiagramRpcManager();
							removeFromHistory(fileUri.fsPath, resourceId);
							await rpcManager.applyEdit({
								text: "",
								documentUri: fileUri.fsPath,
								range: {
									start: range.startTagRange.start,
									end: range.endTagRange.end,
								},
							});
							window.showInformationMessage(`Resource ${name} has been deleted.`);
						} catch (error) {
							window.showErrorMessage(`Failed to delete resource ${name}: ${error}`);
						}
					}

					break;
				}
			case 'registry-with-metadata':
			case 'registry-without-metadata': {
				let filePath = "";
				if (item instanceof ProjectExplorerEntry) {
					if (item.info && item.info?.path) {
						filePath = item.info.path;
					}
				} else if (item.id) {
					filePath = item.id;
				}
				if (filePath !== "") {
					const fileName = path.basename(filePath);
					const langClient = StateMachine.context().langClient;
					const fileUsageIdentifiers = await langClient?.getResourceUsages(filePath);
					const fileUsageMessage = fileUsageIdentifiers?.length && fileUsageIdentifiers?.length > 0 ? "It is used in:\n" + fileUsageIdentifiers.join(", ") : "No usage found";
					window.showInformationMessage("Do you want to delete : " + fileName + "\n\n" + fileUsageMessage, { modal: true }, "Yes")
						.then(async answer => {
							if (answer === "Yes") {
								const res = await deleteRegistryResource(filePath);
								if (res.status === true) {
									window.showInformationMessage(res.info);
									projectExplorerDataProvider.refresh(lsClient);
									if (isRegistrySupported && registryExplorerDataProvider) {
										registryExplorerDataProvider.refresh(lsClient);
									}
								} else {
									window.showErrorMessage(res.info);
								}
							}
						});
				}
				break;
			}
		}
		projectExplorerDataProvider.refresh(lsClient);
		if (compareVersions(runtimeVersion, RUNTIME_VERSION_440) < 0 && registryExplorerDataProvider) {
			registryExplorerDataProvider.refresh(lsClient);
		}
		if (StateMachine.context().view === MACHINE_VIEW.Overview) {
			refreshUI();
		}
	});

	async function setDefaultSequence(filePath?: string, remove?: boolean, seqName?: string) {
		const langClient = StateMachine.context().langClient;

		if (!filePath) {
			window.showErrorMessage('File path is not available');
			throw new Error('File path is not available');
		}

		// Read the POM file
		const workspaceFolder = workspace.getWorkspaceFolder(Uri.file(filePath));
		if (!workspaceFolder) {
			window.showErrorMessage('Cannot find workspace folder');
			throw new Error('Cannot find workspace folder');
		}

		const pomPath = path.join(workspaceFolder.uri.fsPath, 'pom.xml');
		const pomContent = fs.readFileSync(pomPath, 'utf-8');

		if (remove) {
			// Remove the <mainSequence> tag from the POM
			const updatedPomContent = pomContent.replace(/\s*<mainSequence>.*?<\/mainSequence>/, '');
			fs.writeFileSync(pomPath, updatedPomContent, 'utf-8');
			return;
		}

		if (!langClient) {
			window.showErrorMessage('Language client is not available');
			throw new Error('Language client is not available');
		}

		let sequenceName = seqName;

		if (!seqName) {
			// Get the syntax tree of the given file path
			const syntaxTree = await langClient.getSyntaxTree({
				documentIdentifier: {
					uri: filePath
				},
			});

			// Get the sequence name from the syntax tree
			const sequenceName = syntaxTree?.syntaxTree?.sequence?.name;
			if (!sequenceName) {
				window.showErrorMessage('Failed to get the sequence name from the syntax tree');
				throw new Error('Failed to get the sequence name from the syntax tree');
			}
		}

		const mainSequenceTag = `<mainSequence>${sequenceName}</mainSequence>`;

		// Check if the <properties> tag exists
		const propertiesTagExists = pomContent.includes('<properties>');

		if (propertiesTagExists) {
			// Inject the <mainSequence> tag inside the <properties> tag
			const updatedPomContent = pomContent.replace(/<properties>([\s\S]*?)<\/properties>/, (match, p1) => {
				if (p1.includes('<mainSequence>')) {
					// Update the existing <mainSequence> tag
					return match.replace(/<mainSequence>.*?<\/mainSequence>/, mainSequenceTag);
				} else {
					// Get the indentation from the <properties> tag
					const propertiesIndentation = pomContent.match(/(\s*)<properties>/)?.[1] || '';
					const indentedMainSequenceTag = `\t${mainSequenceTag}`;
					// Add the <mainSequence> tag
					return `<properties>${p1}${indentedMainSequenceTag}${propertiesIndentation}</properties>`;
				}
			});
			fs.writeFileSync(pomPath, updatedPomContent, 'utf-8');
		} else {
			window.showErrorMessage('Failed to find the project properties in the POM file');
		}
	}
}

function revealWebviewPanel(beside: boolean = true) {
	extension.webviewReveal = beside;
}
