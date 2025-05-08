/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { NamedArg } from "@wso2-enterprise/syntax-tree";

import { ModelType, StatementEditorViewState } from "../../../utils/statement-editor-viewstate";
import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface NamedArgProps {
    model: NamedArg;
}

export function NamedArgComponent(props: NamedArgProps) {
    const { model } = props;

    return (
        <>
            <ExpressionComponent model={model.argumentName} />
            <TokenComponent
                model={model.equalsToken}
                className={((model.equalsToken.viewState as StatementEditorViewState).modelType = ModelType.OPERATOR) && "operator"}
            />
            <ExpressionComponent model={model.expression} />
        </>
    );
}
