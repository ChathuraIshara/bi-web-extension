import { STNode } from "@wso2-enterprise/syntax-tree";
import {
    CodeAction,
    CodeActionParams,
    DefinitionParams,
    DidChangeTextDocumentParams,
    DidCloseTextDocumentParams,
    DidOpenTextDocumentParams,
    DocumentSymbol,
    DocumentSymbolParams,
    Location, LocationLink, Position,
    PublishDiagnosticsParams,
    Range, SymbolInformation, TextDocumentPositionParams, WorkspaceEdit, RenameParams
} from "vscode-languageserver-protocol";

import {
    BallerinaAST, BallerinaASTNode, BallerinaEndpoint,
    BallerinaSourceFragment
} from "./ast-models";
import { ComponentModel, CMDiagnostics } from "./IComponentModel";

export enum EXTENDED_APIS {
    DOCUMENT_ST_NODE = 'ballerinaDocument/syntaxTreeNode',
    DOCUMENT_EXECUTOR_POSITIONS = 'ballerinaDocument/executorPositions',
    DOCUMENT_ST_MODIFY = 'ballerinaDocument/syntaxTreeModify',
    DOCUMENT_DIAGNOSTICS = 'ballerinaDocument/diagnostics',
    DOCUMENT_ST = 'ballerinaDocument/syntaxTree',
    DOCUMENT_AST_MODIFY = 'ballerinaDocument/astModify',
    DOCUMENT_TRIGGER_MODIFY = 'ballerinaDocument/triggerModify',
    DOCUMENT_ST_FUNCTION_FIND = 'ballerinaDocument/syntaxTreeByName',
    SYMBOL_TYPE = 'ballerinaSymbol/type',
    CONNECTOR_CONNECTORS = 'ballerinaConnector/connectors',
    TRIGGER_TRIGGERS = 'ballerinaTrigger/triggers',
    TRIGGER_TRIGGER = 'ballerinaTrigger/trigger',
    CONNECTOR_CONNECTOR = 'ballerinaConnector/connector',
    CONNECTOR_RECORD = 'ballerinaConnector/record',
    PACKAGE_COMPONENTS = 'ballerinaPackage/components',
    PACKAGE_METADATA = 'ballerinaPackage/metadata',
    PACKAGE_CONFIG_SCHEMA = 'ballerinaPackage/configSchema',
    JSON_TO_RECORD_CONVERT = 'jsonToRecord/convert',
    XML_TO_RECORD_CONVERT = 'xmlToRecord/convert',
    PARTIAL_PARSE_SINGLE_STATEMENT = 'partialParser/getSTForSingleStatement',
    PARTIAL_PARSE_EXPRESSION = 'partialParser/getSTForExpression',
    PARTIAL_PARSE_MODULE_MEMBER = 'partialParser/getSTForModuleMembers',
    PARTIAL_PARSE_MODULE_PART = 'partialParser/getSTForModulePart',
    PARTIAL_PARSE_RESOURCE = 'partialParser/getSTForResource',
    EXAMPLE_LIST = 'ballerinaExample/list',
    PERF_ANALYZER_ENDPOINTS = 'performanceAnalyzer/getResourcesWithEndpoints',
    RESOLVE_MISSING_DEPENDENCIES = 'ballerinaDocument/resolveMissingDependencies',
    BALLERINA_TO_OPENAPI = 'openAPILSExtension/generateOpenAPI',
    SYMBOL_DOC = 'ballerinaSymbol/getSymbol',
    SYMBOL_GET_TYPE_FROM_EXPRESSION = 'ballerinaSymbol/getTypeFromExpression',
    SYMBOL_GET_TYPE_FROM_SYMBOL = 'ballerinaSymbol/getTypeFromSymbol',
    SYMBOL_GET_TYPES_FROM_FN_DEFINITION = 'ballerinaSymbol/getTypesFromFnDefinition',
    GRAPHQL_DESIGN_MODEL = 'graphqlDesignService/getGraphqlModel',
    COMPONENT_MODEL_ENDPOINT = 'projectDesignService/getProjectComponentModels',
    PERSIST_MODEL_ENDPOINT = 'persistERGeneratorService/getPersistERModels'
}

