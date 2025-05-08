/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { ParamIcon } from "./ParamIcon";
import { CheckBox, Codicon } from "@wso2-enterprise/ui-toolkit";
import { ActionIconWrapper, ContentSection, DeleteIconWrapper, EditIconWrapper, HeaderLabel, IconTextWrapper, IconWrapper, OptionLabel, disabledHeaderLabel, headerLabelStyles } from "../../../styles";
import { ParameterModel } from "@wso2-enterprise/ballerina-core";

interface ParamItemProps {
    param: ParameterModel;
    readonly?: boolean;
    onDelete: (param: ParameterModel) => void;
    onEditClick: (param: ParameterModel) => void;
}

export function ParamItem(props: ParamItemProps) {
    const { param, readonly, onDelete, onEditClick } = props;

    const label = param?.type.value ? `${param.type.value} ${param.name.value}${param.defaultValue?.value ? ` = ${param.defaultValue.value}` : ""}`
        : `${param.name.value}`;

    const handleDelete = () => {
        onDelete(param);
    };
    const handleEdit = () => {
        if (!readonly) {
            onEditClick(param);
        }
    };

    const haveErrors = () => {
        // Handle errors
    }

    return (
        <HeaderLabel haveErrors={haveErrors()} data-testid={`${label}-item`}>
            <IconTextWrapper onClick={handleEdit}>
                <IconWrapper>
                    <ParamIcon option={param?.httpParamType?.toLowerCase()} />
                </IconWrapper>
                <OptionLabel>
                    {param?.httpParamType ? param?.httpParamType.toUpperCase() : param?.metadata?.label.toUpperCase()}
                </OptionLabel>
            </IconTextWrapper>
            <ContentSection>
                <div
                    data-test-id={`${label}-param`}
                    className={readonly ? disabledHeaderLabel : headerLabelStyles}
                    onClick={handleEdit}
                >
                    {label}
                </div>
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
            </ContentSection>
        </HeaderLabel>
    );
} ``
