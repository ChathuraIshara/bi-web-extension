/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    BlockStatement,
    NodePosition,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";
import { Diagnostic } from "vscode-languageserver-protocol";

import { StmtOffset } from "../models/definitions";
import { isDiagnosticInRange, isPositionsEquals } from "../utils";
import { StatementEditorViewState } from "../utils/statement-editor-viewstate";

class DiagnosticsMappingVisitor implements Visitor {
    private diagnostic: Diagnostic;
    private offset: StmtOffset;

    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (parent && (parent.viewState as StatementEditorViewState).isWithinBlockStatement) {
            (node.viewState as StatementEditorViewState).isWithinBlockStatement = true;
        }
    }

    public beginVisitBlockStatement(node: BlockStatement, parent?: STNode) {
        node.statements.map((stmt: STNode) => {
            (stmt.viewState as StatementEditorViewState).isWithinBlockStatement = true;
        });
    }

    public endVisitSTNode(node: STNode, parent?: STNode) {
        const isWithinBlockStatement = (node.viewState as StatementEditorViewState).isWithinBlockStatement;
        const diagPosition: NodePosition = {
            startLine: this.diagnostic.range.start.line,
            startColumn: this.diagnostic.range.start.character,
            endLine: this.diagnostic.range.end.line,
            endColumn: this.diagnostic.range.end.character
        }
        const nodePosition: NodePosition = {
            startLine: node?.position?.startLine + this.offset.startLine,
            startColumn: node?.position?.startColumn + (!isWithinBlockStatement ? this.offset.startColumn : 0),
            endLine: node?.position?.endLine + this.offset.startLine,
            endColumn: node?.position?.endColumn + (!isWithinBlockStatement ? this.offset.startColumn : 0)
        }
        if (isPositionsEquals(diagPosition, nodePosition)) {
            // TODO: Remove this If block as all nodes coming through here
            // doesn't contain "syntaxDiagnostics" property as it is something
            // we pushed from backend.
            if (node && node.syntaxDiagnostics) {
                node?.syntaxDiagnostics?.push({
                    diagnosticInfo: {
                        code: this.diagnostic.code.toString(),
                        severity: this.diagnostic.severity.toString()
                    },
                    message: this.diagnostic.message
                });
            }

            // Statement Editor viewState will hold the diagnostics for
            // each node which matched with the position.
            // To use when highlighting an error
            if (node && node.viewState && this.diagnostic.severity === 1) {
                node?.viewState?.diagnosticsInPosition.push({
                    diagnosticInfo: {
                        code: this.diagnostic.code.toString(),
                        severity: this.diagnostic.severity.toString()
                    },
                    message: this.diagnostic.message
                });
            }
        }
        if (isDiagnosticInRange(diagPosition, nodePosition)) {
            // Statement Editor viewState will hold the diagnostics for
            // each node which matched to above condition.
            if (node && node.viewState && this.diagnostic.severity === 1) {
                node?.viewState?.diagnosticsInRange.push({
                    code: this.diagnostic.code.toString(),
                    severity: this.diagnostic.severity.toString(),
                    range: this.diagnostic.range,
                    message: this.diagnostic.message,
                    diagnosticInfo: {
                        code: this.diagnostic.code.toString(),
                        severity: this.diagnostic.severity.toString(),
                    }
                });
            }
        }
    }

    setDiagnosticsNOffset(diagnostic: Diagnostic, offset: StmtOffset) {
        this.diagnostic = diagnostic;
        this.offset = offset;
    }
}

export const visitor = new DiagnosticsMappingVisitor();
