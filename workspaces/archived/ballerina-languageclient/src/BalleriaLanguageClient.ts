import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import {
    InitializeParams, InitializeRequest, InitializeResult, ProtocolConnection,
    Trace, DidOpenTextDocumentNotification,
    DidOpenTextDocumentParams, CodeAction, CodeActionParams, TextDocumentItem, InitializedNotification, ShutdownRequest, ExitNotification, PublishDiagnosticsNotification, PublishDiagnosticsParams,
    TextDocumentPositionParams, Location, DocumentSymbol, DocumentSymbolParams, SymbolInformation, DidCloseTextDocumentParams, DidChangeTextDocumentParams, DidChangeTextDocumentNotification, DidCloseTextDocumentNotification, DefinitionParams, LocationLink, RenameParams, WorkspaceEdit
} from 'vscode-languageserver-protocol';

import { BLCTracer } from "./BLCTracer";
import { BLCLogger } from "./BLCLogger";
import { initializeRequest, didOpenTextDocumentParams } from "./messages"
import {
    ASTDidChangeParams,
    ASTDidChangeResponse,
    BallerinaConnectorRequest,
    BallerinaConnectorResponse,
    BallerinaConnectorsRequest,
    BallerinaConnectorsResponse,
    BallerinaExampleListParams,
    BallerinaExampleListResponse,
    BallerinaFunctionSTRequest,
    BallerinaProject,
    BallerinaProjectParams,
    BallerinaRecordRequest,
    BallerinaRecordResponse,
    BallerinaSTModifyRequest,
    BallerinaSTModifyResponse,
    BallerinaTriggerRequest,
    BallerinaTriggerResponse,
    BallerinaTriggersRequest,
    BallerinaTriggersResponse,
    CompletionParams,
    CompletionResponse,
    DocumentIdentifier,
    ExecutorPositionsResponse,
    ExpressionTypeRequest,
    ExpressionTypeResponse,
    EXTENDED_APIS,
    GetASTParams,
    GetASTResponse,
    GetBallerinaProjectParams,
    GetComponentModelRequest,
    GetComponentModelResponse,
    GetPersistERModelRequest,
    GetPersistERModelResponse,
    GetProjectASTParams,
    GetProjectASTResponse,
    GetSyntaxTreeParams,
    GetSyntaxTreeResponse,
    GoToSourceParams,
    GraphqlDesignServiceRequest,
    GraphqlDesignServiceResponse,
    IBallerinaLangClient,
    JsonToRecordRequest,
    JsonToRecordResponse,
    PartialSTRequest,
    PartialSTResponse,
    PerformanceAnalyzerRequest,
    PerformanceAnalyzerResponse,
    RevealRangeParams,
    SymbolInfoRequest, SymbolInfoResponse,
    TriggerModifyRequest,
    TypeFromExpressionRequest,
    TypeFromSymbolRequest,
    TypesFromExpressionResponse,
    TypesFromFnDefinitionRequest,
    TypesFromSymbolResponse,
    XMLToRecordRequest,
    XMLToRecordResponse
} from './IBallerinaLanguageClient';
import { BallerinaASTNode, BallerinaEndpoint, BallerinaSourceFragment } from "./ast-models";
import { LSConnection } from "./LSConnection";

interface BallerinaProjectComponents {
    packages?: any[];
}

interface GetBallerinaPackagesParams {
    documentIdentifiers: DocumentIdentifier[];
}

export class BalleriaLanguageClient implements IBallerinaLangClient {

    private _id: number = 1;
    private _name: string = "ballerina";
    private _lsConnection: LSConnection;
    private _clientConnection: ProtocolConnection;

    private _ready: any = null;
    private _initializedError: any = null;
    private _onReady: Promise<void>;
    private _diagnostics?: PublishDiagnosticsParams;
    private _diagnosticsReceived: Promise<void>;
    private _diagnosticsReady: any = null;
    private _diagnosticsError: any = null;

    // constructor
    public constructor(connection: LSConnection) {
        this._lsConnection = connection;
        this._id = 1;
        this._clientConnection = connection.getProtocolConnection();
        this._clientConnection.trace(Trace.Verbose, new BLCTracer());
        this._clientConnection.listen();
        this._onReady = new Promise((resolve, reject) => {
            this._ready = resolve;
            this._initializedError = reject;
        });
        this._diagnosticsReceived = new Promise((resolve, reject) => {
            this._diagnosticsReady = resolve;
            this._diagnosticsError = reject;
        });
        // Send the initializzation request
        this.initialize();
    }

    public onReady(): Promise<void> {
        return this._onReady;
    }

    private initialize() {
        this._clientConnection.sendRequest(InitializeRequest.type, initializeRequest(this._id)).then((result: InitializeResult) => {
            this._clientConnection.sendNotification(InitializedNotification.type, {});
            this._clientConnection.onNotification(PublishDiagnosticsNotification.type, this.handleDiagnostics);
            this._ready();
        });
    }

