/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { Codicon, Typography } from "@wso2-enterprise/ui-toolkit";

import { StatementSyntaxDiagnostics } from "../../models/definitions";
import { StatementEditorContext } from "../../store/statement-editor-context";
import { filterCodeActions } from "../../utils";
import { CodeActionButton } from "../CodeActionButton";
import { useStatementEditorDiagnosticStyles } from "../styles";

export const DiagnosticsPaneId = "data-mapper-diagnostic-pane";

export function Diagnostics() {
    const statementEditorDiagnosticClasses = useStatementEditorDiagnosticStyles();
    const stmtCtx = useContext(StatementEditorContext);
    const {
        statementCtx: { diagnostics, errorMsg },
    } = stmtCtx;
    let hasCodeAction = false;

    function actionButton(diag: StatementSyntaxDiagnostics, key?: number) {
        if (filterCodeActions(diag.codeActions).length > 0) {
            hasCodeAction = true;
            return <CodeActionButton syntaxDiagnostic={diag} index={key}/>;
        } else if (hasCodeAction) {
            return <div style={{ width: "30px", marginRight: "6px" }} />;
        }
    }

    const diagnosticsMessages = diagnostics && diagnostics.map((diag: StatementSyntaxDiagnostics, index: number) =>
        !diag.isPlaceHolderDiag && (
            <div className={statementEditorDiagnosticClasses.diagnosticsPaneInner}>
                {actionButton(diag, index)}
                <Codicon name="error" sx={{marginTop: '3px', cursor: 'unset'}} />
                <Typography
                    variant="body2"
                    sx={{marginLeft: "5px"}}
                >
                    {diag.message}
                </Typography>
            </div>
        )
    );

    const errorMessage = errorMsg && errorMsg.length > 0 && (
        <Typography
            variant="body2"
            data-testid="error-message"
        >
            {errorMsg}
        </Typography>
    );

    return (
        <div
            id={DiagnosticsPaneId}
            className={(diagnosticsMessages.length > 0 || errorMessage) && statementEditorDiagnosticClasses.diagnosticsPane}
            data-testid="diagnostics-pane"
        >
            <div>
                {diagnostics && diagnosticsMessages}
                {errorMsg && errorMsg.length > 0 && errorMessage}
            </div>
        </div>
    );
}
