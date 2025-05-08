// /**
//  * Copyright (c) 2018, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */

// import {
// 	commands, window, Uri, ViewColumn, WebviewPanel, Disposable, workspace, WorkspaceEdit, Range, Position,
// 	ProgressLocation, ExtensionContext, WorkspaceFolder, TextEdit, TextEditorRevealType, Selection
// } from 'vscode';
// import { render } from './renderer';
// import {
// 	CONNECTOR_LIST_CACHE,
// 	ExtendedLangClient,
// 	HTTP_CONNECTOR_LIST_CACHE
// } from '../../core/extended-language-client';
// import { BallerinaExtension, ballerinaExtInstance, Change } from '../../core';
// import { getCommonWebViewOptions, WebViewMethod, WebViewRPCHandler } from '../../utils';
// import { join, normalize } from "path";
// import { CMP_DIAGRAM_VIEW, sendTelemetryEvent, sendTelemetryException, TM_EVENT_OPEN_CODE_EDITOR, TM_EVENT_OPEN_LOW_CODE, TM_EVENT_LOW_CODE_RUN, TM_EVENT_EDIT_DIAGRAM, TM_EVENT_ERROR_EXECUTE_DIAGRAM_OPEN, getMessageObject } from '../../features/telemetry';
// import { getDataFromChoreo, openPerformanceDiagram, PerformanceAnalyzerAdvancedResponse, PerformanceAnalyzerRealtimeResponse } from '../forecaster';
// import { showMessage } from '../../utils/showMessage';
// import { sep } from "path";
// import { CommandResponse, DiagramOptions, Member, SyntaxTree } from './model';
// import { existsSync, readFileSync, writeFileSync } from 'fs';
// import { runCommand, runBackgroundTerminalCommand, openExternalUrl } from '../../utils/runCommand';
// import { Diagnostic } from '.';
// import { createTests } from '../../features/testing/activator';
// import {
// 	cachedLibrariesList,
// 	cachedSearchList,
// 	getAllResources,
// 	getLibrariesList,
// 	getLibraryData,
// 	DIST_LIB_LIST_CACHE,
// 	LANG_LIB_LIST_CACHE,
// 	LIBRARY_SEARCH_CACHE,
// 	STD_LIB_LIST_CACHE
// } from "../../features/library-browser";
// import {
// 	LibrariesListResponse,
// 	LibraryDataResponse,
// 	LibraryKind,
// 	LibrarySearchResponse
// } from '@wso2-enterprise/ballerina-core';
// import { getSentryConfig, SentryConfig } from './sentry';
// import { Connectors, GetSyntaxTreeResponse } from '@wso2-enterprise/ballerina-core';
// import { NodePosition } from "@wso2-enterprise/syntax-tree";
// import { PALETTE_COMMANDS } from '../../features/project';
// import { openView } from '../../stateMachine';

// export let hasDiagram: boolean = false;

// // const NO_DIAGRAM_VIEWS: string = 'No Ballerina diagram views found!';

// let langClient: ExtendedLangClient;
// let diagramElement: DiagramOptions | undefined = undefined;
// let ballerinaExtension: BallerinaExtension;
// let webviewRPCHandler: WebViewRPCHandler;
// let currentDocumentURI: Uri;
// let experimentalEnabled: boolean;
// let openNodeInDiagram: NodePosition;

// export async function showDiagramEditor(startLine: number, startColumn: number, filePath: string,
// 	isCommand: boolean = false, openInDiagram?: NodePosition): Promise<void> {

// 	if (openInDiagram) {
// 		openNodeInDiagram = openInDiagram;
// 	}

// 	const editor = window.activeTextEditor;
// 	if (isCommand) {
// 		if (!editor || !editor.document.fileName.endsWith('.bal')) {
// 			const message = 'Current file is not a ballerina file.';
// 			sendTelemetryEvent(ballerinaExtension, TM_EVENT_ERROR_EXECUTE_DIAGRAM_OPEN, CMP_DIAGRAM_VIEW, getMessageObject(message));
// 			window.showErrorMessage(message);
// 			return;
// 		}
// 	}

