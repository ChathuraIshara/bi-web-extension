/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useEffect, useState } from "react";

import { Tooltip } from "@material-ui/core";
import {
    ComponentViewInfo, DesignViewIcon, EditIcon, ErrorIcon, LabelDeleteIcon, LabelEditIcon, STModification, WarningIcon
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ComponentExpandButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition, ResourceAccessorDefinition } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";

import { ResourceQueryParams } from "./ResourceQueryParams";
import "./style.scss";


interface ResourceHeaderProps {
    model: ResourceAccessorDefinition;
    onExpandClick: () => void;
    isExpanded: boolean;
    onEdit: () => void;
    onDelete: () => void;
    handleResourceDefInternalNav: (model: ResourceAccessorDefinition) => void;
}

export function ResourceHeader(props: ResourceHeaderProps) {
    const { model, onExpandClick, isExpanded, onEdit, onDelete, handleResourceDefInternalNav } = props;

    const handleResourceHeaderClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        handleResourceDefInternalNav(model);
    }

    return (
        <div
            className={classNames("function-signature", model.functionName.value)}
            onClick={onExpandClick}
        >
            <div className={classNames("resource-badge", model.functionName.value)}>
                <p className={"text"}><b> {model.functionName.value.toUpperCase()} </b></p>
            </div>
            <div className="param-wrapper">
                <ResourceQueryParams
                    parameters={model.functionSignature.parameters}
                    relativeResourcePath={model.relativeResourcePath}
                />
            </div>
            <Tooltip title="Low-Code view" placement="right" enterDelay={1000} enterNextDelay={1000}>
                <div className="menu-option" onClick={handleResourceHeaderClick}>
                    <div className={classNames("icon", "icon-adjust")}>
                        <DesignViewIcon />
                    </div>
                </div>
            </Tooltip>
            <Tooltip title="Edit resource" placement="right" enterDelay={1000} enterNextDelay={1000}>
                <div className="menu-option" onClick={onEdit}>
                    <div className={classNames("icon", "icon-adjust")}>
                        <LabelEditIcon />
                    </div>
                </div>
            </Tooltip>
            <Tooltip title="Delete resource" placement="right" enterDelay={1000} enterNextDelay={1000}>
                <div
                    onClick={onDelete}
                    className={classNames("menu-option", "right")}
                    id="delete-button"
                >
                    <div className={classNames("icon", "icon-adjust")}>
                        <LabelDeleteIcon />
                    </div>
                </div>
            </Tooltip>
            <ComponentExpandButton
                isExpanded={isExpanded}
                onClick={onExpandClick}
            />
        </div >
    );
}
