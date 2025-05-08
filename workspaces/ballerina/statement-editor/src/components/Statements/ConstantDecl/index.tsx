/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { ConstDeclaration } from "@wso2-enterprise/syntax-tree";

import { CUSTOM_CONFIG_TYPE } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { KeywordComponent } from "../../Keyword";
import { TokenComponent } from "../../Token";

interface ConstantDeclProps {
    model: ConstDeclaration;
}

export function ConstantDeclC(props: ConstantDeclProps) {
    const { model } = props;
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        },
        config
    } = useContext(StatementEditorContext);

    if (!currentModel.model) {
        if (model.initializer) {
            changeCurrentModel(model.initializer);
        } else if (config.type === CUSTOM_CONFIG_TYPE) {
            changeCurrentModel(model);
        }
    }

    return (
        <>
            {model.visibilityQualifier && <KeywordComponent model={model.visibilityQualifier} />}
            <TokenComponent model={model.constKeyword} className={"keyword"} />
            {model.typeDescriptor && <ExpressionComponent model={model.typeDescriptor}/>}
            <ExpressionComponent model={model.variableName}/>
            <TokenComponent model={model.equalsToken} className={"operator"} />
            <ExpressionComponent model={model.initializer}/>
            {!model.semicolonToken.isMissing && <TokenComponent model={model.semicolonToken} />}
        </>
    );
}
