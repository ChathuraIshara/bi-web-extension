/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { BinaryExpression, CaptureBindingPattern, CheckExpression, ForeachStatement, ImplicitNewExpression, LocalVarDecl, NodePosition, NumericLiteral, PositionalArg, RemoteMethodCallAction, STKindChecker, STNode, StringLiteral, StringLiteralToken } from "@wso2-enterprise/syntax-tree";

export interface AnalyzerEndPoint {
    pkgID: string;
    name: string;
    baseUrl: string;
    pos: string;
}

export interface AnalyzerEndPointData {
    endPointPayload: { [s: string]: AnalyzerEndPoint; };
}

export interface AnalyzerRequestPayload {
    endpoints: { [s: string]: AnalyzerEndPoint };
    actionInvocations: AnalyzerAction;
}

export interface AnalyzerAction {
    length?: number;
    nextNode?: AnalyzerAction;
    endPointRef?: string;
    name?: string;
    path?: string;
    pos?: string;
    ifBody?: AnalyzerAction;
    elseBody?: AnalyzerAction;
    forBody?: AnalyzerAction;
}

export default class AnalyzerPayload {
    private endPointIdDictionary: { id: string, variableName: string }[][] = [[]];
    private analyzerActionStack: AnalyzerAction[] = [];
    private analyzerPayload: AnalyzerAction;
    private endPointPayload: { [id: string]: AnalyzerEndPoint } = {};

    constructor() {
        const newAction: AnalyzerAction = {};
        this.analyzerPayload = newAction;
        this.analyzerActionStack = [newAction];
    }

    private getLastIndex(array: any[]) {
        if (array.length) {
            return array.length - 1;
        } else {
            return 0;
        }
    }

    private getEndpointId(variableName: string) {
        for (const bodyData of this.endPointIdDictionary) {
            const result = bodyData.find((endPointData) => endPointData.variableName === variableName);
            if (result) {
                return result.id;
            }
        }
    }

    private isEmptyNode(action: AnalyzerAction) {
        return !(action.elseBody || action.ifBody || action.forBody
            || action.endPointRef || action.nextNode);
    }

    private isEmptyNodeForElse(action: AnalyzerAction) {
        return !(action.forBody);
    }

    public addNextNode() {
        const lastIndex = this.getLastIndex(this.analyzerActionStack);
        const parentBranch = this.analyzerActionStack[lastIndex];
        const newNode: AnalyzerAction = {};
        parentBranch.nextNode = newNode;
        this.analyzerActionStack[lastIndex] = newNode;
    }

    public pushIfBranch() {
        const lastIndex = this.getLastIndex(this.analyzerActionStack);
        const parentBranch = this.analyzerActionStack[lastIndex];

        if (!this.isEmptyNode(parentBranch)) {
            this.addNextNode()
        }

        const nextAction: AnalyzerAction = {};
        this.analyzerActionStack[lastIndex].ifBody = nextAction;
        this.analyzerActionStack.push(nextAction);
    }

    public pushElseBranch() {
        const lastIndex = this.getLastIndex(this.analyzerActionStack);
        const parentBranch = this.analyzerActionStack[lastIndex];

        if (!this.isEmptyNodeForElse(parentBranch)) {
            this.addNextNode()
        }

        const nextAction: AnalyzerAction = {};
        this.analyzerActionStack[lastIndex].elseBody = nextAction;
        this.analyzerActionStack.push(nextAction);
    }

    public pushForBranch(node: STNode) {
        let iterations = 2;
        if (STKindChecker.isForeachStatement(node)) {
            const rhsValue = Number((((node as ForeachStatement)?.actionOrExpressionNode as BinaryExpression)?.rhsExpr as NumericLiteral)?.literalToken?.value);
            const lhsValue = Number((((node as ForeachStatement)?.actionOrExpressionNode as BinaryExpression)?.lhsExpr as NumericLiteral)?.literalToken?.value);
            if ((rhsValue - lhsValue) >= 0) {
                iterations = (rhsValue - lhsValue) + 1;
            }
        }
        const lastIndex = this.getLastIndex(this.analyzerActionStack);
        const parentBranch = this.analyzerActionStack[lastIndex];

        if (!this.isEmptyNode(parentBranch)) {
            this.addNextNode()
        }

        const nextAction: AnalyzerAction = {};
        this.analyzerActionStack[lastIndex].length = iterations;
        this.analyzerActionStack[lastIndex].forBody = nextAction;
        this.analyzerActionStack.push(nextAction);
    }

