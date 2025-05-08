/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import {
    FunctionDefinition,
    STKindChecker,
} from "@wso2-enterprise/syntax-tree";

import { ExprBodiedFuncComponent } from "./ExpressionBodiedFuction";
import { RegularFuncComponent } from "./RegularFunction";

export interface FunctionProps {
    model: FunctionDefinition;
    hideHeader?: boolean;
}


export function Function(props: FunctionProps) {
    const { model, hideHeader } = props;

    const isExpressionFuncBody: boolean = STKindChecker.isExpressionFunctionBody(
        model.functionBody
    );

    return (
        <>
            {isExpressionFuncBody ? (
                <ExprBodiedFuncComponent
                    model={model}
                />
            ) : (
                <RegularFuncComponent
                    model={model}
                    hideHeader={hideHeader}
                />
            )}
        </>
    );
}
