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

import cn from "classnames";

import SyntaxErrorWarning from "../../../assets/icons/SyntaxErrorWarning";
import { OtherStatementNodeTypes } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { checkCommentMinutiae, getJSXForMinutiae } from "../../../utils";
import { StatementEditorViewState } from "../../../utils/statement-editor-viewstate";
import { InputEditor } from "../../InputEditor";
import { useStatementRendererStyles } from "../../styles";

interface OtherStatementProps {
    model: OtherStatementNodeTypes;
}

export function OtherStatementTypes(props: OtherStatementProps) {
    const { model } = props;

    const statementRendererClasses = useStatementRendererStyles();

    const inputEditorProps = {
        model
    };

    const { modelCtx: {hasSyntaxDiagnostics} } = useContext(StatementEditorContext);

    const isFieldWithNewLine = (model?.viewState as StatementEditorViewState)?.multilineConstructConfig?.isFieldWithNewLine;

    const leadingMinutiaeJSX = getJSXForMinutiae(model?.leadingMinutiae, isFieldWithNewLine);
    const trailingMinutiaeJSX = getJSXForMinutiae(model?.trailingMinutiae, isFieldWithNewLine);
    const filteredLeadingMinutiaeJSX = checkCommentMinutiae(leadingMinutiaeJSX);

    const styleClassNames = cn(statementRendererClasses.expressionElement,
        hasSyntaxDiagnostics ? statementRendererClasses.syntaxErrorElementSelected :
                               statementRendererClasses.expressionElementSelected
    )

    return (
        <span className={styleClassNames}>
            {hasSyntaxDiagnostics  && (
                <span className={statementRendererClasses.syntaxErrorTooltip} data-testid="syntax-error-highlighting">
                    <SyntaxErrorWarning />
                </span>
            )}
            {filteredLeadingMinutiaeJSX}
            <InputEditor {...inputEditorProps} />
            {trailingMinutiaeJSX}
        </span>
    );
}
