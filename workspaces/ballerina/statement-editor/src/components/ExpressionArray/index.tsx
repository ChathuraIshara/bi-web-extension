/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React from "react";

import { STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

import { ArrayType } from "../../constants";
import { ExpressionComponent } from "../Expression";
import { ExpressionArrayElementComponent } from "../ExpressionArrayElement";
import { TokenComponent } from "../Token";

export interface ExpressionArrayProps {
    expressions: STNode[];
    modifiable?: boolean;
    arrayType?: ArrayType;
}

export function ExpressionArrayComponent(props: ExpressionArrayProps) {
    const { expressions, modifiable, arrayType } = props;

    const [hoverIndex, setHoverIndex] = React.useState(null);

    const onMouseEnter = (e: React.MouseEvent , index: number) => {
        setHoverIndex(index);
        e.stopPropagation()
        e.preventDefault();
    }

    const onMouseLeave = (e: React.MouseEvent) => {
        setHoverIndex(null);
        e.stopPropagation()
        e.preventDefault();
    }

    return (
        <span onMouseLeave={onMouseLeave}>
            { expressions.map((expression: STNode, index: number) => {
                return (STKindChecker.isCommaToken(expression))
                ? (
                     <TokenComponent key={index} model={expression} />
                ) : (
                    <ExpressionArrayElementComponent
                        expression={expression}
                        modifiable={modifiable}
                        arrayType={arrayType}
                        index={index}
                        length={expressions.length}
                        onMouseEnterCallback={onMouseEnter}
                        isHovered={hoverIndex === index}
                    >
                        {(index === (expressions.length - 1)) ? (
                            <ExpressionComponent
                                key={index}
                                model={expression}
                                isHovered={true} // Always we need to show the last plus
                            />
                        ) : (
                            <ExpressionComponent
                                key={index}
                                model={expression}
                                isHovered={hoverIndex === index}
                            />
                        )}
                    </ExpressionArrayElementComponent>
                )
            })}
        </span>
    );
}
