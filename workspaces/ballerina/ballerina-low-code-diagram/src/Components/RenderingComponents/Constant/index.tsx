/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useEffect, useState } from "react"

import { ConstantIcon, DeleteButton, EditButton } from "@wso2-enterprise/ballerina-core";
import { ConstDeclaration, STNode } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";

import { Context } from "../../../Context/diagram";

import "./style.scss";

export const MODULE_VAR_MARGIN_LEFT: number = 24.5;
export const MODULE_VAR_PLUS_OFFSET: number = 7.5;
export const MODULE_VAR_HEIGHT: number = 49;
export const MIN_MODULE_VAR_WIDTH: number = 275;

export interface ConstantProps {
    model: STNode;
}

export function Constant(props: ConstantProps) {
    const { model } = props;
    const diagramContext = useContext(Context);
    const deleteComponent = diagramContext?.api?.edit?.deleteComponent;
    const renderEditForm = diagramContext?.api?.edit?.renderEditForm;
    const showTooltip = diagramContext?.api?.edit?.showTooltip;
    const [tooltip, setTooltip] = useState(undefined);

    const constModel: ConstDeclaration = model as ConstDeclaration;
    const varType = "const";
    const varName = constModel.variableName.value;
    const varValue = constModel.initializer.source.trim();

    const typeMaxWidth = varType.length >= 10;
    const nameMaxWidth = varName.length >= 20;

    const handleDeleteBtnClick = () => {
        if (deleteComponent) {
            deleteComponent(model);
        }
    }

    const handleEditBtnClick = () => {
        if (renderEditForm) {
            renderEditForm(model, model.position, {
                formType: model.kind,
                isLoading: false
            });
        }
    }

    const typeText = (
        <tspan x="0" y="0">{typeMaxWidth ? varType.slice(0, 10) + "..." : varType}</tspan>
    );


    useEffect(() => {
        if (model && showTooltip) {
            setTooltip(showTooltip(typeText, model.source.slice(1, -1)));
        }
    }, [model]);


    return (
        <div>
            <div
                className={"const-container"}
                data-test-id="const"
                data-const-name={varName}
            >
                <div className={"const-wrapper"}>
                    <div className={"const-icon"}>
                        <ConstantIcon />
                    </div>
                    <div className={"const-type-text"}>
                        {tooltip ? tooltip : typeText}
                    </div>
                    <div className={"const-name-text"}>
                        <tspan x="0" y="0">{nameMaxWidth ? varName.slice(0, 20) + "..." : varName}</tspan>
                    </div>
                </div>
                <div className="amendment-options">
                    <div className={classNames("edit-btn-wrapper", "show-on-hover")}>
                        <EditButton onClick={handleEditBtnClick} />
                    </div>
                    <div className={classNames("delete-btn-wrapper", "show-on-hover")}>
                        <DeleteButton onClick={handleDeleteBtnClick} />
                    </div>
                </div>
            </div>
        </div>
    );
}
