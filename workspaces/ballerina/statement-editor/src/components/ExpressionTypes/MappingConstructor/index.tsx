/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React, { useContext } from "react";

import { MappingConstructor, NodePosition } from "@wso2-enterprise/syntax-tree";

import { ArrayType, MAPPING_CONSTRUCTOR } from "../../../constants";
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { NewExprAddButton } from "../../Button/NewExprAddButton";
import { ExpressionArrayComponent } from "../../ExpressionArray";
import { TokenComponent } from "../../Token";

interface MappingConstructorProps {
    model: MappingConstructor;
}

export function MappingConstructorComponent(props: MappingConstructorProps) {
    const { model } = props;

    const {
        modelCtx: {
            updateModel,
        }
    } = useContext(StatementEditorContext);

    const isSingleLine = model.position.startLine === model.position.endLine;
    const isEmpty = model.fields.length === 0;

    const addNewExpression = () => {
        const expressionTemplate = MAPPING_CONSTRUCTOR;
        const newField = isEmpty ? expressionTemplate : `,\n${expressionTemplate}`;
        const newPosition: NodePosition = isEmpty
            ? {
                ...model.closeBrace.position,
                endColumn: model.closeBrace.position.startColumn
            }
            : {
                startLine: model.fields[model.fields.length - 1].position.endLine,
                startColumn:  model.fields[model.fields.length - 1].position.endColumn,
                endLine: model.closeBrace.position.startLine,
                endColumn: model.closeBrace.position.startColumn
            }
        updateModel(newField, newPosition);
    };

    return (
        <>
            <TokenComponent model={model.openBrace} />
            <ExpressionArrayComponent
                expressions={model.fields}
                modifiable={!isSingleLine}
                arrayType={ArrayType.MAPPING_CONSTRUCTOR}
            />
            {(isEmpty || isSingleLine) && (<NewExprAddButton model={model} onClick={addNewExpression} />)}
            <TokenComponent model={model.closeBrace} />
        </>
    );
}