// 	const projectPaths: WorkspaceFolder[] = [];
// 	const choreoProjectFile = await workspace.findFiles(process.platform === 'win32' ? '**\\.choreo-project' : '**/.choreo-project');

// 	if (choreoProjectFile.length > 0) {
// 		const choreoProjectFolderPath = choreoProjectFile[0].path.replace(/\/\.choreo-project$/, '');
// 		workspace.workspaceFolders.forEach((workspaceFolder) => {
// 			if (extractFilePath(workspaceFolder.uri.path) !== extractFilePath(choreoProjectFolderPath)) {
// 				projectPaths.push(workspaceFolder);
// 			}
// 		});
// 	} else if (workspace && workspace.workspaceFolders) {
// 		projectPaths.push(...workspace.workspaceFolders);
// 	}


// 	if (isCommand) {
// 		if (!editor) {
// 			window.showErrorMessage(CMP_DIAGRAM_VIEW);
// 			return;
// 		}

// 		diagramElement = {
// 			fileUri: editor!.document.uri,
// 			startLine: editor!.selection.active.line,
// 			startColumn: editor!.selection.active.character,
// 			isDiagram: true,
// 			diagramFocus: {
// 				fileUri: editor!.document.uri.path,
// 				position: openInDiagram
// 			},
// 			workspaceName: workspace.name,
// 			projectPaths
// 		};
// 	} else {
// 		diagramElement = {
// 			fileUri: filePath === '' ? editor!.document.uri : Uri.file(filePath),
// 			startLine,
// 			startColumn,
// 			isDiagram: true,
// 			diagramFocus: {
// 				fileUri: (filePath === '' ? editor!.document.uri : Uri.file(filePath)).path,
// 				position: openInDiagram
// 			},
// 			workspaceName: workspace.name,
// 			projectPaths
// 		};
// 	}

// 	DiagramPanel.create(isCommand ? ViewColumn.Two : ViewColumn.One);

// 	// Reset cached connector list
// 	langClient.getConnectors({ query: "", limit: 18 }, true).then((response) => {
// 		const connectorList = response as Connectors;
// 		if (connectorList.central === undefined) {
// 			return;
// 		}
// 		if (connectorList && connectorList.central?.length > 0) {
// 			ballerinaExtInstance.context?.globalState.update(CONNECTOR_LIST_CACHE, connectorList);
// 		}
// 	});

// 	// Reset cached HTTP connector list
// 	langClient.getConnectors({ query: "http", limit: 18 }, true).then((response) => {
// 		const connectorList = response as Connectors;
// 		if (connectorList.central === undefined) {
// 			return;
// 		}
// 		if (connectorList && connectorList.central?.length > 0) {
// 			ballerinaExtInstance.context?.globalState.update(HTTP_CONNECTOR_LIST_CACHE, connectorList);
// 		}
// 	});

// 	// Cache the lang lib list
// 	getLibrariesList(LibraryKind.langLib).then((libs) => {
// 		if (libs && libs.librariesList.length > 0) {
// 			cachedLibrariesList.set(LANG_LIB_LIST_CACHE, libs);
// 		}
// 	});

// 	// Cache the std lib list
// 	getLibrariesList(LibraryKind.stdLib).then((libs) => {
// 		if (libs && libs.librariesList.length > 0) {
// 			cachedLibrariesList.set(STD_LIB_LIST_CACHE, libs);
// 		}
// 	});

// 	// Cache the distribution lib list (lang libs + std libs)
// 	getLibrariesList().then((libs) => {
// 		if (libs && libs.librariesList.length > 0) {
// 			cachedLibrariesList.set(DIST_LIB_LIST_CACHE, libs);
// 		}
// 	});

// 	// Cache the library search data
// 	getAllResources().then((data) => {
// 		if (data && data.modules.length > 0) {
// 			cachedSearchList.set(LIBRARY_SEARCH_CACHE, data);
// 		}
// 	});

// 	// Update test view
// 	if (filePath === '' && ballerinaExtInstance.getDocumentContext().isActiveDiagram()) {
// 		filePath = ballerinaExtInstance.getDocumentContext().getLatestDocument()!.fsPath;
// 	}
// 	createTests(Uri.file(filePath));
// }

