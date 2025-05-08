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

import { STNode } from "@wso2-enterprise/syntax-tree";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { useStatementRendererStyles } from "../../styles";

export interface AddButtonProps {
    model: STNode;
    onClick?: (model?: STNode) => void;
    classNames?: string;
}

export function NewExprAddButton(props: AddButtonProps) {
    const { model, onClick, classNames } = props;

    const { modelCtx } = useContext(StatementEditorContext);
    const {
        hasSyntaxDiagnostics
    } = modelCtx;

    const statementRendererClasses = useStatementRendererStyles();

    const onClickOnAddButton = () => {
        if (!hasSyntaxDiagnostics) {
            onClick(model);
        }
    };

    return (
        <span
            className={`${statementRendererClasses.plusIcon} ${classNames}`}
            onClick={onClickOnAddButton}
            data-testid="plus-button"
        >
            +
        </span>
    );
}
