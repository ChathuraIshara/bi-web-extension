/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { AsteriskToken,
    BitwiseAndToken,
    BitwiseXorToken,
    DoubleDotLtToken,
    DoubleEqualToken,
    DoubleGtToken,
    DoubleLtToken,
    EllipsisToken,
    ElvisToken,
    GtEqualToken,
    GtToken,
    LogicalAndToken,
    LogicalOrToken,
    LtEqualToken,
    LtToken,
    NotDoubleEqualToken,
    NotEqualToken,
    PercentToken,
    PipeToken,
    PlusToken,
    SlashToken,
    TrippleEqualToken,
    TrippleGtToken } from "@wso2-enterprise/syntax-tree";
import cn from "classnames";

import { StatementEditorContext } from "../../store/statement-editor-context";
import { getMinutiaeJSX, isPositionsEquals } from "../../utils";
import { InputEditor } from "../InputEditor";
import { useStatementRendererStyles } from "../styles";

export interface OperatorProps {
    model:  AsteriskToken |
            BitwiseAndToken |
            BitwiseXorToken |
            DoubleDotLtToken |
            DoubleEqualToken |
            DoubleGtToken |
            DoubleLtToken |
            EllipsisToken |
            ElvisToken |
            GtEqualToken |
            GtToken |
            LogicalAndToken |
            LogicalOrToken |
            LtEqualToken |
            LtToken |
            NotDoubleEqualToken |
            NotEqualToken |
            PercentToken |
            PipeToken |
            PlusToken |
            SlashToken |
            TrippleEqualToken |
            TrippleGtToken;
}

export function OperatorComponent(props: OperatorProps) {
    const { model } = props;

    const [isHovered, setHovered] = React.useState(false);

    const { modelCtx } = useContext(StatementEditorContext);
    const {
        currentModel: selectedModel,
        changeCurrentModel,
        hasSyntaxDiagnostics
    } = modelCtx;

    const statementRenedererClasses = useStatementRendererStyles();

    const isSelected = selectedModel.model && model && isPositionsEquals(selectedModel.model.position, model.position);

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
            changeCurrentModel(model);
        }
    }

    const styleClassNames = cn(statementRenedererClasses.expressionElement,
        isSelected && statementRenedererClasses.expressionElementSelected,
        {
            "hovered": !isSelected && isHovered && !hasSyntaxDiagnostics,
        },
    )
    const inputEditorProps = {
        model,
        classNames: "operator",
        notEditable: true
    };

    const { leadingMinutiaeJSX, trailingMinutiaeJSX } = getMinutiaeJSX(model);

    return (
        <span
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            className={styleClassNames}
            onClick={onMouseClick}
        >
            {leadingMinutiaeJSX}
            <InputEditor {...inputEditorProps} />
            {trailingMinutiaeJSX}
        </span>
    );
}