// export function activate(ballerinaExtInstance: BallerinaExtension) {
// 	langClient = <ExtendedLangClient>ballerinaExtInstance.langClient;
// 	ballerinaExtension = ballerinaExtInstance;

// 	ballerinaExtInstance.getDocumentContext().onEditorChanged(change => {
// 		refreshDiagramForEditorChange(change);
// 	});

// 	commands.registerCommand('ballerina.show.source', () => {
// 		const path = ballerinaExtension.getDocumentContext().getLatestDocument();
// 		if (!path) {
// 			return;
// 		}
// 		commands.executeCommand('workbench.action.splitEditor');
// 		commands.executeCommand('vscode.open', path);
// 		//editor-code-editor
// 		sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_OPEN_CODE_EDITOR, CMP_DIAGRAM_VIEW);
// 	});

// 	commands.registerCommand(PALETTE_COMMANDS.OPEN_IN_DIAGRAM, (path, position, ignoreFileCheck) => {
// 		if (!webviewRPCHandler || !DiagramPanel.currentPanel) {
// 			commands.executeCommand(PALETTE_COMMANDS.SHOW_DIAGRAM, path, position, ignoreFileCheck);
// 		} else {
// 			const args = [{
// 				filePath: path,
// 				startLine: 0,
// 				startColumn: 0,
// 				openInDiagram: position,
// 			}];
// 			webviewRPCHandler.invokeRemoteMethod('updateDiagram', args, () => { });
// 			commands.executeCommand(PALETTE_COMMANDS.SHOW_DIAGRAM, path, position, ignoreFileCheck);
// 		}
// 	});

// 	const diagramRenderDisposable = commands.registerCommand(PALETTE_COMMANDS.SHOW_DIAGRAM, (...args: any[]) => {
// 		let path = args.length > 0 ? args[0] : window.activeTextEditor.document.uri.fsPath || '';
// 		if (args[0] instanceof Uri) {
// 			path = args[0].fsPath;
// 		}

// 		let nodePosition: NodePosition;
// 		if (args.length > 1
// 			&& (args[1] as NodePosition).startLine !== undefined
// 			&& (args[1] as NodePosition).startColumn !== undefined
// 			&& (args[1] as NodePosition).endLine !== undefined
// 			&& (args[1] as NodePosition).endColumn !== undefined) {
// 			nodePosition = args[1];
// 		}

// 		let ignoreFileCheck = false;
// 		if (args.length > 2) {
// 			ignoreFileCheck = args[2];
// 		}

// 		//editor-lowcode-editor
// 		sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_OPEN_LOW_CODE, CMP_DIAGRAM_VIEW);
// 		openView("OPEN_VIEW", {view: "Overview"});
// 		showDiagramEditor(0, 0, path, !ignoreFileCheck, nodePosition);
// 	});


// 	const context = <ExtensionContext>ballerinaExtInstance.context;
// 	context.subscriptions.push(diagramRenderDisposable);
// 	experimentalEnabled = ballerinaExtension.enabledExperimentalFeatures();
// }

// function resolveMissingDependencyByCodeAction(filePath: string, fileContent: string, diagnostic: Diagnostic, langClient: ExtendedLangClient) {
// 	langClient.codeAction({
// 		context: {
// 			diagnostics: [{
// 				code: diagnostic.diagnosticInfo.code,
// 				message: diagnostic.message,
// 				range: {
// 					end: {
// 						line: diagnostic.range.endLine,
// 						character: diagnostic.range.endColumn
// 					},
// 					start: {
// 						line: diagnostic.range.startLine,
// 						character: diagnostic.range.startColumn
// 					}
// 				},
// 				severity: 1
// 			}],
// 			only: ["quickfix"]
// 		},
// 		range: {
// 			end: {
// 				line: diagnostic.range.endLine,
// 				character: diagnostic.range.endColumn
// 			},
// 			start: {
// 				line: diagnostic.range.startLine,
// 				character: diagnostic.range.startColumn
// 			}
// 		},
// 		textDocument: {
// 			uri: Uri.file(filePath).toString()
// 		}
// 	}).then(codeaction => {
// 		if (codeaction.length > 0 && codeaction[0].command) {
// 			langClient.executeCommand(codeaction[0].command).then(result => {
// 				// Update the diagram.
// 				callUpdateDiagramMethod();
// 			});
// 		}
// 	});
// }

