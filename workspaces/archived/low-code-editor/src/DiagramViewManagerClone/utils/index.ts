/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
import { monaco } from "react-monaco-editor";

import {
    BallerinaConnectorInfo,
    CommandResponse,
    DiagramDiagnostic,
    DiagramEditorLangClientInterface, DIAGRAM_MODIFIED,
    FileListEntry,
    FunctionDef,
    FunctionDefinitionInfo,
    getImportStatements,
    InsertorDelete,
    LowcodeEvent,
    STModification
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ModuleVarDecl, NodePosition, STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";
import { TextDocumentPositionParams, WorkspaceEdit } from "vscode-languageserver-protocol";

import { UndoRedoManager } from "../../Diagram/components/FormComponents/UndoRedoManager";
import { FindNodeByUidVisitor } from "../../Diagram/visitors/find-node-by-uid";
import { getSymbolInfo } from "../../Diagram/visitors/symbol-finder-visitor";
import {
    getFunctionSyntaxTree, getLowcodeST, isDeleteModificationAvailable, isUnresolvedModulesAvailable
} from "../../DiagramGenerator/generatorUtil";
import { EditorProps, PALETTE_COMMANDS } from "../../DiagramGenerator/vscode/Diagram";
import { ComponentViewInfo } from "../../OverviewDiagram/util";
import { LowCodeEditorProps, MESSAGE_TYPE } from "../../types";

import { NewExpressionVisitor } from "./new-expression-visitor";

export async function getSTNodeForReference(
    file: string,
    position: NodePosition,
    langClient: DiagramEditorLangClientInterface
): Promise<STNode> {
    const request: TextDocumentPositionParams = {
        textDocument: { uri: monaco.Uri.file(file).toString() },
        position: { line: position.startLine, character: position.startColumn }
    };
    const response = await langClient.getDefinitionPosition(request);
    return new Promise((resolve, reject) => {
        if (response.syntaxTree) {
            resolve(response.syntaxTree);
        } else {
            reject();
        }
    });
}

export function getDiagramProviderProps(
    focusedST: STNode,
    lowCodeEnvInstance: string,
    currentFileContent: string,
    focusFile: string,
    fileList: FileListEntry[],
    stMemberId: string,
    completeST: STNode,
    lowCodeResourcesVersion: any,
    balVersion: string,
    props: EditorProps,
    undoRedoManager: UndoRedoManager,
    setFocusedST: React.Dispatch<React.SetStateAction<STNode>>,
    setCompleteST: React.Dispatch<React.SetStateAction<STNode>>,
    setFileContent: (content: string) => void,
    updateActiveFile: (currentFile: FileListEntry) => void,
    updateSelectedComponent: (info: ComponentViewInfo) => void,
    navigateUptoParent: (position: NodePosition) => void,
    setUpdateTimestamp: (timestamp: string) => void
): LowCodeEditorProps {
    const {
        langClientPromise, resolveMissingDependency, runCommand, experimentalEnabled,
        getLibrariesData, getLibrariesList, getLibraryData
    } = props;


    async function showTryitView(serviceName: string) {
        runCommand(PALETTE_COMMANDS.TRY_IT, [focusFile, serviceName]);
    }

    async function run(args: any[]) {
        runCommand(PALETTE_COMMANDS.RUN, args);
    }

    const showMessage: (message: string, type: MESSAGE_TYPE, isIgnorable: boolean, filePath?: string, fileContent?: string, bypassChecks?: boolean) => Promise<boolean> = props.showMessage;
    const runBackgroundTerminalCommand: (command: string) => Promise<CommandResponse> = props.runBackgroundTerminalCommand;
    const openArchitectureView: (nodeId: string) => Promise<boolean> = props.openArchitectureView;

    const openExternalUrl: (url: string) => Promise<boolean> = props.openExternalUrl;
    return {
        syntaxTree: focusedST,
        fullST: completeST,
        environment: lowCodeEnvInstance,
        stSymbolInfo: getSymbolInfo(),
        currentFile: {
            content: currentFileContent,
            path: focusFile,
            size: 1,
        },
        fileList,
        importStatements: getImportStatements(completeST),
        experimentalEnabled,
        lowCodeResourcesVersion,
        ballerinaVersion: balVersion,
        api: {
            ls: {
                getDiagramEditorLangClient: () => {
                    return langClientPromise;
                },
                getExpressionEditorLangClient: () => {
                    return langClientPromise as any;
                }
            },
            insights: {
                onEvent: (event: LowcodeEvent) => {
                    props.sendTelemetryEvent(event);
                }
            },
            code: {
                modifyDiagram: async (mutations: STModification[], filePath: string, ...args: any) => {
                    const fileToModify = filePath ? filePath : focusFile;
                    const langClient = await langClientPromise;
                    const uri = monaco.Uri.file(fileToModify).toString();
                    const { parseSuccess, source, syntaxTree: newST } = await langClient.stModify({
                        astModifications: await InsertorDelete(mutations),
                        documentIdentifier: {
                            uri
                        }
                    });
                    undoRedoManager.addModification(currentFileContent);
                    let visitedST: STNode;
                    if (parseSuccess) {
                        setUpdateTimestamp(new Date().getTime().toString());
                        props.updateFileContent(fileToModify, source);
                        if (focusFile === fileToModify) {
                            setFileContent(source);
                            visitedST = await getLowcodeST(newST, focusFile, langClient, experimentalEnabled, showMessage);
                            if (stMemberId && stMemberId.length > 0) {
                                const stFindingVisitor = new FindNodeByUidVisitor(stMemberId);
                                traversNode(visitedST, stFindingVisitor);
                                setFocusedST(stFindingVisitor.getNode());
                            }

                            // TODO: add performance data fetching logic here
                            // setFocusedST(stFindingVisitor.getSTNode());
                            setCompleteST(visitedST);
                            if (isDeleteModificationAvailable(mutations)) {
                                showMessage("Undo your changes by using Ctrl + Z or Cmd + Z", MESSAGE_TYPE.INFO, true);
                            }
                            if (newST?.typeData?.diagnostics && newST?.typeData?.diagnostics?.length > 0) {
                                const { isAvailable } = isUnresolvedModulesAvailable(newST?.typeData?.diagnostics as DiagramDiagnostic[]);
                                if (isAvailable) {
                                    const {
                                        parseSuccess: pullSuccess,
                                    } = await resolveMissingDependency(focusFile, source);
                                    if (pullSuccess) {
                                        // Rebuild the file At backend
                                        langClient.didChange({
                                            textDocument: { uri, version: 1 },
                                            contentChanges: [
                                                {
                                                    text: source
                                                }
                                            ],
                                        });
                                        const {
                                            syntaxTree: stWithoutDiagnostics
                                        } = await langClient.getSyntaxTree({ documentIdentifier: { uri } });
                                        visitedST = await getLowcodeST(
                                            stWithoutDiagnostics,
                                            focusFile,
                                            langClient,
                                            experimentalEnabled,
                                            showMessage);
                                        if (stMemberId && stMemberId.length > 0) {
                                            const stFindingVisitor = new FindNodeByUidVisitor(stMemberId);
                                            traversNode(visitedST, stFindingVisitor);
                                            setFocusedST(stFindingVisitor.getNode());
                                        }
                                        setCompleteST(visitedST);
                                    }
                                    // setModulePullInProgress(false);
                                }
                            }
                        }
                    } else {
                        // TODO show error
                    }
                    if (mutations.length > 0) {
                        const event: LowcodeEvent = {
                            type: DIAGRAM_MODIFIED,
                            name: `${mutations[0].type}`
                        };
                        props.sendTelemetryEvent(event);
                    }
                    // TODO: Add perf data
                    // await addPerfData(visitedST);
                },
                gotoSource: (position: { startLine: number; startColumn: number; }, filePath?: string) => {
                    props.gotoSource(filePath && filePath.length > 0 ? filePath : focusFile, position);
                },
                getFunctionDef: async (lineRange: Range, defFilePath?: string) => {
                    const langClient = await langClientPromise;
                    const res: FunctionDef = await getFunctionSyntaxTree(
                        defFilePath ? defFilePath : monaco.Uri.file(focusFile).toString(),
                        lineRange,
                        langClient
                    );
                    return res;
                },
                updateFileContent: (content: string, skipForceSave?: boolean, filePath?: string) => {
                    const fileToModify = filePath ? filePath : focusFile;
                    return props.updateFileContent(fileToModify, content, skipForceSave);
                },
                renameSymbol: async (workspaceEdits: WorkspaceEdit) => {
                    const response = await props.renameSymbol(workspaceEdits);
                    setUpdateTimestamp(new Date().getTime().toString());
                    return response;
                },
            },
            // FIXME Doesn't make sense to take these methods below from outside
            // Move these inside and get an external API for pref persistance
            // against a unique ID (eg AppID) for rerender from prev state
            // panNZoom: {
            //     pan,
            //     fitToScreen,
            //     zoomIn,
            //     zoomOut
            // },
            webView: {
                showTryitView
            },
            project: {
                run
            },
            library: {
                getLibrariesList,
                getLibrariesData,
                getLibraryData
            },
            runBackgroundTerminalCommand,
            openArchitectureView,
            openExternalUrl,
            navigation: {
                updateActiveFile,
                updateSelectedComponent,
                navigateUptoParent
            }
        },
        originalSyntaxTree: undefined,
        langServerURL: "",
        configOverlayFormStatus: undefined,
        configPanelStatus: undefined,
        isCodeEditorActive: false,
        isPerformanceViewOpen: false,
        isLoadingSuccess: false,
        isWaitingOnWorkspace: false,
        isMutationProgress: false,
        isCodeChangeInProgress: false,
        zoomStatus: undefined,
        isReadOnly: false
    };
}

export function extractFilePath(uri: string): string | null {
    let filePath = uri;
    if (uri.startsWith('file://')) {
        const url = new URL(uri);
        filePath = url.pathname;
    }

    if (filePath && filePath.match(/^\/[a-zA-Z]:/g)) {
        filePath = filePath.replace('/', '');
    }

    if (filePath && filePath.match(/^[A-Z]:\//g)) {
        const firstCharacter = filePath.charAt(0).toLowerCase();
        const remaining = filePath.slice(1);
        filePath = `${firstCharacter}${remaining}`;
    }

    return filePath;
}

export function isPathEqual(uri1: string, uri2: string): boolean {
    const filePath1 = extractFilePath(uri1);
    const filePath2 = extractFilePath(uri2);
    return filePath1 === filePath2;
}

export function pathIncludesIn(fullPath: string, includedPath: string): boolean {
    const filePath = extractFilePath(fullPath);
    const includedFilePath = extractFilePath(includedPath);
    return filePath?.includes(includedFilePath as string) as boolean;
}

export function getFileNameFromPath(filePath: string): string {
    const fileName = extractFilePath(filePath).split('/').pop();
    return fileName as string;
}

export function getFormTypeFromST(node: STNode): string {
    if (STKindChecker.isConstDeclaration(node)) {
        return node.kind;
    } else if (STKindChecker.isModuleVarDecl(node)) {
        return node.kind;
    }
    return node.kind;
}

export function generateClientInfo(node: ModuleVarDecl): BallerinaConnectorInfo {
    // TODO: If any issue contact Kanushka
    const newExpressionVisitor = new NewExpressionVisitor();
    traversNode(node, newExpressionVisitor);
    const initializer = newExpressionVisitor.getNewExpressionNode();
    const functions: FunctionDefinitionInfo[] = [];
    return {
        name: initializer?.typeData?.typeSymbol?.members[0]?.name,
        moduleName: initializer?.typeData?.typeSymbol?.members[0]?.moduleID?.moduleName,
        package: {
            organization: initializer?.typeData?.typeSymbol?.members[0]?.moduleID?.orgName,
            name: initializer?.typeData?.typeSymbol?.members[0]?.moduleID?.moduleName,
            version: initializer?.typeData?.typeSymbol?.members[0]?.moduleID?.version
        },
        functions,
    }
}

