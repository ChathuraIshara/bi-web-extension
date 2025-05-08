/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { ReactNode } from "react";

import {
    TypeDefinition
} from "@wso2-enterprise/syntax-tree";

import { ExpressionComponent } from "../../Expression";
import { KeywordComponent } from "../../Keyword";
import { TokenComponent } from "../../Token";

interface TypeDefProps {
    model: TypeDefinition;
}

export function TypeDefinitionC(props: TypeDefProps) {
    const { model } = props;

    let typeDescriptor: ReactNode;
    if (model?.typeDescriptor) {
        typeDescriptor = (
            <ExpressionComponent
                model={model.typeDescriptor}
            />
        )
    }

    return (
        <>
            {model?.visibilityQualifier && (
                <KeywordComponent model={model?.visibilityQualifier} />
            )}
            <TokenComponent model={model?.typeKeyword} className={"keyword"}/>
            {model?.typeName && (
                <ExpressionComponent model={model?.typeName}/>
            )}
            <span>
                {typeDescriptor}
            </span>
        </>
    );
}
