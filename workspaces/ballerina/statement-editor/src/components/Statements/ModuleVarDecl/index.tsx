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

import {
    ConfigurableKeyword,
    FinalKeyword,
    IsolatedKeyword,
    ModuleVarDecl,
    STKindChecker
} from "@wso2-enterprise/syntax-tree";

import { CONNECTOR, CUSTOM_CONFIG_TYPE } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { ExpressionComponent } from "../../Expression";
import { KeywordComponent } from "../../Keyword";
import { TokenComponent } from "../../Token";

interface ModuleVarDeclProps {
    model: ModuleVarDecl;
}

export function ModuleVarDeclC(props: ModuleVarDeclProps) {
    const { model } = props;
    const {
        modelCtx: {
            currentModel,
            changeCurrentModel
        },
        config
    } = useContext(StatementEditorContext);

    if (!currentModel.model) {
        if (
            config.type === CONNECTOR &&
            model &&
            model.initializer &&
            STKindChecker.isCheckExpression(model.initializer) &&
            STKindChecker.isImplicitNewExpression(model.initializer.expression)
        ) {
            if (model.initializer.expression.parenthesizedArgList.arguments?.length > 0) {
                changeCurrentModel(model.initializer.expression.parenthesizedArgList.arguments[0]);
            } else {
                changeCurrentModel(model.initializer.expression.parenthesizedArgList);
            }
        } else if (model.initializer) {
            changeCurrentModel(model.initializer);
        } else if (config.type === CUSTOM_CONFIG_TYPE) {
            changeCurrentModel(model);
        }
    }

    const qualifiers = model.qualifiers.map((qualifier: ConfigurableKeyword | FinalKeyword | IsolatedKeyword) => {
        return (
            <>
                {STKindChecker.isFinalKeyword(qualifier) || STKindChecker.isIsolatedKeyword(qualifier) ?
                    <KeywordComponent model={qualifier}/> :
                    <TokenComponent model={qualifier} className={"keyword"} />
                }
            </>
        )
    });

    return (
        <>
            {model?.metadata && <TokenComponent model={model.metadata} className={"keyword"} />}
            {model.visibilityQualifier && <KeywordComponent model={model.visibilityQualifier}/>}
            {qualifiers}
            <ExpressionComponent model={model.typedBindingPattern} />
            {model?.initializer && (
                <>
                    <TokenComponent model={model.equalsToken} className={"operator"} />
                    <ExpressionComponent model={model.initializer}/>
                </>
            )}
            {/* TODO: use model.semicolonToken.isMissing when the ST interface is supporting */}
            {model.semicolonToken.position.startColumn !== model.semicolonToken.position.endColumn &&
                <TokenComponent model={model.semicolonToken} />}
        </>
    );
}