export enum DIAGNOSTIC_SEVERITY {
    INTERNAL = "INTERNAL",
    HINT = "HINT",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export interface GetProjectASTParams {
    sourceRoot: string;
}

export interface GetProjectASTResponse {
    modules: ProjectAST;
    parseSuccess: boolean;
}

export interface ProjectAST {
    [moduleName: string]: {
        name: string,
        compilationUnits: {
            [compilationUnitName: string]: {
                name: string,
                ast: BallerinaAST,
                uri: string,
            }
        }
    };
}

export interface GetASTParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetASTResponse {
    ast: BallerinaAST;
    parseSuccess: boolean;
}

export interface ASTDidChangeResponse {
    content?: string;
}

export interface ASTDidChangeParams {
    textDocumentIdentifier: {
        uri: string;
    };
    ast: BallerinaAST;
}

export interface GoToSourceParams {
    textDocumentIdentifier: {
        uri: string;
    };
    position: Position;
}

export interface RevealRangeParams {
    textDocumentIdentifier: {
        uri: string;
    };
    range: Range;
}

export interface BallerinaExample {
    title: string;
    url: string;
}

export interface BallerinaExampleCategory {
    title: string;
    column: number;
    samples: BallerinaExample[];
}

export interface BallerinaExampleListParams {
    filter?: string;
}

export interface BallerinaExampleListResponse {
    samples: BallerinaExampleCategory[];
}

export interface BallerinaProject {
    path?: string;
    version?: string;
    author?: string;
}

export interface GetBallerinaProjectParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeResponse {
    syntaxTree: any;
    parseSuccess: boolean;
}


interface BallerinaProjectComponents {
    packages?: any[];
}

interface GetBallerinaPackagesParams {
    documentIdentifiers: DocumentIdentifier[];
}

export interface BallerinaRecordResponse {
    org: string;
    module: string;
    version: string;
    name: string;
    ast?: STNode;
    error?: any;
}

export interface VisibleEndpoint {
    kind?: string;
    isCaller: boolean;
    isExternal: boolean;
    isModuleVar: boolean;
    moduleName: string;
    name: string;
    packageName: string;
    orgName: string;
    version: string;
    typeName: string;
    position: NodePosition;
    viewState?: any;
    isParameter?: boolean;
    isClassField?: boolean;
}
export interface NodePosition {
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
}

export interface BallerinaRecordRequest {
    org: string;
    module: string;
    version: string;
    name: string;
}

export interface FormField {
    typeName: string;
    name?: string;
    label?: string;
    displayName?: string;
    collectionDataType?: FormField;
    paramType?: FormField;
    selectedDataType?: string;
    description?: string;
    defaultValue?: any;
    value?: any;
    optional?: boolean;
    fields?: FormField[];
    members?: FormField[];
    references?: FormField[];
    isReturn?: boolean;
    isArray?: boolean;
    isTypeDef?: boolean;
    isReference?: boolean;
    isStream?: boolean;
    hide?: boolean;
    aiSuggestion?: string;
    noCodeGen?: boolean;
    requestName?: string; // only for http form used when there's a request object in the request
    tooltip?: string;
    tooltipActionLink?: string;
    tooltipActionText?: string;
    isErrorType?: boolean;
    isDefaultableParam?: boolean;
    isRestParam?: boolean;
    customAutoComplete?: string[];
    validationRegex?: any;
}

export interface PathParam {
    name: string;
    typeName: string;
    isRestType: boolean;
}

export interface FunctionDefinitionInfo {
    name: string;
    documentation: string;
    parameters: FormField[];
    pathParams?: PathParam[];
    returnType?: FormField;
    qualifiers?: string[];
    isRemote?: boolean;
    displayAnnotation?: any;
}

export interface BallerinaConnectorInfo extends Connector {
    functions: FunctionDefinitionInfo[];
    documentation?: string;
}

export interface BallerinaConnectorsRequest {
    query: string;
    packageName?: string;
    organization?: string;
    connector?: string;
    description?: string;
    template?: string;
    keyword?: string;
    ballerinaVersion?: string;
    platform?: boolean;
    userPackages?: boolean;
    limit?: number;
    offset?: number;
    sort?: string;
    targetFile?: string;
}
export interface BallerinaConnectorsResponse {
    central: Connector[];
    local?: Connector[];
    error?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface BallerinaConnectorRequest extends Connector {
}

export interface BallerinaConnectorResponse extends BallerinaConnectorInfo {
    error?: string;
}
export interface Package {
    organization: string;
    name: string;
    version: string;
    platform?: string;
    languageSpecificationVersion?: string;
    URL?: string;
    balaURL?: string;
    balaVersion?: string;
    digest?: string;
    summary?: string;
    readme?: string;
    template?: boolean;
    licenses?: any[];
    authors?: any[];
    sourceCodeLocation?: string;
    keywords?: any[];
    ballerinaVersion?: string;
    icon?: string;
    pullCount?: number;
    createdDate?: number;
    modules?: any[];
}

export interface Connector {
    id?: string;
    name: string;
    displayName?: string;
    moduleName?: string;
    package: Package;
    displayAnnotation?: DisplayAnnotation;
}

export interface BallerinaProjectParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface CompletionParams {
    textDocument: {
        uri: string;
    };
    position: {
        character: number;
        line: number;
    };
    context: {
        triggerKind: number;
    };
}


export interface CompletionResponse {
    detail: string;
    insertText: string;
    insertTextFormat: number;
    kind: number;
    label: string;
    additionalTextEdits?: TextEdit[];
    documentation?: string;
    sortText?: string;
    filterText?: string;
}

export interface TextEdit {
    newText: string,
    range: {
        end: {
            character: number;
            line: number;
        },
        start: {
            character: number;
            line: number;
        }
    }
}

export interface LinePosition {
    line: number;
    offset: number;
}

export interface ExpressionTypeRequest {
    documentIdentifier: { uri: string; };
    // tslint:disable-next-line: align
    position: LinePosition;
}

export interface ExpressionTypeResponse {
    documentIdentifier: { uri: string; };
    // tslint:disable-next-line: align
    types: string[];
}

export interface PartialSTRequest {
    codeSnippet: string;
    stModification?: PartialSTModification;
}

export interface PartialSTResponse {
    syntaxTree: STNode;
}

export interface PartialSTModification {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    newCodeSnippet: string;
}


export interface BallerinaModule {
    id?: string;
    name: string;
    displayName?: string;
    moduleName?: string;
    package: Package;
    displayAnnotation?: DisplayAnnotation;
    icon?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface Connector extends BallerinaModule { }

// tslint:disable-next-line: no-empty-interface
export interface Trigger extends BallerinaModule { }

export interface Package {
    organization: string;
    name: string;
    version: string;
    platform?: string;
    languageSpecificationVersion?: string;
    URL?: string;
    balaURL?: string;
    balaVersion?: string;
    digest?: string;
    summary?: string;
    readme?: string;
    template?: boolean;
    licenses?: any[];
    authors?: any[];
    sourceCodeLocation?: string;
    keywords?: any[];
    ballerinaVersion?: string;
    icon?: string;
    pullCount?: number;
    createdDate?: number;
    visibility?: string;
    modules?: any[];
}

export interface BallerinaRecord {
    org: string;
    module: string;
    version: string;
    name: string;
}

export interface BallerinaConnectorInfo extends Connector {
    functions: FunctionDefinitionInfo[];
    documentation?: string;
}

export interface BallerinaTriggerInfo extends Trigger {
    serviceTypes: ServiceType[],
    listenerParams: Parameter[],
    documentation?: string,
}

export interface ServiceType {
    name: string;
    description?: string;
    functions?: RemoteFunction[];
}

export interface RemoteFunction {
    isRemote?: boolean;
    documentation?: string;
    name: string;
    parameters?: Parameter[];
    returnType?: ReturnType;
}

export interface Parameter {
    name: string;
    typeName: string;
    optional?: boolean;
    typeInfo?: TypeInfo;
    displayAnnotation?: DisplayAnnotation;
    fields?: Field[];
    hasRestType?: boolean;
    restType?: ReturnType;
    defaultable?: boolean;
}

export interface DisplayAnnotation {
    label?: string;
}

export interface MemberField {
    typeName?: string;
    optional?: boolean;
    defaultable?: boolean;
}
export interface Field {
    name?: string;
    typeName?: string;
    optional?: boolean;
    defaultable?: boolean;
    fields?: ReturnType[];
    hasRestType?: boolean;
    restType?: ReturnType;
    members?: MemberField[];
    defaultType?: string;
}

export interface ReturnType {
    name?: string;
    typeName?: string;
    optional?: boolean;
    defaultable?: boolean;
    displayAnnotation?: DisplayAnnotation;
}

export interface TypeInfo {
    name?: string;
    orgName?: string;
    moduleName?: string;
    version?: string;
}

export interface BallerinaModulesRequest {
    query: string;
    packageName?: string;
    organization?: string;
    connector?: string;
    description?: string;
    template?: string;
    keyword?: string;
    ballerinaVersion?: string;
    platform?: boolean;
    userPackages?: boolean;
    limit?: number;
    offset?: number;
    sort?: string;
    targetFile?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface BallerinaConnectorsRequest extends BallerinaModulesRequest { }

// tslint:disable-next-line: no-empty-interface
export interface BallerinaTriggersRequest extends BallerinaModulesRequest { }

export interface BallerinaModuleResponse {
    central: BallerinaModule[];
    local?: BallerinaModule[];
    error?: string;
}

export interface BallerinaConnectorsResponse extends BallerinaModuleResponse {
    central: Connector[];
    local?: Connector[];
    error?: string;
}

export interface BallerinaTriggersResponse extends BallerinaModuleResponse {
    central: Trigger[];
    error?: string;
}

export interface BallerinaTriggerRequest {
    id: string
}

export interface BallerinaTriggerResponse extends BallerinaTriggerInfo {
    error?: string;
}

export interface BallerinaSTModifyRequest {
    documentIdentifier: { uri: string; };
    astModifications: STModification[];
}

export interface STModification {
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
    type: string;
    config?: any;
    isImport?: boolean;
}

export interface BallerinaSTModifyResponse {
    source: string;
    defFilePath: string;
    syntaxTree: STNode;
    parseSuccess: boolean;
}

export interface MainTriggerModifyRequest extends STModifyRequest {
    type: "main";
    config?: MainConfig;
}

export interface ServiceConfig {
    SERVICE: string;
    RESOURCE: string;
    RES_PATH: string;
    PORT: string;
    METHODS: string;
    CURRENT_TRIGGER?: string;
}

export interface MainConfig {
    COMMENT?: string;
    CURRENT_TRIGGER?: string;
}

export interface STModifyRequest {
    documentIdentifier: { uri: string; };
}

export interface ServiceTriggerModifyRequest extends STModifyRequest {
    type: "service";
    config: ServiceConfig;
}

export type TriggerModifyRequest = MainTriggerModifyRequest | ServiceTriggerModifyRequest;

export interface BallerinaProjectParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface JsonToRecordRequest {
    jsonString: string;
    recordName: string;
    isRecordTypeDesc: boolean;
    isClosed: boolean;
}

export interface JsonToRecordResponse {
    codeBlock: string;
    diagnostics?: JsonToRecordMapperDiagnostic[];
}

export interface JsonToRecordMapperDiagnostic {
    message: string;
    severity?: DIAGNOSTIC_SEVERITY;
}

export interface XMLToRecordRequest {
    xmlValue: string;
    isRecordTypeDesc?: boolean;
    isClosed?: boolean;
    forceFormatRecordFields?: boolean;
}

export interface XMLToRecordResponse {
    codeBlock: string;
    diagnostics?: XMLToRecordConverterDiagnostic[];
}

export interface XMLToRecordConverterDiagnostic {
    message: string;
    severity?: DIAGNOSTIC_SEVERITY;
}
export interface DocumentIdentifier {
    uri: string;
}

export interface PerformanceAnalyzerRequest {
    documentIdentifier: DocumentIdentifier;
    isWorkerSupported: boolean;
}

export interface PerformanceAnalyzerResponse {
    resourcePos: RRange;
    endpoints: any;
    actionInvocations: any;
    type: string;
    message: string;
    name: string;
}

interface RRange {
    start: Position;
    end: Position;
}

export interface ExecutorPositionsResponse {
    executorPositions?: ExecutorPosition[];
}

export interface ExecutorPosition {
    kind: string;
    range: LineRange;
    name: string;
}

export interface LineRange {
    startLine: LinePosition;
    endLine: LinePosition;
}
export interface SymbolInfoRequest {
    textDocumentIdentifier: {
        uri: string;
    },
    position: {
        line: number;
        character: number;
    }
}

export interface ParameterInfo {
    name: string,
    description: string,
    kind: string,
    type: string
}

export interface SymbolDocumentation {
    description: string,
    parameters?: ParameterInfo[],
    returnValueDescription?: string,
    deprecatedDocumentation?: string,
    deprecatedParams?: ParameterInfo[]
}

export interface SymbolInfoResponse {
    symbolKind: string,
    documentation: SymbolDocumentation
}

export interface BallerinaFunctionSTRequest {
    lineRange: RRange;
    documentIdentifier: DocumentIdentifier;
}
export interface DiagramDiagnostic {
    message: string;
    diagnosticInfo: {
        code: string;
        severity: string;
    };
    range: NodePosition;
}

export interface NonPrimitiveBal {
    orgName: string;
    moduleName: string;
    name: string;
    version?: string;
}

export interface Type {
    typeName: string;
    name?: string;
    displayName?: string;
    memberType?: Type;
    inclusionType?: Type;
    paramType?: Type;
    selectedDataType?: string;
    description?: string;
    defaultValue?: any;
    value?: any;
    optional?: boolean;
    defaultable?: boolean;
    fields?: Type[];
    members?: Type[];
    references?: Type[];
    isReturn?: boolean;
    isTypeDef?: boolean;
    isReference?: boolean;
    isStream?: boolean;
    typeInfo?: NonPrimitiveBal;
    hide?: boolean;
    aiSuggestion?: string;
    noCodeGen?: boolean;
    requestName?: string;
    tooltip?: string;
    tooltipActionLink?: string;
    tooltipActionText?: string;
    isErrorType?: boolean;
    isRestParam?: boolean;
    customAutoComplete?: string[];
    validationRegex?: any;
    leftTypeParam?: any;
    rightTypeParam?: any;
    initialDiagnostics?: DiagramDiagnostic[];
    documentation?: string;
    position?: NodePosition;
    selected?: boolean;
}

export interface ExpressionRange {
    startLine: LinePosition;
    endLine: LinePosition;
    filePath?: string;
}

export interface TypeFromExpressionRequest {
    documentIdentifier: {
        uri: string;
    };
    expressionRanges: ExpressionRange[];
}

export interface ResolvedTypeForExpression {
    type: Type;
    requestedRange: ExpressionRange;
}

export interface TypesFromExpressionResponse {
    types: ResolvedTypeForExpression[];
}

export interface TypeFromSymbolRequest {
    documentIdentifier: {
        uri: string;
    };
    positions: LinePosition[];
}

export interface TypesFromFnDefinitionRequest {
    documentIdentifier: {
        uri: string;
    };
    fnPosition: LinePosition;
    returnTypeDescPosition: LinePosition;
}

export interface GraphqlDesignServiceRequest {
    filePath: string;
    startLine: LinePosition;
    endLine: LinePosition;
}
export interface GraphqlDesignServiceResponse {
    graphqlDesignModel: any;
    isIncompleteModel: boolean;
    errorMsg: string;
}

export interface ResolvedTypeForSymbol {
    type: FormField;
    requestedPosition: LinePosition;
}

export interface TypesFromSymbolResponse {
    types: ResolvedTypeForSymbol[];
}

export interface GetComponentModelRequest {
    documentUris: string[];
}

export interface GetPersistERModelRequest {
    documentUri: string;
}

export interface GetComponentModelResponse {
    componentModels: {
        [key: string]: ComponentModel;
    };
    diagnostics: CMDiagnostics[];
}

export interface GetPersistERModelResponse {
    persistERModel: {
        [key: string]: ComponentModel;
    };
    diagnostics: CMDiagnostics[];
}

export interface IBallerinaLangClient {