// async function resolveMissingDependency(filePath: string, fileContent: string, langClient: ExtendedLangClient) {
// 	// Show the progress bar.
// 	await window.withProgress({
// 		location: ProgressLocation.Window,
// 		title: "Resolving dependencies...",
// 		cancellable: false
// 	}, async (progress) => {
// 		progress.report({ increment: 0 });

// 		// Resolve missing dependencies.
// 		const dependenciesResponse = await langClient.resolveMissingDependencies({
// 			documentIdentifier: {
// 				uri: Uri.file(filePath).toString()
// 			}
// 		});

// 		const response = dependenciesResponse as GetSyntaxTreeResponse;
// 		progress.report({ increment: 20, message: "Updating code file..." });

// 		if (response.parseSuccess) {
// 			progress.report({ increment: 50, message: "Updating code file..." });

// 			// Rebuild the file to update the LS.
// 			await langClient.didChange({
// 				contentChanges: [
// 					{
// 						text: fileContent
// 					}
// 				],
// 				textDocument: {
// 					uri: Uri.file(filePath).toString(),
// 					version: 1
// 				}
// 			});
// 			progress.report({ increment: 70, message: "Updating diagram..." });

// 			// Update the diagram.
// 			callUpdateDiagramMethod();
// 			progress.report({ increment: 100, message: "Updating diagram..." });
// 		}
// 	});
// }

// class DiagramPanel {
// 	public static currentPanel: DiagramPanel | undefined;
// 	private readonly webviewPanel: WebviewPanel;
// 	private disposables: Disposable[] = [];


// 	private constructor(panel: WebviewPanel) {
// 		this.webviewPanel = panel;
// 		this.update();
// 		this.webviewPanel.onDidDispose(() => this.dispose(), null, this.disposables);
// 	}

// 	public static create(viewColumn: ViewColumn) {
// 		if (DiagramPanel.currentPanel && DiagramPanel.currentPanel.webviewPanel.viewColumn
// 			&& DiagramPanel.currentPanel.webviewPanel.viewColumn == viewColumn) {
// 			DiagramPanel.currentPanel.webviewPanel.reveal();
// 			DiagramPanel.currentPanel.update();
// 			ballerinaExtension.setDiagramActiveContext(true);
// 			return;
// 		} else if (DiagramPanel.currentPanel) {
// 			DiagramPanel.currentPanel.dispose();
// 		}

// 		const fileName: string | undefined = getCurrentFileName();
// 		const panel = window.createWebviewPanel(
// 			'ballerinaDiagram',
// 			`Overview Diagram`,
// 			{ viewColumn, preserveFocus: false },
// 			getCommonWebViewOptions()
// 		);
// 		hasDiagram = true;
// 		ballerinaExtension.setDiagramActiveContext(true);
// 		panel.iconPath = {
// 			light: Uri.file(join(ballerinaExtension.context!.extensionPath, 'resources/images/icons/design-view.svg')),
// 			dark: Uri.file(join(ballerinaExtension.context!.extensionPath,
// 				'resources/images/icons/design-view-inverse.svg'))
// 		};

// 		panel.onDidChangeViewState(event => {
// 			event.webviewPanel.active ? ballerinaExtension.setDiagramActiveContext(true) :
// 				ballerinaExtension.setDiagramActiveContext(false);
// 		});

