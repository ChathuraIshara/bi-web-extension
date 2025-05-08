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
import { Codicon } from "@wso2-enterprise/ui-toolkit";
import { ActionIconWrapper, ContentSection, DeleteIconWrapper, EditIconWrapper, HeaderLabel, IconTextWrapper, IconWrapper, OptionLabel, disabledHeaderLabel, headerLabelStyles } from "../../styles";
import { RESOURCE_CHECK, useServiceDesignerContext } from "../../Context";
import { ParameterConfig } from "../../utils/definitions";

interface ParamItemProps {
    param: ParameterConfig;
    readonly?: boolean;
    onDelete?: (param: ParameterConfig) => void;
    onEditClick?: (param: ParameterConfig) => void;
}

export function ParamItem(props: ParamItemProps) {
    const { param, readonly, onDelete, onEditClick } = props;
    const { diagnostics, dPosition } = useServiceDesignerContext();

    const label = param?.type ? `${param.type} ${param.name}${param.defaultValue ? ` = ${param.defaultValue}` : ""}`
        : `${param.name}`;
    const handleDelete = () => {
        onDelete(param);
    };
    const handleEdit = () => {
        if (!readonly) {
            onEditClick(param);
        }
    };

    const haveErrors = () => {
        const resourceErrors = diagnostics.filter(diag => diag.range.start.line === dPosition.startLine);
        const haveName = resourceErrors.filter(diag => diag.message.includes(param.name));
        const haveDefault = resourceErrors.filter(diag => diag.message.includes(RESOURCE_CHECK.INCOMPATIBLE) || diag.message.includes(RESOURCE_CHECK.UNDEFINED));
        return haveName.length > 0 || haveDefault.length > 0;
    }

    return (
        <HeaderLabel haveErrors={haveErrors()} data-testid={`${label}-item`}>
            <IconTextWrapper onClick={handleEdit}>
                <IconWrapper>
                    <ParamIcon option={param?.option?.toLowerCase()} />
                </IconWrapper>
                <OptionLabel>
                    {param?.option?.toUpperCase()}
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
