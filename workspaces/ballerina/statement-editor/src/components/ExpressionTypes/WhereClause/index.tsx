/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React from "react";

import { STNode, WhereClause } from "@wso2-enterprise/syntax-tree";

import { DEFAULT_INTERMEDIATE_CLAUSE } from "../../../constants";
import { getMinutiaeJSX } from "../../../utils";
import { ExpressionComponent } from "../../Expression";
import { TokenComponent } from "../../Token";

interface WhereClauseProps {
    model: WhereClause;
}

export function WhereClauseComponent(props: WhereClauseProps) {
    const { model } = props;

    const exprModel: STNode = {
        ...model.expression,
        position: model.position
    }

    const { leadingMinutiaeJSX } = getMinutiaeJSX(model);

    return (
        <>
            {model.expression?.source?.includes(DEFAULT_INTERMEDIATE_CLAUSE) ?
                <>
                    {leadingMinutiaeJSX}
                    <ExpressionComponent model={exprModel}/>
                </>
                : (
                    <>
                        <TokenComponent model={model.whereKeyword} className={"keyword"}/>
                        <ExpressionComponent model={model.expression}/>
                    </>
                )}
        </>
    );
}
