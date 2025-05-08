/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { STNode } from "@wso2-enterprise/syntax-tree";

import { useStatementRendererStyles } from "../../styles";

export interface ExprDeleteButtonProps {
    model: STNode;
    onClick?: (model?: STNode) => void;
    classNames?: string;
}

export function ExprDeleteButton(props: ExprDeleteButtonProps) {
    const { model, onClick, classNames } = props;

    const statementRendererClasses = useStatementRendererStyles();

    const onClickOnMinusButton = () => {
        onClick(model);
    };

    return (
        <span
            className={`${statementRendererClasses.plusIcon} ${classNames}`}
            onClick={onClickOnMinusButton}
            data-testid="minus-button"
        >
            -
        </span>
    );
}
