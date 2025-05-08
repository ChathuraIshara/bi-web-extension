/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { STModification } from "@wso2-enterprise/ballerina-core";
import {
    CommaToken,
    LetExpression,
    LetVarDecl,
    NodePosition,
    STKindChecker,
    STNode
} from "@wso2-enterprise/syntax-tree";

import {
    genLetExpressionVariableName,
    isPositionsEquals
} from "../../../utils/st-utils";

import { LetVarDeclModel } from "./LocalVarConfigPanel";

export function getLetExpression(fnDef: STNode): LetExpression {
    if (STKindChecker.isFunctionDefinition(fnDef) && STKindChecker.isExpressionFunctionBody(fnDef.functionBody)) {
        if (STKindChecker.isLetExpression(fnDef.functionBody.expression)) {
            return fnDef.functionBody.expression;
        }
    }
}

export function getLetExpressions(letExpression: LetExpression): LetExpression[] {
    const letExpressions: LetExpression[] = [letExpression];
    if (STKindChecker.isLetExpression(letExpression.expression)) {
        letExpressions.push(...getLetExpressions(letExpression.expression));
    }
    return letExpressions;
}

export function getLetVarDeclarations(letExpr: LetExpression): (LetVarDecl | CommaToken)[] {
    const letVarDeclarations = [...letExpr.letVarDeclarations];
    if (STKindChecker.isLetExpression(letExpr.expression)) {
        letVarDeclarations.push(...getLetVarDeclarations(letExpr.expression));
    }
    return letVarDeclarations;
}

export function getLetExprAddModification(index: number,
                                          fnDef: STNode,
                                          letExpression: LetExpression,
                                          letVarDecls: LetVarDeclModel[]): STModification {
    const varName = genLetExpressionVariableName([letExpression]);
    let expr = `var ${varName} = EXPRESSION`;
    let addPosition: NodePosition;

    if (!letExpression) {
        const fnBody = STKindChecker.isFunctionDefinition(fnDef)
            && STKindChecker.isExpressionFunctionBody(fnDef.functionBody)
            && fnDef.functionBody;
        addPosition = {
            ...fnBody.expression.position,
            endLine: fnBody.expression.position.startLine,
            endColumn: fnBody.expression.position.startColumn
        };
        expr = `let ${expr} in `;
    } else if (isNaN(index)) {
        const lastLetDeclPosition = letVarDecls[letVarDecls.length - 1].letVarDecl.position;
        addPosition = {
            ...lastLetDeclPosition,
            startLine: lastLetDeclPosition.endLine,
            startColumn: lastLetDeclPosition.endColumn
        };
        expr = `, ${expr}`;
    } else {
        const lastLetDeclPosition = letVarDecls[index].letVarDecl.position;
        addPosition = {
            ...lastLetDeclPosition,
            endLine: lastLetDeclPosition.startLine,
            endColumn: lastLetDeclPosition.startColumn
        }
        expr = `${expr} ,`;
    }
    return {
        type: "INSERT",
        config: {STATEMENT: expr},
        ...addPosition
    };
}

export function getLetExprDeleteModifications(letExpression: LetExpression,
                                              letVarDecls: LetVarDeclModel[]): STModification[] {
    let modifications: STModification[] = [];
    const selectedLetVarDecls: LetVarDecl[] = letVarDecls.filter(decl => decl.checked).map(decl => decl.letVarDecl);
    const hasSelectedAllExpressions = !(letExpression.letVarDeclarations
        .filter(decl => STKindChecker.isLetVarDecl(decl)) as LetVarDecl[])
        .some(decl => !selectedLetVarDecls.includes(decl));

    const allLetVarDecls = [...letExpression.letVarDeclarations];
    const deleteIndices = allLetVarDecls.map((decl, index) => {
        return selectedLetVarDecls.some(selectedDecl =>
            isPositionsEquals(selectedDecl.position, decl.position)
        ) ? index : -1;
    }).filter(v => v !== -1);

    if (hasSelectedAllExpressions) {
        // Should delete the 'let' and 'in' keywords too
        modifications.push({
            type: "DELETE",
            startLine: letExpression.letKeyword.position.startLine,
            startColumn: letExpression.letKeyword.position.startColumn,
            endLine: letExpression.inKeyword.position.endLine,
            endColumn: letExpression.inKeyword.position.endColumn
        });
    } else {
        modifications = deleteIndices.reverse().map(index => {
            const previous = allLetVarDecls[index - 1];
            const next = allLetVarDecls[index + 1];
            const isLastElement = index + 1 === allLetVarDecls.length;
            const selected = allLetVarDecls[index];

            let deletePosition = selected.position;

            if (previous && STKindChecker.isCommaToken(previous) && isLastElement) {
                // if its the last element, need to delete previous comma as well
                deletePosition = {
                    ...selected.position,
                    startLine: (previous.position as NodePosition)?.startLine,
                    startColumn: (previous.position as NodePosition)?.startColumn,
                };
                allLetVarDecls.splice(index - 1);
            } else if (next && STKindChecker.isCommaToken(next)) {
                // if its not the last element, need to delete the following comma as well
                deletePosition = {
                    ...selected.position,
                    endLine: (next.position as NodePosition)?.endLine,
                    endColumn: (next.position as NodePosition)?.endColumn,
                };
                allLetVarDecls.splice(index, 2);
            } else {
                allLetVarDecls.splice(index, 1);
            }
            return {
                type: "DELETE",
                ...deletePosition
            }
        });
    }
    return modifications.reverse();
}
