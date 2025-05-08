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

import { ArrayTypeDesc } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../../store/statement-editor-context";
import { ExpressionComponent } from "../../../Expression";

interface RecordTypeDescProps {
    model: ArrayTypeDesc;
}

export function ArrayTypeDescComponent(props: RecordTypeDescProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            updateModel,
        }
    } = stmtCtx;

    let dimensionSource = "";
    model?.dimensions.forEach(value => {
        dimensionSource += value.source;
    })

    return (
        <>
            {model?.memberTypeDesc && (
                <ExpressionComponent
                    model={model.memberTypeDesc}
                />
            )}
            {model?.dimensions && (
                dimensionSource
            )}
        </>
    );
}