    didOpen: (Params: DidOpenTextDocumentParams) => void;

    didClose: (params: DidCloseTextDocumentParams) => void;

    didChange: (params: DidChangeTextDocumentParams) => void;

    getProjectAST: (params: GetProjectASTParams) => Thenable<GetProjectASTResponse>;

    getAST: (params: GetASTParams) => Thenable<GetASTResponse>;

    getSyntaxTree: (params: GetSyntaxTreeParams) => Thenable<GetSyntaxTreeResponse>;

    astDidChange: (params: ASTDidChangeParams) => Thenable<ASTDidChangeResponse>;

    fetchExamples: (params: BallerinaExampleListParams) => Thenable<BallerinaExampleListResponse>;

    parseFragment: (params: BallerinaSourceFragment) => Thenable<BallerinaASTNode>;

    getEndpoints: () => Thenable<BallerinaEndpoint[]>;

    getBallerinaProject: (params: GetBallerinaProjectParams) => Thenable<BallerinaProject>;

    getDefinitionPosition: (params: TextDocumentPositionParams) => Thenable<BallerinaSTModifyResponse>;

    getRecord: (params: BallerinaRecordRequest) => Thenable<BallerinaRecordResponse>;

    getConnector: (params: BallerinaConnectorRequest) => Thenable<BallerinaConnectorResponse>;

