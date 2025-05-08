/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import styled from "@emotion/styled";

import { Title } from "../DataMapperConfigPanel";
import { RecordButtonGroup } from "../RecordButtonGroup";
import { CompletionResponseWithModule } from "../TypeBrowser";
import { getTypeIncompatibilityMsg } from "../utils";

import { InputParamItem } from "./InputParam";
import { InputParamEditor } from "./InputParamEditor";
import { DataMapperInputParam } from "./types";
import { ErrorBanner } from "@wso2-enterprise/ui-toolkit";

export interface InputConfigWidgetProps {
    inputParams: DataMapperInputParam[];
    isAddExistType: boolean;
    onUpdateParams: (newParams: DataMapperInputParam[]) => void;
    enableAddNewRecord: () => void;
    setAddExistType: (value: boolean) => void;
    completions: CompletionResponseWithModule[];
    loadingCompletions: boolean;
    isArraySupported: boolean;
}

export function InputParamsPanel(props: InputConfigWidgetProps) {
    const {
        inputParams,
        isAddExistType,
        onUpdateParams,
        enableAddNewRecord,
        setAddExistType,
        completions,
        loadingCompletions,
        isArraySupported
    } = props;

    const [editingIndex, setEditingIndex] = useState(-1);

    const handleEnableAddNewRecord = () => {
        enableAddNewRecord();
    };

    const enableAddNew = () => {
        setAddExistType(true);
    };

    const disableAddNew = () => {
        setAddExistType(false);
    };

    const onAddNew = (param: DataMapperInputParam) => {
        onUpdateParams([...inputParams, param]);
        setAddExistType(false);
    };

    const onUpdate = (index: number, param: DataMapperInputParam) => {
        onUpdateParams([
            ...inputParams.slice(0, index),
            param,
            ...inputParams.slice(index + 1),
        ]);
        setEditingIndex(-1);
    };

    const onUpdateCancel = () => {
        setEditingIndex(-1);
    };

    const onEditClick = (index: number) => {
        inputParams[index].isUnsupported = false;
        setEditingIndex(index);
    };

    const onDeleteClick = (index: number) => {
        onUpdateParams([...inputParams.filter((item, i) => index !== i)]);
    };

    return (
        <InputParamsContainer data-testid='dm-inputs'>
            <Title>Inputs</Title>
            {inputParams.map((param, index) =>
                editingIndex === index ? (
                    <>
                        <InputParamEditor
                            key={index}
                            index={editingIndex}
                            param={param}
                            onUpdate={onUpdate}
                            onCancel={onUpdateCancel}
                            completions={completions}
                            loadingCompletions={loadingCompletions}
                            isArraySupported={isArraySupported}
                        />
                        {param.isUnsupported && (
                            <ErrorBanner
                                errorMsg={getTypeIncompatibilityMsg(param.typeNature, param.type, "input")}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <InputParamItem
                            index={index}
                            inputParam={param}
                            onEditClick={onEditClick}
                            onDelete={onDeleteClick}
                        />
                        {param.isUnsupported && (
                            <ErrorBanner
                                errorMsg={getTypeIncompatibilityMsg(param.typeNature, param.type, "input")}
                            />
                        )}
                    </>
                )
            )}
            {isAddExistType && (
                <InputParamEditor
                    param={{ name: "", type: "" }}
                    onSave={onAddNew}
                    onCancel={disableAddNew}
                    completions={completions}
                    loadingCompletions={loadingCompletions}
                    isArraySupported={isArraySupported}
                />
            )}
            {!isAddExistType && editingIndex === -1 && (
                <RecordButtonGroup
                    openRecordEditor={handleEnableAddNewRecord}
                    showTypeList={enableAddNew}
                />
            )}
        </InputParamsContainer>
    );
}

const InputParamsContainer = styled.div(() => ({
    color: 'var(--vscode-foreground)',
    marginBottom: '10px'
}));