    public stop(): Promise<void> {
        // Send the shutdown request
        this._clientConnection.sendRequest(ShutdownRequest.type).then(() => {
            // Send exit notification
            this._clientConnection.sendNotification(ExitNotification.type);
        });

        return this._lsConnection.stop();
    }

    public definition(params: DefinitionParams): Promise<Location | Location[] | LocationLink[]> {
        return this._clientConnection.sendRequest<Location | Location[] | LocationLink[]>("textDocument/definition", params);
    }

    public didOpen(params: DidOpenTextDocumentParams) {
        this._clientConnection.sendNotification(DidOpenTextDocumentNotification.type, params);
    }

    public doOpen(filePath: string) {
        this._clientConnection.sendNotification(DidOpenTextDocumentNotification.type, didOpenTextDocumentParams(filePath));
    }

    public didClose(params: DidCloseTextDocumentParams) {
        this._clientConnection.sendNotification(DidCloseTextDocumentNotification.type, params);
    }

    public didChange(params: DidChangeTextDocumentParams) {
        this._clientConnection.sendNotification(DidChangeTextDocumentNotification.type, params);
    }

    private handleDiagnostics(diagnostics: PublishDiagnosticsParams) {
        this._diagnostics = diagnostics
    }

    public getDiagnostics(params: BallerinaProjectParams): Promise<PublishDiagnosticsParams[]> {
        return this._clientConnection.sendRequest<PublishDiagnosticsParams[]>(EXTENDED_APIS.DOCUMENT_DIAGNOSTICS, params);
    }

    public getSyntaxTree(params: GetSyntaxTreeParams): Thenable<GetSyntaxTreeResponse> {
        return this._clientConnection.sendRequest<GetSyntaxTreeResponse>("ballerinaDocument/syntaxTree", params);
    }

    public getProjectAST(params: GetProjectASTParams): Thenable<GetProjectASTResponse> {
        return this._clientConnection.sendRequest<GetProjectASTResponse>("ballerinaProject/modules", params);
    }

    public getAST(params: GetASTParams): Thenable<GetASTResponse> {
        return this._clientConnection.sendRequest<GetASTResponse>("ballerinaDocument/ast", params);
    }

    public astDidChange(params: ASTDidChangeParams): Thenable<ASTDidChangeResponse> {
        return this._clientConnection.sendRequest("ballerinaDocument/astDidChange", params);
    }

    public fetchExamples(params: BallerinaExampleListParams = {}): Thenable<BallerinaExampleListResponse> {
        return this._clientConnection.sendRequest("ballerinaExample/list", params);
    }

    public parseFragment(params: BallerinaSourceFragment): Thenable<BallerinaASTNode> {
        return this._clientConnection.sendRequest("ballerinaFragment/ast", params).then((resp: any) => resp.ast);
    }

    public getEndpoints(): Thenable<BallerinaEndpoint[]> {
        return this._clientConnection.sendRequest("ballerinaSymbol/endpoints", {})
            .then((resp: any) => resp.endpoints);
    }

    public getBallerinaProject(params: GetBallerinaProjectParams): Thenable<BallerinaProject> {
        return this._clientConnection.sendRequest("ballerinaDocument/project", params);
    }

    public getDefinitionPosition(params: TextDocumentPositionParams): Thenable<BallerinaSTModifyResponse> {
        return this._clientConnection.sendRequest<BallerinaSTModifyResponse>("ballerinaDocument/syntaxTreeNodeByPosition", params);
    }

    public goToSource(params: GoToSourceParams): void {
        // TODO
    }

    public revealRange(params: RevealRangeParams): void {
        // TODO
    }

    public getRecord(params: BallerinaRecordRequest): Thenable<BallerinaRecordResponse> {
        return this._clientConnection.sendRequest<BallerinaRecordResponse>("ballerinaConnector/record", params);
    }


    public getConnectors(params: BallerinaConnectorsRequest): Thenable<BallerinaConnectorsResponse> {
        return this._clientConnection.sendRequest<BallerinaConnectorsResponse>("ballerinaConnector/connectors", params);
    }

    public getConnector(params: BallerinaConnectorRequest): Thenable<BallerinaConnectorResponse> {
        return this._clientConnection.sendRequest<BallerinaConnectorResponse>("ballerinaConnector/connector", params);
    }

    public getCompletion(params: CompletionParams): Thenable<CompletionResponse[]> {
        return this._clientConnection.sendRequest<CompletionResponse[]>("textDocument/completion", params);
    }