    getConnectors: (params: BallerinaConnectorsRequest) => Thenable<BallerinaConnectorsResponse>;

    goToSource: (params: GoToSourceParams) => void;

    revealRange: (params: RevealRangeParams) => void;

    getDiagnostics: (params: BallerinaProjectParams) => Thenable<PublishDiagnosticsParams[]>;

    getCompletion: (params: CompletionParams) => Thenable<CompletionResponse[]>;

    getType: (param: ExpressionTypeRequest) => Thenable<ExpressionTypeResponse>;

    getSTForSingleStatement: (param: PartialSTRequest) => Thenable<PartialSTResponse>;

    getSTForExpression: (param: PartialSTRequest) => Thenable<PartialSTResponse>;

    getSTForModuleMembers: (param: PartialSTRequest) => Thenable<PartialSTResponse>;

    getSTForModulePart: (param: PartialSTRequest) => Thenable<PartialSTResponse>;

    getSTForResource: (param: PartialSTRequest) => Thenable<PartialSTResponse>;

    getTriggers: (params: BallerinaTriggersRequest) => Thenable<BallerinaTriggersResponse>;

    getTrigger: (params: BallerinaTriggerRequest) => Thenable<BallerinaTriggerResponse>;

    stModify: (params: BallerinaSTModifyRequest) => Thenable<BallerinaSTModifyResponse>;

