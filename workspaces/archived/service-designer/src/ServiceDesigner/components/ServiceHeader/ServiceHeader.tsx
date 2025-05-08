/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-submodule-imports
import React from "react";

import { Tooltip, Typography } from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import { ConfigOverlayFormStatus, SettingsIcon } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition, ServiceDeclaration, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

import { useStyles } from "./style";

export interface ServiceHeaderProps {
    model: ServiceDeclaration;
    onClose?: () => void;
    onConfigOpen?: () => void;
    renderRecordPanel: (closeRecordEditor: (createdRecord?: string) => void) => React.JSX.Element;
    handleDiagramEdit: (model: STNode, targetPosition: NodePosition, configOverlayFormStatus: ConfigOverlayFormStatus, onClose?: () => void, onSave?: () => void) => void;
}

export function ServiceHeader(props: ServiceHeaderProps) {
    const { model, onClose, renderRecordPanel, handleDiagramEdit } = props;
    const classes = useStyles();

    let servicePath = "";
    let listeningOnText = "";
    if (model) {
        model.absoluteResourcePath?.forEach(item => {
            servicePath += item.value;
        });

        if (model.expressions.length > 0 && STKindChecker.isExplicitNewExpression(model.expressions[0])) {
            if (STKindChecker.isQualifiedNameReference(model.expressions[0].typeDescriptor)) {
                // serviceType = model.expressions[0].typeDescriptor.modulePrefix.value.toUpperCase();
                listeningOnText = model.expressions[0].source;
            }
        }
    }

    const onEdit = (e?: React.MouseEvent) => {
        e.stopPropagation();
        const lastMemberPosition: NodePosition = {
            endColumn: model.position.endColumn,
            endLine: model.position.endLine - 1,
            startColumn: model.position.startColumn,
            startLine: model.position.startLine - 1
        }
        handleDiagramEdit(model, lastMemberPosition, { formType: "ServiceDeclaration", isLoading: false });
    }

    const handlePlusClick = () => {
        const lastMemberPosition: NodePosition = {
            endColumn: model.closeBraceToken.position.endColumn,
            endLine: model.closeBraceToken.position.endLine,
            startColumn: model.closeBraceToken.position.startColumn,
            startLine: model.closeBraceToken.position.startLine
        }
        handleDiagramEdit(undefined, lastMemberPosition, { formType: "ResourceAccessorDefinition", isLoading: false, renderRecordPanel });
    };

    const handleServiceConfigureFormClick = () => {
        handleDiagramEdit(model, model?.position, { formType: "ServiceDeclaration", isLoading: false });
    }

    return (
        <div className={classes.serviceTitle}>
            <div className={classes.flexRow}>
                <Typography variant="h4">
                    Service {servicePath}
                </Typography>
                <Typography variant="h4" className={classes.listenerText}>
                    {listeningOnText.length > 0 ? ` listening on ${listeningOnText}` : ""}
                </Typography>
            </div>
            <div className={classes.flexRow}>
                <div data-testid="add-resource-btn" className={classes.resourceAdd} onClick={handlePlusClick} >
                    <AddIcon />
                    <div>Resource</div>
                </div>
                <Tooltip title="Service Config" placement="top" enterDelay={1000} enterNextDelay={1000}>
                    <div className={classes.serviceConfigure} onClick={handleServiceConfigureFormClick} >
                        <SettingsIcon onClick={handleServiceConfigureFormClick} />
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
