/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React, { useState } from 'react';

import { Codicon, LinkButton } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { ParamEditor } from '../ResourceParam/ParamEditor';
import { ParamItem } from '../ResourceParam/ParamItem';
import { PARAM_TYPES, ParameterConfig } from '../../utils/definitions';

export interface ResourceParamProps {
    parameter: ParameterConfig;
    onChange?: (parameters: ParameterConfig) => void,
    readonly?: boolean;
}

const AddButtonWrapper = styled.div`
	margin: 8px 0;
`;

export function Payload(props: ResourceParamProps) {
    const { parameter, readonly, onChange } = props;
    const [editInprogress, setEditInprogress] = useState(false);

    const onEdit = () => {
        setEditInprogress(true);
    };

    const onAddClick = () => {
        setEditInprogress(true);
        const newParam: ParameterConfig = {
            id: 0,
            name: "param",
            type: "string",
            option: PARAM_TYPES.PAYLOAD,
            defaultValue: "",
            isRequired: true
        };
        onChange(newParam);
    };

    const onDelete = () => {
        onChange(undefined);
    };

    const onChangeParam = (param: ParameterConfig) => {
        onChange(param);
    };

    const onSaveParam = (param: ParameterConfig) => {
        onChange(param);
        setEditInprogress(false);
    };

    const onParamEditCancel = () => {
        setEditInprogress(false);
    };

    return (
        <div>
            {editInprogress ? (
                <ParamEditor
                    param={{
                        id: 0,
                        name: parameter.name,
                        type: parameter.type,
                        option: PARAM_TYPES.PAYLOAD,
                        defaultValue: parameter.defaultValue,
                        isRequired: parameter.isRequired
                    }}
                    isEdit={true}
                    option={parameter.option}
                    onSave={onSaveParam}
                    onChange={onChangeParam}
                    onCancel={onParamEditCancel}
                />
            ) : (
                <>
                    {parameter ? (
                        <ParamItem
                            param={{
                                id: 0,
                                name: parameter.name,
                                type: parameter.type,
                                option: parameter.option,
                                defaultValue: parameter.defaultValue,
                                isRequired: parameter.isRequired
                            }}
                            readonly={readonly}
                            onDelete={onDelete}
                            onEditClick={onEdit}
                        />
                    ) : (
                        <AddButtonWrapper>
                            <LinkButton sx={readonly && { color: "var(--vscode-badge-background)" }} onClick={!readonly && onAddClick} >
                                <Codicon name="add" />
                                <>Add Payload</>
                            </LinkButton>
                        </AddButtonWrapper>
                    )}
                </>
            )}
        </div>
    );
}
