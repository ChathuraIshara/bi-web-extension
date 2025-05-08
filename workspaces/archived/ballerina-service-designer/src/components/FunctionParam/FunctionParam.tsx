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
import { ParamEditor } from './ParamEditor';
import { ParamItem } from './ParamItem';
import { PARAM_TYPES, ParameterConfig } from '../../utils/definitions';

export interface FunctionParamProps {
    parameters: ParameterConfig[];
    onChange?: (parameters: ParameterConfig[]) => void,
    readonly?: boolean;
    isFixed?: boolean;
}

const AddButtonWrapper = styled.div`
	margin: 8px 0;
`;

export function FunctionParam(props: FunctionParamProps) {
    const { parameters, readonly, onChange, isFixed } = props;
    const [editingSegmentId, setEditingSegmentId] = useState<number>(-1);
    const [isNew, setIsNew] = useState(false);

    const onEdit = (param: ParameterConfig) => {
        setIsNew(false);
        setEditingSegmentId(param.id);
    };

    const onAddClick = () => {
        const updatedParameters = [...parameters];
        setEditingSegmentId(updatedParameters.length);
        const newParam: ParameterConfig = {
            id: updatedParameters.length,
            name: "param",
            type: "string",
            option: PARAM_TYPES.PARAM,
            defaultValue: "",
            isRequired: true,
            isNew: true
        };
        updatedParameters.push(newParam);
        onChange!(updatedParameters);
        setIsNew(true);
    };

    const onDelete = (param: ParameterConfig) => {
        const updatedParameters = [...parameters];
        const indexToRemove = param.id;
        if (indexToRemove >= 0 && indexToRemove < updatedParameters.length) {
            updatedParameters.splice(indexToRemove, 1);
        }
        const reArrangedParameters = updatedParameters.map((item, index) => ({
            ...item,
            id: index
        }));
        onChange!(reArrangedParameters);
    };

    const onChangeParam = (paramConfig: ParameterConfig) => {
        const updatedParameters = [...parameters];
        const index = updatedParameters.findIndex(param => param.id === paramConfig.id);
        if (index !== -1) {
            updatedParameters[index] = paramConfig;
        }
        onChange!(updatedParameters);
    };

    const onSaveParam = (paramConfig: ParameterConfig) => {
        onChangeParam(paramConfig);
        setEditingSegmentId(-1);
    };

    const onParamEditCancel = (param: ParameterConfig) => {
        setEditingSegmentId(-1);
        if (isNew) {
            onDelete(param);
        }
        setIsNew(false);
    };

    const paramComponents: React.ReactElement[] = [];
    parameters
        .forEach((param: ParameterConfig, index) => {
            if (editingSegmentId === index) {
                paramComponents.push(
                    <ParamEditor
                        param={{
                            id: index,
                            name: param.name,
                            type: param.type,
                            option: param.option,
                            defaultValue: param.defaultValue,
                            isRequired: param.isRequired
                        }}
                        isEdit={!param.isNew}
                        option={param.option}
                        isTypeReadOnly={false}
                        onSave={onSaveParam}
                        onChange={onChangeParam}
                        onCancel={onParamEditCancel}
                    />
                )
            } else if ((editingSegmentId !== index)) {
                paramComponents.push(
                    <ParamItem
                        param={{
                            id: index,
                            name: param.name,
                            type: param.type,
                            option: param.option,
                            defaultValue: param.defaultValue
                        }}
                        readonly={editingSegmentId !== -1 || readonly}
                        onDelete={onDelete}
                        onEditClick={onEdit}
                    />
                );
            }
        });

    return (
        <div>
            {paramComponents}
            {(editingSegmentId === -1) && !isFixed && (
                <AddButtonWrapper>
                    <LinkButton sx={readonly && { color: "var(--vscode-badge-background)" }} onClick={!readonly && onAddClick} >
                        <Codicon name="add" />
                        <>Add Parameter</>
                    </LinkButton>
                </AddButtonWrapper>
            )}
        </div>
    );
}