// 		const remoteMethods: WebViewMethod[] = [
// 			{
// 				methodName: "getFileContent",
// 				handler: async (args: any[]): Promise<string | undefined> => {
// 					// Get the active text editor
// 					const filePath = args[0];
// 					const normalizedFilePath = normalize(filePath);
// 					const doc = workspace.textDocuments.find((doc) => normalize(doc.fileName) === normalizedFilePath);
// 					if (doc) {
// 						return doc.getText();
// 					}
// 					return readFileSync(normalizedFilePath, { encoding: 'utf-8' });
// 				}
// 			},
// 			{
// 				methodName: "updateFileContent",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					// Get the active text editor
// 					const filePath = args[0];
// 					const normalizedFilePath = normalize(filePath);
// 					const fileContent = args[1];
// 					const skipForceSave = args.length > 2 ? args[2] : false;
// 					const doc = workspace.textDocuments.find((doc) => normalize(doc.fileName) === normalizedFilePath);
// 					commands.executeCommand(PALETTE_COMMANDS.REFRESH_SHOW_ARCHITECTURE_VIEW);
// 					if (doc) {
// 						const edit = new WorkspaceEdit();
// 						edit.replace(Uri.file(normalizedFilePath), new Range(new Position(0, 0), doc.lineAt(doc.lineCount - 1).range.end), fileContent);
// 						await workspace.applyEdit(edit);
// 						langClient.updateStatusBar();
// 						if (skipForceSave) {
// 							// Skip saving document and keep in dirty mode
// 							return true;
// 						}
// 						return doc.save();
// 					} else {
// 						langClient.didChange({
// 							contentChanges: [
// 								{
// 									text: fileContent
// 								}
// 							],
// 							textDocument: {
// 								uri: Uri.file(normalizedFilePath).toString(),
// 								version: 1
// 							}
// 						});
// 						writeFileSync(normalizedFilePath, fileContent);
// 						langClient.updateStatusBar();
// 					}
// 					return false;
// 				}
// 			},
// 			{
// 				methodName: "gotoSource",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					const filePath = args[0];
// 					const position: { startLine: number, startColumn: number } = args[1];
// 					if (!existsSync(filePath)) {
// 						return false;
// 					}
// 					workspace.openTextDocument(filePath).then((sourceFile) => {
// 						const openedDocument = window.visibleTextEditors.find((editor) => editor.document.fileName === filePath);
// 						if (openedDocument) {
// 							const range: Range = new Range(position.startLine, position.startColumn, position.startLine!, position.startColumn!);
// 							window.visibleTextEditors[0].revealRange(range, TextEditorRevealType.InCenter);
// 							window.showTextDocument(
// 								openedDocument.document,
// 								{ preview: false, viewColumn: openedDocument.viewColumn, preserveFocus: false }
// 							);
// 						} else {
// 							window.showTextDocument(sourceFile, { preview: false, preserveFocus: false }).then((textEditor) => {
// 								const range: Range = new Range(position.startLine, position.startColumn, position.startLine!, position.startColumn!);
// 								textEditor.revealRange(range, TextEditorRevealType.InCenter);
// 								textEditor.selection = new Selection(range.start, range.start);
// 							});
// 						}
// 					});
// 					return true;
// 				}
// 			},
// 			{
// 				methodName: "showPerformanceGraph",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					return openPerformanceDiagram(args[0]);
// 				}
// 			},
// 			{
// 				methodName: "getPerfDataFromChoreo",
// 				handler: async (args: any[]): Promise<PerformanceAnalyzerRealtimeResponse | PerformanceAnalyzerAdvancedResponse | undefined | boolean> => getDataFromChoreo(args[0], args[1]).then(data => {
// 					return data;
// 				}).catch(e => {
// 					return false;
// 				})
// 			},
// 			{
// 				methodName: "resolveMissingDependency",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					await resolveMissingDependency(args[0], args[1], langClient);
// 					return true;
// 				}
// 			},
// 			{
// 				methodName: "resolveMissingDependencyByCodeAction",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					resolveMissingDependencyByCodeAction(args[0], args[1], args[2], langClient);
// 					return true;
// 				}
// 			},
// 			{
// 				methodName: "showMessage",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					if (!args[5] && (!ballerinaExtension.enabledPerformanceForecasting() ||
// 						ballerinaExtension.getPerformanceForecastContext().temporaryDisabled)) {
// 						return false;
// 					}
// 					let callBack = async (filePath: string, fileContent: string) => {
// 						await resolveMissingDependency(filePath, fileContent, langClient);
// 					};
// 					showMessage(args[0], args[1], args[2], args[3], args[4], callBack);
// 					return true;
// 				}
// 			},
// 			{
// 				methodName: 'focusDiagram',
// 				handler: (_args: any[]): Promise<boolean> => {
// 					ballerinaExtension.setDiagramActiveContext(true);
// 					return Promise.resolve(true);
// 				}
// 			},
// 			{
// 				methodName: "runCommand",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					await runCommand(args[0], args[1]);
// 					//editor-lowcode-code-run
// 					sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_LOW_CODE_RUN, CMP_DIAGRAM_VIEW);
// 					return Promise.resolve(true);
// 				}
// 			},
// 			{
// 				methodName: "runBackgroundTerminalCommand",
// 				handler: async (args: any[]): Promise<CommandResponse> => {
// 					return await runBackgroundTerminalCommand(args[0]);
// 				}
// 			},
// 			{
// 				methodName: "openArchitectureView",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					commands.executeCommand(PALETTE_COMMANDS.SHOW_ARCHITECTURE_VIEW, args[0]);
// 					return Promise.resolve(true);
// 				}
// 			},
// 			{
// 				methodName: "openCellView",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					commands.executeCommand(PALETTE_COMMANDS.SHOW_CELL_VIEW, args[0]);
// 					return Promise.resolve(true);
// 				}
// 			},
// 			{
// 				methodName: "openExternalUrl",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					openExternalUrl(args[0]);
// 					return Promise.resolve(true);
// 				}
// 			},
// 			{
// 				methodName: "sendTelemetryEvent",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					const event: {
// 						type: string;
// 						name: string;
// 						property?: { [key: string]: string };
// 						measurements?: { [key: string]: number; };
// 					} = args[0];
// 					if (event.type === TM_EVENT_EDIT_DIAGRAM) {
// 						ballerinaExtInstance.getCodeServerContext().telemetryTracker?.incrementDiagramEditCount();
// 					} else {
// 						sendTelemetryEvent(ballerinaExtension, event.type, event.name, event.property, event.measurements);
// 					}
// 					return Promise.resolve(true);
// 				}
// 			},
// 			{
// 				methodName: "getLibrariesList",
// 				handler: async (args: any[]): Promise<LibrariesListResponse | undefined> => {
// 					return await getLibrariesList(args[0]);
// 				}
// 			},
// 			{
// 				methodName: "getLibrariesData",
// 				handler: async (): Promise<LibrarySearchResponse | undefined> => {
// 					return await getAllResources();
// 				}
// 			},
// 			{
// 				methodName: "getLibraryData",
// 				handler: async (args: any[]): Promise<LibraryDataResponse | undefined> => {
// 					return await getLibraryData(args[0], args[1], args[2]);
// 				}
// 			},
// 			{
// 				methodName: "getSentryConfig",
// 				handler: async (): Promise<SentryConfig | undefined> => {
// 					return ballerinaExtension.getCodeServerContext().codeServerEnv ? await getSentryConfig() : undefined;
// 				}
// 			},
// 			{
// 				methodName: "getBallerinaVersion",
// 				handler: async (): Promise<string | undefined> => {
// 					const balVersion = ballerinaExtInstance.ballerinaVersion.toLowerCase();
// 					return Promise.resolve(balVersion);
// 				}
// 			},
// 			{
// 				methodName: "getEnv",
// 				handler: async (args: any[]): Promise<any> => {
// 					const envName = args[0];
// 					return (envName in process.env) ? process.env[envName] : "NOT_FOUND";
// 				}
// 			},
// 			{
// 				methodName: "getAllFilesInProject",
// 				handler: async (args: any[]): Promise<Uri[]> => {
// 					// TODO: handle ignore glob pattern as well, and change the frontend filter
// 					console.log("getAllFilesInProject", args, process.platform);
// 					if (process.platform === 'win32') {
// 						return workspace.findFiles(args[0].replaceAll(/\//g, '\\'));
// 					} else {
// 						return workspace.findFiles(args[0]);
// 					}
// 				}
// 			},
// 			{
// 				methodName: "renameSymbol",
// 				handler: async (args: any[]): Promise<boolean> => {
// 					const langEdits = args[0];
// 					const workspaceEdits = new WorkspaceEdit();

