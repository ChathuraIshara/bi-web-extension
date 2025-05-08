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

import {
    RecordTypeDesc,
    STKindChecker
} from "@wso2-enterprise/syntax-tree";

import { FIELD_DESCRIPTOR } from "../../../../constants";
import { StatementEditorContext } from "../../../../store/statement-editor-context";
import { ExpressionComponent } from "../../../Expression";
import { ExpressionArrayComponent } from "../../../ExpressionArray";
import { TokenComponent } from "../../../Token";

interface RecordTypeDescProps {
    model: RecordTypeDesc;
}

export function RecordTypeDescComponent(props: RecordTypeDescProps) {
    const { model } = props;
    const stmtCtx = useContext(StatementEditorContext);
    const {
        modelCtx: {
            updateModel,
        }
    } = stmtCtx;

    const onClickOnPlusIcon = (event: any) => {
        event.stopPropagation();
        const newPosition = {
            ...model.bodyEndDelimiter.position,
            endColumn: model.bodyEndDelimiter.position.startColumn
        };
        updateModel(`${FIELD_DESCRIPTOR};`, newPosition);
    };

    return (
        <>
            <TokenComponent model={model.recordKeyword} className="keyword" />
            {(model.fields.length === 0) ? (
                // Add plus button when there are no fields
                <TokenComponent model={model.bodyStartDelimiter} isHovered={true} onPlusClick={onClickOnPlusIcon} />
            ) : (
                <TokenComponent model={model.bodyStartDelimiter} />
            )}
            <ExpressionArrayComponent expressions={model.fields} />
            {model.recordRestDescriptor && <ExpressionComponent model={model.recordRestDescriptor} />}
            <span>
                <TokenComponent model={model?.bodyEndDelimiter} />
                {STKindChecker.isTypeDefinition(model?.parent) && model?.parent?.semicolonToken?.value}
            </span>
        </>
    );
}
