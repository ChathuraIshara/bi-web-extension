// tslint:disable: no-empty-interface
import { InitializeParams, InitializeResult, Location, Position,
    Range, TextDocumentPositionParams} from "vscode-languageserver-protocol";

import { BallerinaAST, BallerinaASTNode, BallerinaEndpoint,
    BallerinaSourceFragment } from "./ast-models";

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
    name : string,
    description : string,
    kind : string,
    type : string
}

export interface SymbolDocumentation {
    description : string,
    parameters? : ParameterInfo[],
    returnValueDescription? : string,
    deprecatedDocumentation? : string,
    deprecatedParams? : ParameterInfo[]
}

export interface SymbolInfoResponse {
    symbolKind: string,
    documentation : SymbolDocumentation
}

export interface LinePosition {
    line: number;
    offset: number;
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

export interface DidOpenParams {
    textDocument: {
        uri: string;
        languageId: string;
        text: string;
        version: number
    };
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

export interface STNode {
    kind: string;
    value?: any;
    parent?: STNode;
    viewState?: any;
    position?: any;
    typeData?: any;
    VisibleEndpoints?: VisibleEndpoint[];
    source: string;
    configurablePosition?: NodePosition;
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
    defaultable?: boolean;
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

export interface BallerinaTriggerInfo extends Trigger {
    serviceTypes:  ServiceType[],
    listenerParams: Parameter[],
    documentation?: string,
}

export interface ServiceType {
    name:        string;
    description?: string;
    functions?:   RemoteFunction[];
}

export interface RemoteFunction {
    isRemote?:      boolean;
    documentation?: string;
    name:          string;
    parameters?:    Parameter[];
    returnType?:    ReturnType;
}

export interface Parameter {
    name:              string;
    typeName:          string;
    optional?:          boolean;
    typeInfo?:          TypeInfo;
    displayAnnotation?: DisplayAnnotation;
    fields?:            Field[];
    hasRestType?:       boolean;
    restType?:          ReturnType;
    defaultable?:       boolean;
}

export interface DisplayAnnotation {
    label?: string;
}

export interface Field {
    name?:        string;
    typeName?:    string;
    optional?:    boolean;
    defaultable?: boolean;
    fields?:      ReturnType[];
    hasRestType?: boolean;
    restType?:    ReturnType;
}

export interface ReturnType {
    name?:              string;
    typeName?:          string;
    optional?:          boolean;
    defaultable?:       boolean;
    displayAnnotation?: DisplayAnnotation;
}

export interface TypeInfo {
    name?:       string;
    orgName?:    string;
    moduleName?: string;
    version?:    string;
}

export interface BallerinaConstructRequest {
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
export interface BallerinaConnectorsRequest extends BallerinaConstructRequest {}

export interface BallerinaTriggersRequest extends BallerinaConstructRequest {}

export interface BallerinaConstructResponse {
    central: BallerinaConstruct[];
    local?: BallerinaConstruct[];
    error?: string;
}

export interface BallerinaConnectorsResponse extends BallerinaConstructResponse {
    central: Connector[];
    local?: Connector[];
    error?: string;
}

export interface BallerinaTriggersResponse extends BallerinaConstructResponse {
    central: Trigger[];
    error?: string;
}

export interface BallerinaTriggerRequest {
    id: string
}

export interface BallerinaTriggerResponse extends BallerinaTriggerInfo {
    error?: string;
}

export interface BallerinaConnectorRequest {
    id?: string
    orgName?: string
    packageName?: string
    moduleName?: string
    version?: string
    name?: string
    targetFile?: string
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
    visibility?: string;
    modules?: any[];
}

export interface BallerinaConstruct {
    id?: string;
    name: string;
    displayName?: string;
    moduleName?: string;
    package: Package;
    displayAnnotation?: DisplayAnnotation;
    icon?: string;
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

export interface ResolvedTypeForSymbol {
    type: Type;
    requestedPosition: LinePosition;
}

export interface TypesFromSymbolResponse {
    types: ResolvedTypeForSymbol[];
}

export interface Connector extends BallerinaConstruct {}

export interface Trigger extends BallerinaConstruct {}

export interface IBallerinaLangClient {

    init: (params?: InitializeParams) => Thenable<InitializeResult>;

    getProjectAST: (params: GetProjectASTParams) => Thenable<GetProjectASTResponse>;

    getAST: (params: GetASTParams) => Thenable<GetASTResponse>;

    getSyntaxTree: (params: GetSyntaxTreeParams) => Thenable<GetSyntaxTreeResponse>;

    astDidChange: (params: ASTDidChangeParams) => Thenable<ASTDidChangeResponse>;

    fetchExamples: (params: BallerinaExampleListParams) => Thenable<BallerinaExampleListResponse>;

    parseFragment: (params: BallerinaSourceFragment) => Thenable<BallerinaASTNode> ;

    getEndpoints: () => Thenable<BallerinaEndpoint[]>;

    getBallerinaProject: (params: GetBallerinaProjectParams) => Thenable<BallerinaProject>;

    getDefinitionPosition: (params: TextDocumentPositionParams) => Thenable<Location>;

    getRecord: (params: BallerinaRecordRequest) => Thenable<BallerinaRecordResponse>;

    getConnector: (params: BallerinaConnectorRequest) => Thenable<BallerinaConnectorResponse>;

    getConnectors: (params: BallerinaConnectorsRequest) => Thenable<BallerinaConnectorsResponse>;

    getTriggers: (params: BallerinaTriggersRequest) => Thenable<BallerinaTriggersResponse>;

    getTrigger: (params: BallerinaTriggerRequest) => Thenable<BallerinaTriggerResponse>;

    goToSource: (params: GoToSourceParams) => void;

    revealRange: (params: RevealRangeParams) => void;

    getSymbolDocumentation: (params: SymbolInfoRequest) => Thenable<SymbolInfoResponse>

    getTypeFromExpression: (params: TypeFromExpressionRequest) => Thenable<TypesFromExpressionResponse>

    getTypeFromSymbol: (params: TypeFromSymbolRequest) => Thenable<TypesFromSymbolResponse>

    getTypesFromFnDefinition: (params: TypesFromFnDefinitionRequest) => Thenable<TypesFromSymbolResponse>

    close: () => void;
}
