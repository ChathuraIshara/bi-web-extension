/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext } from "react";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Context/diagram";

import { EditSVG } from "./EditSVG";
import "./style.scss";

export interface EditBtnProps {
    cx: number;
    cy: number;
    model: STNode;
    onHandleEdit?: () => void;
    className?: string;
    height?: number;
    width?: number;
    // dispatchEditComponentStart: (targetPosition: any) => void;
    isButtonDisabled?: boolean;
}

export function EditBtn(props: EditBtnProps) {
    const {
        props: { isReadOnly },
        actions: { editorComponentStart: dispatchEditComponentStart },
        state: { targetPosition }
    } = useContext(Context);
    const { cx, cy, onHandleEdit, model, isButtonDisabled } = props;
    const onEditClick = () => {
        if (!isButtonDisabled) {
            const targetPos = targetPosition as NodePosition;
            if (model &&
                (targetPos?.startLine !== model.position.startLine
                    || targetPos?.startColumn !== model.position.startColumn)) {
                dispatchEditComponentStart({
                    ...model.position,
                    endLine: 0,
                    endColumn: 0,
                })
            }
            onHandleEdit();
        }
    };

    if (isReadOnly) return null;

    return (
        <g onClick={onEditClick} className="edit-icon-wrapper" data-testid="editBtn">
            <g>
                <EditSVG x={cx} y={cy} />
            </g>
        </g>
    )

}