    public popBranch() {
        const lastBranch = this.analyzerActionStack.pop();
        const lastIndex = this.getLastIndex(this.analyzerActionStack);
        const parentBranch = this.analyzerActionStack[lastIndex];

        if (this.isEmptyNode(lastBranch)) {
            if (parentBranch?.elseBody && this.isEmptyNode(parentBranch?.elseBody)) {
                parentBranch.elseBody = null;
            }

            if (parentBranch?.forBody && this.isEmptyNode(parentBranch?.forBody)) {
                parentBranch.forBody = null;
            }

            if (parentBranch?.ifBody && this.isEmptyNode(parentBranch?.ifBody)) {
                parentBranch.ifBody = null;
            }

            if (parentBranch?.nextNode && this.isEmptyNode(parentBranch?.nextNode)) {
                parentBranch.nextNode = null;
            }
        }
    }

    public pushActionNode(node: RemoteMethodCallAction) {
        const endPointReference = this.getEndpointId(node?.expression?.source);

        // Abort the execution when no reference found
        if (!endPointReference) {
            return;
        }

        let path: string;
        if (node?.arguments.length > 0 && STKindChecker.isStringLiteral((node?.arguments[0] as PositionalArg).expression)) {
            path = ((node?.arguments[0] as PositionalArg).expression as StringLiteral).literalToken.value.replace(/"/g, "")
        }

        const analyzerAction: AnalyzerAction = {
            endPointRef: endPointReference,
            name: node.methodName.name.value,
            path: path ? path : null,
            pos: `choreo.ball:${(node.position as NodePosition).startLine}:${(node.position as NodePosition).startColumn}`
        }

        const lastIndex = this.getLastIndex(this.analyzerActionStack);
        if (this.isEmptyNode(this.analyzerActionStack[lastIndex])) {
            this.analyzerActionStack[lastIndex].endPointRef = endPointReference;
            this.analyzerActionStack[lastIndex].name = analyzerAction.name;
            this.analyzerActionStack[lastIndex].path = path ? path : null;
            this.analyzerActionStack[lastIndex].pos = analyzerAction.pos;
        } else {
            this.analyzerActionStack[lastIndex].nextNode = analyzerAction;
            this.analyzerActionStack[lastIndex] = analyzerAction;
        }

    }

    public pushBody() {
        this.endPointIdDictionary.push([]);
    }

    public popBody() {
        this.endPointIdDictionary.pop();
    }

    public pushEndPointNode(node: LocalVarDecl) {
        const variableName = (node.typedBindingPattern.bindingPattern as CaptureBindingPattern).variableName.value;
        const position = node.position as NodePosition;
        const baseUrl = ((((node.initializer as CheckExpression)?.expression as ImplicitNewExpression)
            ?.parenthesizedArgList?.arguments[0] as PositionalArg)?.expression as StringLiteral)?.literalToken?.value.replace(/"/g, "")
        const pkgID = node?.typeData?.typeSymbol?.moduleID?.orgName + "/" + node?.typeData?.typeSymbol?.moduleID?.moduleName;

        const analyzerEndPoint: AnalyzerEndPoint = {
            name: node.typeData.typeSymbol.name,
            baseUrl: baseUrl ? baseUrl : null,
            pos: `(${position?.startLine}:${position?.startColumn},${position?.endLine}:${position?.endColumn})`,
            pkgID
        }

        const id = `${position.startLine.toString()}:${position.startColumn.toString()}:${position.endLine.toString()}:${position.endColumn.toString()}`;
        this.endPointIdDictionary[this.getLastIndex(this.endPointIdDictionary)].push({ id, variableName });
        this.endPointPayload[id] = analyzerEndPoint;
    }


    public getPayload() {
        return { endpoints: this.endPointPayload, actionInvocations: this.analyzerPayload }
    }
}
