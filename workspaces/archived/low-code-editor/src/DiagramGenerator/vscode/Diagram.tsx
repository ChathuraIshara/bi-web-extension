import * as React from "react";

import { ANALYZE_TYPE, CommandResponse, DiagramEditorLangClientInterface, GetSyntaxTreeResponse, LibraryDataResponse, LibraryDocResponse, LibraryKind, LibrarySearchResponse, LowcodeEvent, SentryConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { WorkspaceEdit } from "vscode-languageserver-protocol";

import { LowCodeDiagramGenerator, OverviewDiagramGenerator } from "..";
import { DiagramGenErrorBoundary } from "../ErrorBoundrary";
import { PerformanceAnalyzerAdvancedResponse, PerformanceAnalyzerRealtimeResponse } from "../performanceUtil";

import './style.scss';

export interface Uri {
    fsPath: string
    external: string
    path: string;
    sheme: string;
}

// TODO: check if there is a way to take this from the vscode dependency
export interface WorkspaceFolder {
    readonly uri: Uri;
    readonly name: string;
    readonly index: number;
}

export interface FileListEntry {
    fileName: string;
    uri: Uri;
}

export interface DiagramFocus {
    filePath: string;
    position?: NodePosition;
}

export interface EditorState {
    filePath: string;
    projectPaths: WorkspaceFolder[],
    langClientPromise: Promise<DiagramEditorLangClientInterface>;
    startColumn: number; // TODO: remove
    startLine: number; // TODO: remove
    lastUpdatedAt: string;
    experimentalEnabled?: boolean;
    openInDiagram: NodePosition;
    diagramFocus: DiagramFocus;
    workspaceName: string;
}

export interface PFSession {
    choreoAPI: string,
    choreoToken: string | undefined,
    choreoCookie?: string | undefined
}

export interface EditorAPI {
    getFileContent: (url: string) => Promise<string>;
    updateFileContent: (filePath: string, content: string, skipForceSave?: boolean) => Promise<boolean>;
    gotoSource: (filePath: string, position: { startLine: number, startColumn: number }) => Promise<boolean>;
    showPerformanceGraph: () => Promise<boolean>;
    getAllFiles?: (regex?: string, ignoreGlob?: string) => Promise<Uri[]>; // TODO: make this not optional, added to get rid of test failures
    // TODO: move to a seperate interface
    getPerfDataFromChoreo: (data: any, analyzeType: ANALYZE_TYPE) => Promise<PerformanceAnalyzerRealtimeResponse | PerformanceAnalyzerAdvancedResponse | undefined>;
    showMessage: () => Promise<boolean>;
    resolveMissingDependency: (filePath: string, fileContent: string) => Promise<GetSyntaxTreeResponse>;
    resolveMissingDependencyByCodeAction: (filePath: string, fileContent: string, diagnostic: any) => Promise<boolean>;
    runCommand: (command: PALETTE_COMMANDS, args: any[]) => Promise<boolean>;
    runBackgroundTerminalCommand?: (command: string) => Promise<CommandResponse>;
    openArchitectureView?: (nodeId: string) => Promise<boolean>;
    sendTelemetryEvent: (event: LowcodeEvent) => Promise<void>;
    getLibrariesList: (kind?: LibraryKind) => Promise<LibraryDocResponse | undefined>;
    getLibrariesData: () => Promise<LibrarySearchResponse | undefined>;
    getLibraryData: (orgName: string, moduleName: string, version: string) => Promise<LibraryDataResponse | undefined>;
    getSentryConfig: () => Promise<SentryConfig | undefined>;
    getBallerinaVersion: () => Promise<string | undefined>;
    getEnv: (name: string) => Promise<any>;
    openExternalUrl: (url: string) => Promise<boolean>;
    renameSymbol: (workspaceEdits: WorkspaceEdit) => Promise<boolean>;
}

export enum PALETTE_COMMANDS {
    RUN = 'ballerina.project.run',
    TRY_IT = 'ballerina.tryit'
}

export type EditorProps = EditorState & EditorAPI;

export const WorkspaceOverview: React.FC<EditorProps> = (props: EditorProps) => {
    return (
        <DiagramGenErrorBoundary lastUpdatedAt={props.lastUpdatedAt}>
            <OverviewDiagramGenerator
                {...props}
            />
        </DiagramGenErrorBoundary>
    )
}

export const Diagram: React.FC<EditorProps> = (props: EditorProps) => {

    const { getFileContent, updateFileContent, gotoSource, showPerformanceGraph, getPerfDataFromChoreo,
            sendTelemetryEvent, getSentryConfig, getBallerinaVersion,
            showMessage, resolveMissingDependency, resolveMissingDependencyByCodeAction,
            runCommand, runBackgroundTerminalCommand, openArchitectureView, getLibrariesList, getLibrariesData, getLibraryData, getEnv, openExternalUrl, renameSymbol, ...restProps } = props;
    const [state, setState] = React.useState<EditorState>(restProps);

    React.useEffect(() => {
        setState(restProps);
    }, [restProps.lastUpdatedAt]);

    return (
        <div className="lowcode-main-wrapper">
            <DiagramGenErrorBoundary lastUpdatedAt={restProps.lastUpdatedAt}>
                <LowCodeDiagramGenerator
                    {...state}
                    getFileContent={getFileContent}
                    updateFileContent={updateFileContent}
                    gotoSource={gotoSource}
                    showPerformanceGraph={showPerformanceGraph}
                    getPerfDataFromChoreo={getPerfDataFromChoreo}
                    showMessage={showMessage}
                    resolveMissingDependency={resolveMissingDependency}
                    resolveMissingDependencyByCodeAction={resolveMissingDependencyByCodeAction}
                    runCommand={runCommand}
                    runBackgroundTerminalCommand={runBackgroundTerminalCommand}
                    openArchitectureView={openArchitectureView}
                    sendTelemetryEvent={sendTelemetryEvent}
                    getLibrariesList={getLibrariesList}
                    getLibrariesData={getLibrariesData}
                    getLibraryData={getLibraryData}
                    getSentryConfig={getSentryConfig}
                    getBallerinaVersion={getBallerinaVersion}
                    getEnv={getEnv}
                    openExternalUrl={openExternalUrl}
                    renameSymbol={renameSymbol}
                    panX="-30"
                    panY="0"
                    scale="0.9"
                />
            </DiagramGenErrorBoundary>
        </div>
    );
}
