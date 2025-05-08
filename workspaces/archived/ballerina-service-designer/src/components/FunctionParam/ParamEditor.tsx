/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React from 'react';

import { ActionButtons, TextField } from '@wso2-enterprise/ui-toolkit';
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { EditorContainer, EditorContent } from '../../styles';
import { RESOURCE_CHECK, useServiceDesignerContext } from '../../Context';
import { TypeBrowser } from '../TypeBrowser/TypeBrowser';
import { PARAM_TYPES, ParameterConfig } from '../../utils/definitions';

export interface ParamProps {
    param: ParameterConfig;
    isEdit: boolean;
    optionList?: PARAM_TYPES[];
    option?: PARAM_TYPES;
    isTypeReadOnly?: boolean;
    hideType?: boolean;
    hideDefaultValue?: boolean;
    onChange: (param: ParameterConfig) => void;
    onSave?: (param: ParameterConfig) => void;
    onCancel?: (param?: ParameterConfig) => void;
}

export function ParamEditor(props: ParamProps) {
    const { param, option, isEdit, hideType = false, hideDefaultValue = false,
        onChange, onSave, onCancel } = props;

    const { diagnostics, dPosition, commonRpcClient, applyModifications, serviceEndPosition } = useServiceDesignerContext();

    const handleTypeChange = (value: string) => {
        onChange({ ...param, type: value });
    };

    const handleChange = (value: string) => {
        onChange({ ...param, name: value });
    };

    const handleValueChange = (value: string) => {
        onChange({ ...param, defaultValue: value });
    };

    const handleReqFieldChange = () => {
        onChange({ ...param, isRequired: !param.isRequired });
    };

    const handleOnCancel = () => {
        onCancel!(param);
    };

    const handleOnSave = () => {
        onSave!(param);
    };

    return (
        <EditorContainer>
            <EditorContent>
                {!hideType && (
                    <TypeBrowser
                        commonRpcClient={commonRpcClient}
                        serviceEndPosition={serviceEndPosition}
                        sx={{ zIndex: 1, position: "relative", width: "100%" }}
                        borderBox={true}
                        label="Type"
                        selectedItem={param.type}
                        onChange={handleTypeChange}
                        applyModifications={applyModifications}
                    />
                )}
                <TextField
                    label='Name'
                    size={21}
                    required
                    sx={{ width: "100%" }}
                    placeholder='Enter name'
                    value={param.name}
                    onTextChange={handleChange}
                    onFocus={(e) => e.target.select()}
                />
                {/* {!hideDefaultValue && (
                    <TextField
                        label='Default Value'
                        size={21}
                        sx={{ width: "175px" }}
                        placeholder='Enter default value'
                        value={param.defaultValue}
                        onTextChange={handleValueChange}
                    />
                )} */}
            </EditorContent>
            {option === PARAM_TYPES.DEFAULT && (
                <VSCodeCheckbox checked={param.isRequired} onChange={handleReqFieldChange} id="is-req-checkbox">
                    Is Required?
                </VSCodeCheckbox>
            )}
            <ActionButtons
                primaryButton={{ text: isEdit ? "Save" : "Add", onClick: handleOnSave }}
                secondaryButton={{ text: "Cancel", onClick: handleOnCancel }}
                sx={{ justifyContent: "flex-end" }}
            />
        </EditorContainer >
    );
}