// 					Object.entries(langEdits?.changes).forEach(([key, value]) => {
// 						const fileUri = Uri.file(Uri.parse(key).fsPath);
// 						const textEditList: TextEdit[] = [];
// 						Object.entries(value).forEach(([, editVal]) => {
// 							const newTextEdit: TextEdit = new TextEdit(editVal.range, editVal.newText);
// 							textEditList.push(newTextEdit);
// 						});
// 						workspaceEdits.set(fileUri, textEditList);
// 					});

// 					const results = workspace.applyEdit(workspaceEdits);
// 					return Promise.resolve(results);
// 				}
// 			}
// 		];

// 		webviewRPCHandler = WebViewRPCHandler.create(panel, langClient, remoteMethods);
// 		DiagramPanel.currentPanel = new DiagramPanel(panel);
// 	}

// 	public dispose() {
// 		ballerinaExtension.setDiagramActiveContext(false);
// 		DiagramPanel.currentPanel = undefined;
// 		this.webviewPanel.dispose();
// 		this.disposables.forEach(disposable => {
// 			disposable.dispose();
// 		});
// 		hasDiagram = false;
// 	}

// 	private update() {
// 		if (diagramElement && diagramElement.isDiagram) {
// 			if (!DiagramPanel.currentPanel) {
// 				performDidOpen();
// 				this.webviewPanel.webview.html = render(
// 					diagramElement!.fileUri!.fsPath!,
// 					diagramElement!.startLine!,
// 					diagramElement!.startColumn!,
// 					experimentalEnabled,
// 					openNodeInDiagram,
// 					this.webviewPanel.webview,
// 					diagramElement.projectPaths,
// 					diagramElement!.diagramFocus
// 				);
// 			} else {
// 				callUpdateDiagramMethod();
// 			}
// 		}
// 	}