    triggerModify: (params: TriggerModifyRequest) => Thenable<BallerinaSTModifyResponse>;

    getDocumentSymbol: (params: DocumentSymbolParams) => Thenable<DocumentSymbol[] | SymbolInformation[] | null>;

    getPerfEndpoints: (params: PerformanceAnalyzerRequest) => Thenable<PerformanceAnalyzerResponse[]>;

    resolveMissingDependencies: (params: GetSyntaxTreeParams) => Thenable<GetSyntaxTreeResponse>;

    getExecutorPositions: (params: GetBallerinaProjectParams) => Thenable<ExecutorPositionsResponse>;

    getSTForFunction: (params: BallerinaFunctionSTRequest) => Thenable<BallerinaSTModifyResponse>;

    getSymbolDocumentation: (params: SymbolInfoRequest) => Thenable<SymbolInfoResponse>;

    definition: (params: DefinitionParams) => Promise<Location | Location[] | LocationLink[] | null>;

    codeAction: (params: CodeActionParams) => Promise<CodeAction[]>;

    getTypeFromExpression: (params: TypeFromExpressionRequest) => Thenable<TypesFromExpressionResponse>;

    getTypeFromSymbol: (params: TypeFromSymbolRequest) => Thenable<TypesFromSymbolResponse>;

    getTypesFromFnDefinition: (params: TypesFromFnDefinitionRequest) => Thenable<TypesFromSymbolResponse>;

    convert: (params: JsonToRecordRequest) => Thenable<JsonToRecordResponse>;

    convertXml: (params: XMLToRecordRequest) => Thenable<XMLToRecordResponse>;

    rename: (params: RenameParams) => Thenable<WorkspaceEdit>;

    getPackageComponentModels: (params: GetComponentModelRequest) => Promise<GetComponentModelResponse>;

    getPersistERModel: (params: GetPersistERModelRequest) => Promise<GetPersistERModelResponse>;

    getGraphqlModel: (params: GraphqlDesignServiceRequest) => Thenable<GraphqlDesignServiceResponse>;
    // close: () => void;

    getBallerinaProjectComponents: (
        params: GetBallerinaPackagesParams
    ) => Promise<BallerinaProjectComponents>;
}
