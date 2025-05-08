/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import {
    ActionIconWrapper,
    ActionWrapper,
    DeleteIconWrapper,
    EditIconWrapper,
    HeaderLabel,
    ContentWrapper,
    KeyTextWrapper,
    ValueTextWrapper,
    IconWrapper,
    IconTextWrapper,
    TypeWrapper,
    Key
} from "./styles";
import { Parameter } from "./ParamManager";
import { Codicon, Icon } from "@wso2-enterprise/ui-toolkit";

interface ParamItemProps {
    param: Parameter;
    readonly?: boolean;
    onDelete?: (param: Parameter) => void;
    onEditClick?: (param: Parameter) => void;
}

export function ParamItem(props: ParamItemProps) {
    const { param, readonly, onDelete, onEditClick } = props;
    const { formValues, key } = param;

    const type = formValues["type"] || "";
    const identifier = formValues["variable"] || key;

    let label = key;

    const handleDelete = () => {
        onDelete(param);
    };
    const handleEdit = () => {
        if (!readonly) {
            onEditClick(param);
        }
    };
    const icon = (typeof param.icon === "string") ? <Icon name={param.icon} /> : param.icon;

    return (
        <HeaderLabel data-testid={`${label}-item`}>
            <ContentWrapper readonly={readonly} onClick={handleEdit}>
                {icon ? (
                    <IconTextWrapper>
                        <IconWrapper> {icon} </IconWrapper>
                        <TypeWrapper title={type}> {type} </TypeWrapper>
                    </IconTextWrapper>
                ) : (
                    <KeyTextWrapper>
                        <Key title={type}> {type} </Key>
                    </KeyTextWrapper>
                )}
                <ValueTextWrapper title={identifier}> {identifier} </ValueTextWrapper>
            </ContentWrapper>
            <ActionWrapper>
                {!readonly && (
                    <ActionIconWrapper>
                        <EditIconWrapper>
                            <Codicon name="edit" onClick={handleEdit} />
                        </EditIconWrapper>
                        <DeleteIconWrapper>
                            <Codicon name="trash" onClick={handleDelete} />
                        </DeleteIconWrapper>
                    </ActionIconWrapper>
                )}
            </ActionWrapper>
        </HeaderLabel>
    );
}