// 	public updateTitle(title: string) {
// 		if (this.webviewPanel.title === title) {
// 			return;
// 		}
// 		this.webviewPanel.title = title;
// 	}
// }

// export async function refreshDiagramForEditorChange(change: Change) {
// 	if (!webviewRPCHandler || !DiagramPanel.currentPanel) {
// 		return;
// 	}

// 	if (change && langClient) {
// 		await langClient.getSyntaxTree({
// 			documentIdentifier: {
// 				uri: change.fileUri.toString()
// 			}
// 		}).then(stResponse => {
// 			const response = stResponse as GetSyntaxTreeResponse;
// 			if (response.parseSuccess && response.syntaxTree) {
// 				diagramElement = getChangedElement(response.syntaxTree as any, change);
// 			}
// 		});
// 	}

// 	if (!diagramElement!.isDiagram) {
// 		diagramElement!.fileUri = window.activeTextEditor?.document.uri;
// 		diagramElement!.startLine = 0;
// 		diagramElement!.startColumn = 0;
// 	}
// 	callUpdateDiagramMethod(true);
// }

// export function callUpdateDiagramMethod(isEditorChange: boolean = false) {
// 	performDidOpen();
// 	let ballerinaFilePath = diagramElement!.fileUri!.fsPath;
// 	const fileName: string | undefined = getCurrentFileName();
// 	DiagramPanel.currentPanel?.updateTitle(fileName ? `${fileName} Diagram` : `Ballerina Diagram`);
// 	const args = [{
// 		filePath: isEditorChange ? undefined : ballerinaFilePath,
// 		startLine: diagramElement!.startLine,
// 		startColumn: diagramElement!.startColumn,
// 		projectPaths: diagramElement!.projectPaths
// 	}];
// 	webviewRPCHandler.invokeRemoteMethod('updateDiagram', args, () => { });
// }

// export async function refreshDiagramForPerformanceConcurrencyChanges(args: any) {
// 	if (!webviewRPCHandler || !DiagramPanel.currentPanel) {
// 		return;
// 	}

// 	webviewRPCHandler.invokeRemoteMethod('updatePerfPath', args, () => { });
// }

