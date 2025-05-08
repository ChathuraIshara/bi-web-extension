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

import { Codicon } from "../Codicon/Codicon";
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
    Key
} from "./styles";
import { Parameters } from "./ParamManager";
import { Icon } from "../Icon/Icon";

interface ParamItemProps {
    params: Parameters;
    readonly?: boolean;
    onDelete?: (param: Parameters) => void;
    onEditClick?: (param: Parameters) => void;
}

export function ParamItem(props: ParamItemProps) {
    const { params, readonly, onDelete, onEditClick } = props;

    let label = "";
    params.parameters.forEach((param, index) => {
        if (index !== 0) {
            label += param?.value + "   ";
        }
    });
    const handleDelete = () => {
        onDelete(params);
    };
    const handleEdit = () => {
        if (!readonly) {
            onEditClick(params);
        }
    };
    const icon = (typeof params.icon === "string") ? <Icon name={params.icon} /> : params.icon;

    return (
        <HeaderLabel data-testid={`${label}-item`}>
            <ContentWrapper readonly={readonly} onClick={handleEdit}>
                {icon ? (
                    <IconTextWrapper>
                        <IconWrapper> {icon} </IconWrapper>
                        {params.key}
                    </IconTextWrapper>
                ) : (
                    <KeyTextWrapper>
                        <Key> {params.key} </Key>
                    </KeyTextWrapper>
                )}
                <ValueTextWrapper> {params.value} </ValueTextWrapper>
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
