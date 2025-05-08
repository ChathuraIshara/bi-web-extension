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

import { Codicon, Icon } from "@wso2-enterprise/ui-toolkit";
import { ActionIconWrapper, ContentSection, DeleteIconWrapper, EditIconWrapper, HeaderLabel, IconTextWrapper, IconWrapper, OptionLabel, disabledHeaderLabel, headerLabelStyles } from "../../../styles";
import { StatusCodeResponse } from "@wso2-enterprise/ballerina-core";
import { getDefaultResponse, HTTP_METHOD } from "../../../utils";

interface ParamItemProps {
    method: HTTP_METHOD;
    response: StatusCodeResponse;
    readonly: boolean;
    hideCode?: boolean;
    onDelete?: () => void;
    onEditClick?: (param: StatusCodeResponse) => void;
}

export function ResponseItem(props: ParamItemProps) {
    const { response, readonly, hideCode, onDelete, onEditClick, method } = props;

    const handleDelete = () => {
        onDelete();
    };
    const handleEdit = () => {
        if (!readonly && !hideCode) {
            onEditClick(response);
        }
    };

    const getFormattedResponse = (response: StatusCodeResponse, method: HTTP_METHOD) => {
        if (response.statusCode.value && (Number(response.statusCode.value) === 200 || Number(response.statusCode.value) === 201)) {
            return getDefaultResponse(method);
        } else {
            return response.statusCode.value || getDefaultResponse(method);
        }
    };

    return (
        <HeaderLabel data-testid={`${response.statusCode.value}-item`}>
            {!hideCode &&
                <IconTextWrapper onClick={handleEdit}>
                    <IconWrapper>
                        <Icon name="header" />
                    </IconWrapper>
                    <OptionLabel>
                        {getFormattedResponse(response, method)}
                    </OptionLabel>
                </IconTextWrapper>
            }
            <ContentSection justifyEnd={hideCode}>
                <div
                    data-test-id={`${response.body.value}-resp`}
                    className={readonly ? disabledHeaderLabel : headerLabelStyles}
                    onClick={handleEdit}
                >
                    {response.body.value || response.type.value}
                </div>
                {!readonly && (
                    <ActionIconWrapper>
                        {!hideCode &&
                            <EditIconWrapper>
                                <Codicon name="edit" onClick={handleEdit} />
                            </EditIconWrapper>
                        }
                        <DeleteIconWrapper>
                            <Codicon name="trash" onClick={handleDelete} />
                        </DeleteIconWrapper>
                    </ActionIconWrapper>
                )}
            </ContentSection>
        </HeaderLabel>
    );
}
