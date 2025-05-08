/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import cn from "classnames";

import SyntaxErrorWarning from "../../assets/icons/SyntaxErrorWarning";
import { StatementEditorContext } from "../../store/statement-editor-context";
import { getExpressionTypeComponent, isPlaceHolderExists, isPositionsEquals } from "../../utils";
import { useStatementRendererStyles } from "../styles";


export interface ExpressionComponentProps {
    model: STNode;
    children?: React.ReactElement[];
    classNames?: string;
    stmtPosition?: NodePosition;
    isHovered?: boolean;
    onPlusClick?: (evt: any) => void;
}

export function ExpressionComponent(props: ExpressionComponentProps) {
    const { model, children, classNames, stmtPosition, isHovered: hovered } = props;

    const component = getExpressionTypeComponent(model, stmtPosition, hovered);

    const [isHovered, setHovered] = React.useState(false);

    const { modelCtx, isExpressionMode } = useContext(StatementEditorContext);
    const {
        currentModel: selectedModel,
        changeCurrentModel,
        hasSyntaxDiagnostics,
        statementModel
    } = modelCtx;

    const statementRendererClasses = useStatementRendererStyles();

    if (isExpressionMode && !selectedModel.model) {
        changeCurrentModel(statementModel);
    }

    const isSelected = selectedModel.model && model &&
        (isPositionsEquals(selectedModel.model.position, model.position) ||
            (isPositionsEquals(selectedModel.model.position, statementModel.position)));
    const hasError = model?.viewState?.diagnosticsInPosition?.length > 0 && !isPlaceHolderExists(model?.source ? model.source : model?.value);

    const onMouseOver = (e: React.MouseEvent) => {
        setHovered(true);
        e.stopPropagation();
        e.preventDefault();
    }

    const onMouseOut = (e: React.MouseEvent) => {
        setHovered(false);
        e.stopPropagation();
        e.preventDefault();
    }

    const onMouseClick = (e: React.MouseEvent) => {
        if (!hasSyntaxDiagnostics) {
            e.stopPropagation();
            e.preventDefault();
            changeCurrentModel(model, stmtPosition, e.shiftKey);
        }
    }

    const isIdenticalNode = isPositionsEquals(model.position, model.parent.position);

    const styleClassNames = cn(statementRendererClasses.expressionElement,
        isSelected && !hasSyntaxDiagnostics && statementRendererClasses.expressionElementSelected,
        isSelected && hasSyntaxDiagnostics && !isIdenticalNode && statementRendererClasses.syntaxErrorElementSelected,
        {
            "hovered": !isSelected && isHovered && !hasSyntaxDiagnostics,
        },
        hasError && statementRendererClasses.errorHighlight,
        classNames
    )

    return (
        <>
            <span
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                className={styleClassNames}
                onClick={onMouseClick}
                data-testid={model.kind}
            >
                {isSelected && hasSyntaxDiagnostics && !isIdenticalNode && (
                    <span className={statementRendererClasses.syntaxErrorTooltip} data-testid="syntax-error-highlighting">
                        <SyntaxErrorWarning />
                    </span>
                )}
                {component}
                {children}
            </span>
        </>
    );
}
