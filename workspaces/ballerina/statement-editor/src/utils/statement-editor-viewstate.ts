/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Diagnostic, NodePosition } from "@wso2-enterprise/syntax-tree";

export enum ModelType {
    EXPRESSION,
    OPERATOR,
    BINDING_PATTERN,
    TYPE_DESCRIPTOR,
    QUERY_CLAUSE,
    METHOD_CALL,
    FIELD_ACCESS,
    QUERY_EXPRESSION,
    FUNCTION,
    ORDER_KEY,
    ORDER_DIRECTION_KEYWORDS,
    SPECIFIC_FIELD_NAME
}

export class StatementEditorViewState {
    public exprNotDeletable: boolean = false;
    public templateExprDeletable: boolean = false;
    public isWithinBlockStatement: boolean = false;
    public isWithinWhereClause: boolean = false;
    public modelType: ModelType = ModelType.EXPRESSION;
    public diagnosticsInRange?: Diagnostic[] = [];
    public diagnosticsInPosition?: Diagnostic[] = [];
    public multilineConstructConfig: MultilineConstructConfig = {
        isFieldWithNewLine: false,
        isClosingBraceWithNewLine: false
    };
    public parentFunctionPos: NodePosition = null;
}

interface MultilineConstructConfig {
    isFieldWithNewLine?: boolean;
    isClosingBraceWithNewLine?: boolean;
}
