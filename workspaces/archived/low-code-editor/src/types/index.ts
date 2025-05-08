/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// TODO Refactor this file.
// Should move these to ../Definitions/*

import { BlockViewState } from "@wso2-enterprise/ballerina-low-code-diagram";
import {
    BallerinaConnectorInfo,
    CommandResponse,
    ConditionConfig,
    ConfigOverlayFormStatus,
    ConfigPanelStatus,
    Connector,
    CurrentFile,
    DiagramEditorLangClientInterface,
    ExpressionEditorLangClientInterface,
    FileListEntry,
    FunctionDef,
    LibraryDataResponse,
    LibraryDocResponse,
    LibrarySearchResponse,
    STModification,
    STSymbolInfo,
    WizardType
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ModulePart, NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import { Diagnostic, WorkspaceEdit } from "vscode-languageserver-protocol";

import { Warning } from "../Diagram/utils/st-util";
import { ComponentViewInfo } from "../OverviewDiagram/util";

export interface ZoomStatus {
    scale: number,
    panX: number,
    panY: number,
}

export interface UserState {
    selectedOrgHandle: string;
    user: {
        email: string;
    }
}

export interface LowCodeEditorState {
    triggerUpdated: boolean; // FIXME Moving existing prop manipulated in memory into state
    isConfigOverlayFormOpen: boolean;
    targetPosition: NodePosition; // FIXME check and remove usage of update position if not used anymore
    currentFunctionNode?: STNode;
    experimentalEnabled?: boolean;
}

export interface LowCodeEditorActions {
    updateState: (payload: LowCodeEditorState) => void;
    diagramCleanDraw: (payload: STNode) => void;
    diagramRedraw: (payload: STNode) => void;
    insertComponentStart: (payload: NodePosition) => void;
    editorComponentStart: (payload: NodePosition) => void;
    toggleDiagramOverlay: () => void;
    setTriggerUpdated: (isUpdated: boolean) => void;
}

export interface LowCodeEditorAPI {
    helpPanel?: {
        openConnectorHelp: (connector?: Partial<Connector>, method?: string) => void;
    }
    notifications?: {
        triggerErrorNotification?: (msg: Error | string) => void;
        triggerSuccessNotification?: (msg: Error | string) => void;
    }
    ls: {
        getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
        getExpressionEditorLangClient?: () => Promise<ExpressionEditorLangClientInterface>;
    }
    // This has to come from Lang-server
    insights: {
        onEvent?: (event: any) => void;
    }
    code: {
        modifyDiagram: (mutations: STModification[], filePath?: string, options?: any) => Promise<void>;
        onMutate?: (type: string, options: any) => void;
        // Reuse go-to-def from LangServer?
        setCodeLocationToHighlight?: (position: NodePosition) => void;
        gotoSource: (position: { startLine: number, startColumn: number }, filePath?: string) => void;
        getFunctionDef: (lineRange: Range, defFilePath: string) => Promise<FunctionDef>;
        updateFileContent: (content: string, skipForceSave?: boolean, filePath?: string) => Promise<boolean>;
        renameSymbol?: (workspaceEdits: WorkspaceEdit) => Promise<boolean>;
        // isMutationInProgress: boolean;
        // isModulePullInProgress: boolean;
        // loaderText: string;
        // undo: () => Promise<void>;
    }
    // FIXME Doesn't make sense to take these methods below from outside
    // Move these inside and get an external API for pref persistance
    // against a unique ID (eg AppID) for rerender from prev state
    panNZoom?: {
        pan: (panX: number, panY: number) => void;
        fitToScreen: () => void;
        zoomIn: () => void;
        zoomOut: () => void;
    };
    configPanel?: {
        dispactchConfigOverlayForm: (
            type: string, targetPosition: NodePosition,
            wizardType: WizardType, blockViewState?: BlockViewState, config?: ConditionConfig,
            symbolInfo?: STSymbolInfo, model?: STNode) => void;
        closeConfigOverlayForm: () => void;
        configOverlayFormPrepareStart: () => void;
        closeConfigPanel: () => void;
    }
    webView: {
        showTryitView: (serviceName: string) => void;
    }
    project: {
        run: (args: any[]) => void;
    }
    library?: {
        getLibrariesList: (kind?: string) => Promise<LibraryDocResponse>;
        getLibrariesData: () => Promise<LibrarySearchResponse>;
        getLibraryData: (orgName: string, moduleName: string, version: string) => Promise<LibraryDataResponse>;
    };
    runBackgroundTerminalCommand?: (command: string) => Promise<CommandResponse>;
    openArchitectureView?: (nodeId: string) => Promise<boolean>;
    openExternalUrl?: (url: string) => Promise<boolean>;
    navigation: {
        updateActiveFile: (currentFile: FileListEntry) => void;
        updateSelectedComponent: (info: ComponentViewInfo) => void;
        navigateUptoParent: (position: NodePosition) => void;
    }
}

// FIXME Some of these props should be moved to low code state
// and need to avoid getting from outside
export interface LowCodeEditorProperties {
    userInfo?: UserState;
    currentFile: CurrentFile;
    fileList: FileListEntry[];
    syntaxTree: STNode;
    fullST: STNode;
    originalSyntaxTree: ModulePart;
    stSymbolInfo: STSymbolInfo;
    connectors?: BallerinaConnectorInfo[];
    diagnostics?: Diagnostic[];
    warnings?: Warning[];
    error?: Error;
    langServerURL: string;
    configOverlayFormStatus: ConfigOverlayFormStatus;
    configPanelStatus: ConfigPanelStatus;
    isConfigPanelOpen?: boolean;
    isCodeEditorActive: boolean;
    isLoadingAST?: boolean;
    isPerformanceViewOpen: boolean;
    isLoadingSuccess: boolean;
    isWaitingOnWorkspace: boolean;
    isMutationProgress: boolean;
    isCodeChangeInProgress: boolean;
    isReadOnly: boolean;
    zoomStatus: ZoomStatus;
    selectedPosition?: SelectedPosition;
    importStatements: string[];
    experimentalEnabled?: boolean;
    lowCodeResourcesVersion?: string;
    ballerinaVersion?: string;
    environment?: string;
    isCodeServerInstance?: boolean;
    openInDiagram?: NodePosition;
}

export interface SelectedPosition {
    startLine: number;
    startColumn: number;
}

export interface LowCodeEditorContext {
    state: LowCodeEditorState;
    actions: LowCodeEditorActions;
    api: LowCodeEditorAPI;
    props: LowCodeEditorProperties;
}

export interface LowCodeEditorProps extends LowCodeEditorProperties {
    api: LowCodeEditorAPI;
}

export enum MESSAGE_TYPE {
    ERROR,
    WARNING,
    INFO
}
