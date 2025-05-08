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

import { StatementEditorContext } from "../../store/statement-editor-context";
import { Diagnostics } from "../Diagnostics";
import { HelperPane } from "../HelperPane";
import { StatementRenderer } from "../StatementRenderer";
import { useStatementEditorStyles } from "../styles";
import Toolbar from "../Toolbar";

export function EditorPane() {
    const statementEditorClasses = useStatementEditorStyles();
    const [docExpandClicked, setDocExpand] = React.useState(false);

    const stmtCtx = useContext(StatementEditorContext);

    const {
        modelCtx: {
            statementModel
        },
    } = stmtCtx;

    return (
        <>
            <div className={statementEditorClasses.stmtEditorContentWrapper} data-testid="statement-contentWrapper">
                <Toolbar />
                <div className={statementEditorClasses.sourceEditor}>
                    <div className={statementEditorClasses.statementExpressionContent}  data-testid="statement-renderer">
                        <StatementRenderer
                            model={statementModel}
                        />
                    </div>
                    <Diagnostics/>
                </div>
            </div>
            <div className={statementEditorClasses.suggestionsSection} data-testid="suggestions-section">
                <HelperPane />
            </div>
        </>
    );
}