    public getType(params: ExpressionTypeRequest): Thenable<ExpressionTypeResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.SYMBOL_TYPE, params);
    }

    public getSTForSingleStatement(params: PartialSTRequest): Thenable<PartialSTResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PARTIAL_PARSE_SINGLE_STATEMENT, params);
    }

    public getSTForExpression(params: PartialSTRequest): Thenable<PartialSTResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PARTIAL_PARSE_EXPRESSION, params);
    }

    public getSTForModuleMembers(params: PartialSTRequest): Thenable<PartialSTResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PARTIAL_PARSE_MODULE_MEMBER, params);
    }

    public getSTForModulePart(params: PartialSTRequest): Thenable<PartialSTResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PARTIAL_PARSE_MODULE_PART, params);
    }

    public getSTForResource(params: PartialSTRequest): Thenable<PartialSTResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PARTIAL_PARSE_RESOURCE, params);
    }

    public getTriggers(params: BallerinaTriggersRequest): Thenable<BallerinaTriggersResponse> {
        return this._clientConnection.sendRequest<BallerinaTriggersResponse>(EXTENDED_APIS.TRIGGER_TRIGGERS, params);
    }

    public getTrigger(params: BallerinaTriggerRequest): Thenable<BallerinaTriggerResponse> {
        return this._clientConnection.sendRequest<BallerinaTriggerResponse>(EXTENDED_APIS.TRIGGER_TRIGGER, params);
    }

    public stModify(params: BallerinaSTModifyRequest): Thenable<BallerinaSTModifyResponse> {
        return this._clientConnection.sendRequest<BallerinaSTModifyResponse>(EXTENDED_APIS.DOCUMENT_ST_MODIFY, params);
    }

    public triggerModify(params: TriggerModifyRequest): Thenable<BallerinaSTModifyResponse> {
        return this._clientConnection.sendRequest<BallerinaSTModifyResponse>(EXTENDED_APIS.DOCUMENT_TRIGGER_MODIFY, params);
    }

    public getDocumentSymbol(params: DocumentSymbolParams): Thenable<DocumentSymbol[] | SymbolInformation[]> {
        return this._clientConnection.sendRequest("textDocument/documentSymbol", params);
    }

    public getPerfEndpoints(params: PerformanceAnalyzerRequest): Thenable<PerformanceAnalyzerResponse[]> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PERF_ANALYZER_ENDPOINTS, params);
    }

    public resolveMissingDependencies(params: GetSyntaxTreeParams): Thenable<GetSyntaxTreeResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.RESOLVE_MISSING_DEPENDENCIES, params);
    }

    public getExecutorPositions(params: GetBallerinaProjectParams): Thenable<ExecutorPositionsResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.DOCUMENT_EXECUTOR_POSITIONS, params);
    }

    public convert(params: JsonToRecordRequest): Thenable<JsonToRecordResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.JSON_TO_RECORD_CONVERT, params);
    }

    public convertXml(params: XMLToRecordRequest): Thenable<XMLToRecordResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.XML_TO_RECORD_CONVERT, params);
    }

    public getSTForFunction(params: BallerinaFunctionSTRequest): Thenable<BallerinaSTModifyResponse> {
        return this._clientConnection.sendRequest<BallerinaSTModifyResponse>(EXTENDED_APIS.DOCUMENT_ST_FUNCTION_FIND, params);
    }

    public getSymbolDocumentation(params: SymbolInfoRequest): Thenable<SymbolInfoResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.SYMBOL_DOC, params);
    }

    public codeAction(params: CodeActionParams): Promise<CodeAction[]> {
        return this._clientConnection.sendRequest("textDocument/codeAction", params);
    }

    public getTypeFromExpression(params: TypeFromExpressionRequest): Thenable<TypesFromExpressionResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.SYMBOL_GET_TYPE_FROM_EXPRESSION, params);
    }

    public getTypeFromSymbol(params: TypeFromSymbolRequest): Thenable<TypesFromSymbolResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.SYMBOL_GET_TYPE_FROM_SYMBOL, params);
    }

    public getTypesFromFnDefinition(params: TypesFromFnDefinitionRequest): Thenable<TypesFromSymbolResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.SYMBOL_GET_TYPES_FROM_FN_DEFINITION, params);
    }

    public rename(params: RenameParams): Promise<WorkspaceEdit> {
        return this._clientConnection.sendRequest("textDocument/rename", params);
    }

    public getBallerinaProjectComponents(params: GetBallerinaPackagesParams): Promise<BallerinaProjectComponents> {
        return this._clientConnection.sendRequest("ballerinaPackage/components", params);
    }

    public getGraphqlModel(params: GraphqlDesignServiceRequest): Thenable<GraphqlDesignServiceResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.GRAPHQL_DESIGN_MODEL, params);
    }

    public getPackageComponentModels(params: GetComponentModelRequest): Promise<GetComponentModelResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.COMPONENT_MODEL_ENDPOINT, params);
    }

    public getPersistERModel(params: GetPersistERModelRequest): Promise<GetPersistERModelResponse> {
        return this._clientConnection.sendRequest(EXTENDED_APIS.PERSIST_MODEL_ENDPOINT, params);
    }
}
