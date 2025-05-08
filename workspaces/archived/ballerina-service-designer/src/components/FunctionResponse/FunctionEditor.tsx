/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React, { useEffect, useState } from 'react';

import { ActionButtons, AutoComplete, TextField, Codicon } from '@wso2-enterprise/ui-toolkit';
import { EditorContainer, EditorContent, ParamContainer, ParamDescription } from '../../styles';
import { CommonRPCAPI, STModification, responseCodes } from '@wso2-enterprise/ballerina-core';
import { getTitleFromResponseCode } from '../../utils/utils';
import { TypeBrowser } from '../TypeBrowser/TypeBrowser';
import { NodePosition } from '@wso2-enterprise/syntax-tree';
import { ResponseConfig } from '../../utils/definitions';

export interface ParamProps {
    response: ResponseConfig;
    isBallerniaExt?: boolean;
    isEdit: boolean;
    onChange: (param: ResponseConfig) => void;
    onSave?: (param: ResponseConfig) => void;
    onCancel?: (id?: number) => void;
    serviceEndPosition?: NodePosition;
    commonRpcClient?: CommonRPCAPI;
    applyModifications?: (modifications: STModification[]) => Promise<void>;
}

export function FunctionEditor(props: ParamProps) {
    const { response, isBallerniaExt, isEdit, onSave, onChange, onCancel, serviceEndPosition, commonRpcClient, applyModifications } = props;


    const handleTypeChange = (value: string, isArray: boolean) => {
        onChange({ ...response, type: value, isTypeArray: isArray, source: "" });
    }

    const handleOnCancel = () => {
        onCancel(response.id);
    };

    const handleOnSave = () => {
        const newParam: ResponseConfig = {
            id: response.id,
            type: response.type
        };
        onSave(newParam);
    };


    return (
        <EditorContainer>
            <EditorContent>
                <TypeBrowser
                    commonRpcClient={commonRpcClient}
                    serviceEndPosition={serviceEndPosition}
                    sx={{ zIndex: 1, position: "relative" }}
                    isOptional={true}
                    borderBox={isBallerniaExt}
                    label="Type"
                    selectedItem={response.type}
                    isTypeArray={response.isTypeArray}
                    onChange={handleTypeChange}
                    applyModifications={applyModifications}
                />
            </EditorContent>
            <ActionButtons
                primaryButton={{ text: isEdit ? "Save" : "Add", onClick: handleOnSave }}
                secondaryButton={{ text: "Cancel", onClick: handleOnCancel }}
                sx={{ justifyContent: "flex-end" }}
            />
        </EditorContainer >
    );
}
