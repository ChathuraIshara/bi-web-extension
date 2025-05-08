/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import {
    AsteriskToken,
    BooleanKeyword,
    DecimalFloatingPointLiteralToken,
    DecimalIntegerLiteralToken,
    DecimalKeyword,
    FalseKeyword,
    FloatKeyword,
    FunctionKeyword,
    IdentifierToken,
    IntKeyword,
    JsonKeyword,
    NullKeyword,
    StringKeyword,
    StringLiteralToken,
    TemplateString,
    TrueKeyword,
    VarKeyword
} from "@wso2-enterprise/syntax-tree";

import { checkCommentMinutiae, getClassNameForToken, getJSXForMinutiae, getMinutiaeJSX } from "../../../utils";
import { StatementEditorViewState } from "../../../utils/statement-editor-viewstate";
import { InputEditor } from "../../InputEditor";

interface TokenProps {
    model: AsteriskToken
        | FalseKeyword
        | TrueKeyword
        | NullKeyword
        | FunctionKeyword
        | DecimalFloatingPointLiteralToken
        | DecimalIntegerLiteralToken
        | StringLiteralToken
        | BooleanKeyword
        | DecimalKeyword
        | FloatKeyword
        | IntKeyword
        | JsonKeyword
        | StringKeyword
        | VarKeyword
        | IdentifierToken
        | TemplateString;
}

export function TokenComponent(props: TokenProps) {
    const { model } = props;

    const inputEditorProps = {
        model,
        classNames: getClassNameForToken(model)
    };

    const isFieldWithNewLine = (model.viewState as StatementEditorViewState).multilineConstructConfig.isFieldWithNewLine;

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