// function performDidOpen() {
// 	let tempUri: Uri | undefined;
// 	if (diagramElement!.fileUri) {
// 		tempUri = diagramElement?.fileUri!;
// 	}
// 	if (!tempUri) {
// 		return;
// 	}
// 	ballerinaExtension.getDocumentContext().setLatestDocument(tempUri);
// 	const doc = workspace.textDocuments.find((doc) => doc.uri === tempUri);
// 	if (doc) {
// 		return;
// 	}
// 	if (currentDocumentURI !== tempUri!) {
// 		const content: string = readFileSync(tempUri.fsPath, { encoding: 'utf-8' });
// 		langClient.didOpen({
// 			textDocument: {
// 				uri: tempUri.toString(),
// 				languageId: 'ballerina',
// 				version: 1,
// 				text: content
// 			}
// 		});
// 		currentDocumentURI = tempUri;
// 	}
// }

// function getChangedElement(st: SyntaxTree, change: Change): DiagramOptions {
// 	if (!st.members) {
// 		return { isDiagram: false };
// 	}

// 	let member: Member[] = st.members.filter(member => {
// 		return isWithinRange(member, change);
// 	});

// 	//Add import members
// 	if (st != null && st.hasOwnProperty("imports")) {
// 		const imports: Member[] = st["imports"].filter(importStatement => {
// 			return isWithinRange(importStatement, change);
// 		});
// 		member = [...member, ...imports];
// 	}

// 	if (member.length == 0) {
// 		return { isDiagram: false };
// 	}

// 	if (member[0].kind === 'ServiceDeclaration') {
// 		for (let ri = 0; ri < member[0].members.length; ri++) {
// 			const resource = member[0].members[ri];
// 			if (resource.kind === 'ResourceAccessorDefinition' && isWithinRange(resource, change)) {
// 				return {
// 					isDiagram: true, fileUri: change.fileUri, startLine: resource.functionName?.position.startLine,
// 					startColumn: resource.functionName?.position.startColumn
// 				};
// 			}
// 		}
// 		return {
// 			isDiagram: true, fileUri: change.fileUri, startLine: member[0].position.startLine,
// 			startColumn: member[0].position.startColumn
// 		};

// 	} else if (member[0].kind === 'ListenerDeclaration' || member[0].kind === 'ModuleVarDecl' ||
// 		member[0].kind === 'TypeDefinition' || member[0].kind === 'ConstDeclaration' ||
// 		member[0].kind === 'EnumDeclaration' || member[0].kind === 'ClassDefinition' ||
// 		member[0].kind === 'ImportDeclaration' || member[0].kind === 'FunctionDefinition') {
// 		if (member[0].kind === 'FunctionDefinition') {
// 			return {
// 				isDiagram: true, fileUri: change.fileUri,
// 				startLine: member[0].functionName?.position.startLine,
// 				startColumn: member[0].functionName?.position.startColumn
// 			};
// 		} else {
// 			return {
// 				isDiagram: true, fileUri: change.fileUri, startLine: member[0].position.startLine,
// 				startColumn: member[0].position.startColumn
// 			};
// 		}
// 	}
// 	return { isDiagram: false };
// }

// function isWithinRange(member: Member, change: Change) {
// 	return (member.position.startLine < change.startLine || (member.position.startLine === change.startLine &&
// 		member.position.startColumn <= change.startColumn)) && (member.position.endLine > change.startLine ||
// 			(member.position.endLine === change.startLine && member.position.endColumn >= change.startColumn));
// }

// function getCurrentFileName(): string | undefined {
// 	if (!diagramElement || !diagramElement!.fileUri) {
// 		return undefined;
// 	}
// 	return diagramElement!.fileUri!.fsPath.split(sep).pop();
// }

// export function updateDiagramElement(element: DiagramOptions | undefined) {
// 	diagramElement = element;
// }

// export function extractFilePath(uri: string): string | null {
// 	let filePath = uri;
// 	if (uri.startsWith('file://')) {
// 		const url = new URL(uri);
// 		filePath = url.pathname;
// 	}

// 	if (filePath && filePath.match(/^\/[a-zA-Z]:/g)) {
// 		// windows filepath matched
// 		filePath = filePath.replace('/', '');
// 	}

// 	if (filePath && filePath.match(/^[A-Z]:\//g)) {
// 		const firstCharacter = filePath.charAt(0).toLowerCase();
// 		const remaining = filePath.slice(1);
// 		filePath = `${firstCharacter}${remaining}`;
// 	}

// 	return filePath;
// }
