// tslint:disable-next-line:no-submodule-imports
import { IConnection } from "monaco-languageclient/lib/connection";
import { InitializeParams, InitializeResult,
    Location, TextDocumentPositionParams } from "vscode-languageserver-protocol";
import {
    BallerinaTriggerRequest,
    BallerinaTriggerResponse,
    BallerinaTriggersRequest,
    BallerinaTriggersResponse,
    SymbolInfoRequest,
    SymbolInfoResponse,
    TypeFromExpressionRequest,
    TypeFromSymbolRequest,
    TypesFromExpressionResponse,
    TypesFromFnDefinitionRequest,
    TypesFromSymbolResponse,
} from ".";

import { BallerinaASTNode, BallerinaEndpoint, BallerinaSourceFragment } from "./ast-models";
import { ASTDidChangeParams, ASTDidChangeResponse, BallerinaConnectorRequest, BallerinaConnectorResponse, BallerinaConnectorsRequest, BallerinaConnectorsResponse, BallerinaExampleListParams,
    BallerinaExampleListResponse, BallerinaProject, BallerinaRecordRequest, BallerinaRecordResponse, DidOpenParams, GetASTParams, GetASTResponse,
    GetBallerinaProjectParams, GetProjectASTParams, GetProjectASTResponse, GetSyntaxTreeParams,
    GetSyntaxTreeResponse, GoToSourceParams, IBallerinaLangClient, RevealRangeParams } from "./model";

export class BallerinaLangClient implements IBallerinaLangClient {

    constructor(
        public lsConnection: IConnection) {
    }

    public init(params: InitializeParams = initParams): Thenable<InitializeResult> {
        this.lsConnection.listen();
        return this.lsConnection.initialize(params)
                .then((resp) => {
                    return resp;
                }) as Thenable<InitializeResult>;
    }

    public didOpen(params: DidOpenParams) {
        this.lsConnection.sendNotification("textDocument/didOpen", params);
    }

    public getSyntaxTree(params: GetSyntaxTreeParams): Thenable<GetSyntaxTreeResponse> {
        return this.lsConnection.sendRequest<GetSyntaxTreeResponse>("ballerinaDocument/syntaxTree", params);
    }

    public getProjectAST(params: GetProjectASTParams): Thenable<GetProjectASTResponse> {
        return this.lsConnection.sendRequest<GetProjectASTResponse>("ballerinaProject/modules", params);
    }

    public getAST(params: GetASTParams): Thenable<GetASTResponse> {
        return this.lsConnection.sendRequest<GetASTResponse>("ballerinaDocument/ast", params);
    }

    public astDidChange(params: ASTDidChangeParams): Thenable<ASTDidChangeResponse> {
        return this.lsConnection.sendRequest("ballerinaDocument/astDidChange", params);
    }

    public fetchExamples(params: BallerinaExampleListParams = {}): Thenable<BallerinaExampleListResponse> {
        return this.lsConnection.sendRequest("ballerinaExample/list", params);
    }

    public parseFragment(params: BallerinaSourceFragment): Thenable<BallerinaASTNode> {
        return this.lsConnection.sendRequest("ballerinaFragment/ast", params).then((resp: any) => resp.ast);
    }

    public getEndpoints(): Thenable<BallerinaEndpoint[]> {
        return this.lsConnection.sendRequest("ballerinaSymbol/endpoints", {})
                    .then((resp: any) => resp.endpoints);
    }

    public getBallerinaProject(params: GetBallerinaProjectParams): Thenable<BallerinaProject> {
        return this.lsConnection.sendRequest("ballerinaDocument/project", params);
    }

    public getDefinitionPosition(params: TextDocumentPositionParams): Thenable<Location> {
        // TODO
        return Promise.reject("Not implemented");
    }

    public goToSource(params: GoToSourceParams): void {
       // TODO
    }

    public revealRange(params: RevealRangeParams): void {
        // TODO
    }

    public getRecord(params: BallerinaRecordRequest): Thenable<BallerinaRecordResponse> {
        return this.lsConnection.sendRequest<BallerinaRecordResponse>("ballerinaConnector/record", params);
    }


    public getConnectors(params: BallerinaConnectorsRequest): Thenable<BallerinaConnectorsResponse> {
        return this.lsConnection.sendRequest<BallerinaConnectorsResponse>("ballerinaConnector/connectors");
    }

    public getTriggers(params: BallerinaTriggersRequest): Thenable<BallerinaTriggersResponse> {
        return this.lsConnection.sendRequest<BallerinaTriggersResponse>("ballerinaTrigger/triggers");
    }

    public getConnector(params: BallerinaConnectorRequest): Thenable<BallerinaConnectorResponse> {
        return this.lsConnection.sendRequest<BallerinaConnectorResponse>("ballerinaConnector/connector", params);
    }

    public getTrigger(params: BallerinaTriggerRequest): Thenable<BallerinaTriggerResponse> {
        return this.lsConnection.sendRequest<BallerinaTriggerResponse>("ballerinaTrigger/trigger", params);
    }

    public close(): void {
        this.lsConnection.shutdown();
    }

    public getSymbolDocumentation(params: SymbolInfoRequest): Thenable<SymbolInfoResponse> {
        return this.lsConnection.sendRequest("ballerinaSymbol/getSymbol", params)
    }

    public getTypeFromExpression(params: TypeFromExpressionRequest): Thenable<TypesFromExpressionResponse> {
        return this.lsConnection.sendRequest("ballerinaSymbol/getTypeFromExpression", params)
    }

    public getTypeFromSymbol(params: TypeFromSymbolRequest): Thenable<TypesFromSymbolResponse> {
        return this.lsConnection.sendRequest("ballerinaSymbol/getTypeFromSymbol", params)
    }

    public getTypesFromFnDefinition(params: TypesFromFnDefinitionRequest): Thenable<TypesFromSymbolResponse> {
        return this.lsConnection.sendRequest("ballerinaSymbol/getTypesFromFnDefinition", params)
    }
}

export const initParams: InitializeParams = {
    capabilities: {
    },
    processId: process.pid,
    rootUri: null,
    workspaceFolders: null,
};
