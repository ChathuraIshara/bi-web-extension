/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { RecordFieldWithDefaultValue } from "@wso2-enterprise/syntax-tree";

import { FIELD_DESCRIPTOR } from "../../../../constants";
import { StatementEditorContext } from "../../../../store/statement-editor-context";
import { ExpressionComponent } from "../../../Expression";
import { TokenComponent } from "../../../Token";

interface RecordFieldWithDefaultValueProps {
    model: RecordFieldWithDefaultValue;
    isHovered?: boolean;
}

export function RecordFieldWithDefaultValueComponent(props: RecordFieldWithDefaultValueProps) {
    const { model, isHovered } = props;

    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            updateModel,
        }
    } = stmtCtx;

    const onClickOnPlusIcon = (event: any) => {
        event.stopPropagation();
        const newPosition = {
            startLine: model.position.endLine,
            startColumn: model.position.endColumn,
            endLine: model.position.endLine,
            endColumn: model.position.endColumn
        }
        updateModel(`${FIELD_DESCRIPTOR};`, newPosition);
    };

    return (
        <>
            <ExpressionComponent model={model.typeName} />
            <ExpressionComponent model={model.fieldName} />
            <TokenComponent model={model.equalsToken} />
            <ExpressionComponent model={model.expression} />
            <TokenComponent model={model.semicolonToken} isHovered={isHovered} onPlusClick={onClickOnPlusIcon} />
        </>
    );
}
