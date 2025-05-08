/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { STNode } from "@wso2-enterprise/syntax-tree";

import { checkCommentMinutiae, getJSXForMinutiae, getMinutiaeJSX } from "../../../utils";
import { StatementEditorViewState } from "../../../utils/statement-editor-viewstate";
import { InputEditor, InputEditorProps } from "../../InputEditor";
import { useStatementRendererStyles } from "../../styles";

interface OtherExpressionProps {
    model: STNode;
}

export function OtherExpressionComponent(props: OtherExpressionProps) {
    const { model } = props;

    const statementRendererClasses = useStatementRendererStyles();

    const inputEditorProps: InputEditorProps = {
        model,
        classNames: statementRendererClasses.expressionElement
    };

    const isFieldWithNewLine = (model?.viewState as StatementEditorViewState)?.multilineConstructConfig?.isFieldWithNewLine;

    const leadingMinutiaeJSX = getJSXForMinutiae(model?.leadingMinutiae, isFieldWithNewLine);
    const trailingMinutiaeJSX = getJSXForMinutiae(model?.trailingMinutiae, isFieldWithNewLine);

    const filteredLeadingMinutiaeJSX = checkCommentMinutiae(leadingMinutiaeJSX);

    return (
        <>
            {filteredLeadingMinutiaeJSX}
            <InputEditor {...inputEditorProps} />
            {trailingMinutiaeJSX}
        </>
    );
}
