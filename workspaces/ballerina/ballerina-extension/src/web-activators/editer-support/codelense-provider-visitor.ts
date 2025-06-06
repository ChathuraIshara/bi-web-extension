import {
    STNode,
    Visitor,
    FunctionDefinition,
    ServiceDeclaration,
    ObjectMethodDefinition,
    ResourceAccessorDefinition,
    STKindChecker,
    TypeDefinition
} from "@wso2-enterprise/syntax-tree";
import { CodeLens, Range, Uri } from "vscode";
import { PALETTE_COMMANDS } from "../constants/constants";
import { checkIsPersistModelFile } from "../constants/commonUtils";

export class CodeLensProviderVisitor implements Visitor {
    activeEditorUri: Uri;
    codeLenses: CodeLens[] = [];
    supportedServiceTypes: string[] = ["http"];

    constructor(activeEditorUri: Uri) {
        this.activeEditorUri = activeEditorUri;
    }

    public beginVisitFunctionDefinition(node: FunctionDefinition, parent?: STNode): void {
        this.createVisulizeCodeLens(node.functionName.position, node.position);
    }

    public beginVisitServiceDeclaration(node: ServiceDeclaration, parent?: STNode): void {
        if (node.expressions.length > 0) {
            const expr = node.expressions[0];
            if ((STKindChecker.isExplicitNewExpression(expr) &&
                expr.typeDescriptor &&
                STKindChecker.isQualifiedNameReference(expr.typeDescriptor) &&
                this.supportedServiceTypes.includes(expr.typeDescriptor.modulePrefix.value)) ||
                (STKindChecker.isSimpleNameReference(expr) &&
                    this.supportedServiceTypes.includes(expr.typeData.typeSymbol.moduleID.moduleName))) {
                this.createTryItCodeLens(node.position, node.serviceKeyword.position, node.absoluteResourcePath.map((path) => path.value).join(''), node.expressions.map((exp) => exp.source.trim()).join(','));
                if (expr?.typeData?.typeSymbol?.signature?.includes("graphql")) {
                    this.createVisulizeGraphqlCodeLens(node.serviceKeyword.position, node.position);
                } else {
                    this.createVisulizeCodeLens(node.serviceKeyword.position, node.position);
                }
            }
        }
    }

    public beginVisitTypeDefinition(node: TypeDefinition, parent?: STNode): void {
        if (STKindChecker.isRecordTypeDesc(node.typeDescriptor) && checkIsPersistModelFile(this.activeEditorUri)) {
            this.createVisualizeERCodeLens(node.position, node.typeName.value);
        }
    }

    public beginVisitObjectMethodDefinition(node: ObjectMethodDefinition, parent?: STNode): void {
        this.createVisulizeCodeLens(node.functionKeyword.position, node.position);
    }

    public beginVisitResourceAccessorDefinition(node: ResourceAccessorDefinition, parent?: STNode): void {
        this.createVisulizeCodeLens(node.qualifierList[0].position, node.position);
    }

    private createVisulizeCodeLens(range: any, position: any) {
        const codeLens = new CodeLens(new Range(
            range.startLine,
            range.startColumn,
            range.endLine,
            range.endColumn
        ));
        codeLens.command = {
            title: "Visualize",
            tooltip: "Visualize code block",
            command: PALETTE_COMMANDS.SHOW_VISUALIZER,
            arguments: [this.activeEditorUri.toString(), position]
        };
        this.codeLenses.push(codeLens);
    }

    private createVisualizeERCodeLens(range: any, recordName: string) {
        const codeLens = new CodeLens(new Range(
            range.startLine,
            range.startColumn,
            range.endLine,
            range.endColumn
        ));
        codeLens.command = {
            title: "Visualize",
            tooltip: "View this entity in the Entity Relationship diagram",
            command: PALETTE_COMMANDS.SHOW_ENTITY_DIAGRAM,
            arguments: [this.activeEditorUri.toString(), range, recordName]
        };
        this.codeLenses.push(codeLens);
    }

    private createVisulizeGraphqlCodeLens(range: any, position: any) {
        const codeLens = new CodeLens(new Range(
            range.startLine,
            range.startColumn,
            range.endLine,
            range.endColumn
        ));
        codeLens.command = {
            title: "Visualize",
            tooltip: "Visualize code block",
            command: PALETTE_COMMANDS.SHOW_VISUALIZER,
            arguments: [this.activeEditorUri.toString(), position]
        };
        this.codeLenses.push(codeLens);
    }

    private createTryItCodeLens(range: any, position: any, basePath: string, listener: string) {
        const codeLens = new CodeLens(new Range(
            position.startLine,
            position.startColumn,
            position.endLine,
            position.endColumn
        ));

        codeLens.command = {
            title: "Try it",
            tooltip: "Try running this service",
            command: PALETTE_COMMANDS.TRY_IT,
            arguments: [false, undefined, { basePath, listener }]
        };
        this.codeLenses.push(codeLens);
    }

    public getCodeLenses(): CodeLens[] {
        return this.codeLenses;
    }
}
