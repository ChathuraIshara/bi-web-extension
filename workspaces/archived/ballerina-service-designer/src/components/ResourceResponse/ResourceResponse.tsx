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
import { ResponseItem } from './ResponseItem';
import { ResponseEditor } from './ResponseEditor';
import { HTTP_METHOD, getDefaultResponse, getResponseRecordCode, getResponseRecordDefCode, getSourceFromResponseCode } from '../../utils/utils';
import { NodePosition } from '@wso2-enterprise/syntax-tree';
import { CommonRPCAPI, STModification } from '@wso2-enterprise/ballerina-core';
import { ResponseConfig } from '../../utils/definitions';

export interface ResourceParamProps {
    method: HTTP_METHOD;
    response: ResponseConfig[];
    isBallerniaExt?: boolean;
    onChange?: (parameters: ResponseConfig[]) => void;
    addNameRecord?: (source: string) => void;
    serviceEndPosition?: NodePosition;
    commonRpcClient?: CommonRPCAPI;
    readonly?: boolean;
    applyModifications?: (modifications: STModification[]) => Promise<void>;
}

const AddButtonWrapper = styled.div`
	margin: 8px 0;
`;

export function ResourceResponse(props: ResourceParamProps) {
    const { method, response, isBallerniaExt, readonly, onChange, addNameRecord, serviceEndPosition, commonRpcClient, applyModifications } = props;
    const [editingSegmentId, setEditingSegmentId] = useState<number>(-1);
    const [isNew, setIsNew] = useState(false);

    const onEdit = (param: ResponseConfig) => {
        setEditingSegmentId(param.id);
    };

    const onAddClick = () => {
        const updatedParameters = [...response];
        setEditingSegmentId(updatedParameters.length);
        const newResp: ResponseConfig = {
            id: updatedParameters.length,
            code: getDefaultResponse(method),
            isNew: true
        };
        updatedParameters.push(newResp);
        onChange(updatedParameters);
        setIsNew(true);
    };

    const onDelete = (param: ResponseConfig) => {
        const updatedParameters = [...response];
        const indexToRemove = param.id;
        if (indexToRemove >= 0 && indexToRemove < updatedParameters.length) {
            updatedParameters.splice(indexToRemove, 1);
        }
        const reArrangedParameters = updatedParameters.map((item, index) => ({
            ...item,
            id: index
        }));
        onChange(reArrangedParameters);
    };

    const onChangeParam = (paramConfig: ResponseConfig) => {
        const updatedParameters = [...response];
        const index = updatedParameters.findIndex(param => param.id === paramConfig.id);
        if (index !== -1) {
            updatedParameters[index] = paramConfig;
        }
        onChange(updatedParameters);
    };

    const onSaveParam = (paramConfig: ResponseConfig, defineRecordName: string) => {
        const updatedParameters = [...response];
        let modifiedParamConfig: ResponseConfig;
        if (paramConfig.type && (paramConfig.code !== getDefaultResponse(method)) && !paramConfig.type.includes("error")) {
            modifiedParamConfig = {
                ...paramConfig,
                source: getResponseRecordCode(paramConfig.code as number, paramConfig.type)
            };
        } else if (paramConfig.type && (paramConfig.code === getDefaultResponse(method))) {
            modifiedParamConfig = {
                ...paramConfig,
                source: paramConfig.type
            };
        } else if (paramConfig.source) {
            modifiedParamConfig = {
                ...paramConfig,
                source: paramConfig.source,
            };
        } else {
            modifiedParamConfig = {
                ...paramConfig,
                source: getSourceFromResponseCode(paramConfig.code as number)
            };
        }
        if (paramConfig.type === "error" || paramConfig.type === "error?") {
            modifiedParamConfig = {
                ...modifiedParamConfig,
                code: 500
            };
        }
        if (defineRecordName && paramConfig.type) {
            modifiedParamConfig = {
                ...modifiedParamConfig,
                code: paramConfig.code,
                type: paramConfig.type,
                source: defineRecordName
            };
            if (defineRecordName !== paramConfig.namedRecord) {
                const recordCode = getResponseRecordDefCode(defineRecordName, paramConfig.code as number, paramConfig.type);
                addNameRecord(recordCode);
            }
        }
        const index = updatedParameters.findIndex(param => param.id === paramConfig.id);
        if (index !== -1) {
            updatedParameters[index] = modifiedParamConfig;
        }
        setEditingSegmentId(-1);
        setIsNew(false);
        onChange(updatedParameters);
    };

    const onParamEditCancel = (id?: number) => {
        setEditingSegmentId(-1);
        if (isNew) {
            onDelete({ id });
        }
        setIsNew(false);
    };

    const paramComponents: React.ReactElement[] = [];
    response
        .forEach((param: ResponseConfig, index) => {
            if (editingSegmentId === index) {
                paramComponents.push(
                    <ResponseEditor
                        response={{
                            id: index,
                            type: param.type,
                            code: param.code,
                            source: param.source,
                            isTypeArray: param.isTypeArray,
                            namedRecord: param.namedRecord,
                            defaultCode: getDefaultResponse(method)
                        }}
                        serviceEndPosition={serviceEndPosition}
                        commonRpcClient={commonRpcClient}
                        isBallerniaExt={isBallerniaExt}
                        isEdit={!param.isNew}
                        onChange={onChangeParam}
                        onSave={onSaveParam}
                        onCancel={onParamEditCancel}
                        applyModifications={applyModifications}
                    />
                )
            } else if (editingSegmentId !== index) {
                paramComponents.push(
                    <ResponseItem
                        method={method}
                        response={{
                            id: index,
                            type: param.type,
                            code: param.code,
                            source: param.source
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
            {(editingSegmentId === -1) && (
                <AddButtonWrapper>
                    <LinkButton sx={readonly && { color: "var(--vscode-badge-background)" }} onClick={!readonly && onAddClick} >
                        <Codicon name="add" />
                        <>Add Response</>
                    </LinkButton>
                </AddButtonWrapper>
            )}
        </div>
    );
}
