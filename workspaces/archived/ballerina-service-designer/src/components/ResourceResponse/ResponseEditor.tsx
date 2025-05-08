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

import { ActionButtons, AutoComplete, TextField, Codicon, CheckBox } from '@wso2-enterprise/ui-toolkit';
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
    onSave?: (param: ResponseConfig, defineRecordName: string) => void;
    onCancel?: (id?: number) => void;
    typeCompletions?: string[];
    serviceEndPosition?: NodePosition;
    commonRpcClient?: CommonRPCAPI;
    applyModifications?: (modifications: STModification[]) => Promise<void>;
}

export function ResponseEditor(props: ParamProps) {
    const { response, isBallerniaExt, isEdit, onSave, onChange, onCancel, typeCompletions, serviceEndPosition, commonRpcClient, applyModifications } = props;

    console.log("response", typeCompletions);
    const subTypeText = "Name record for the return response type";

    const [showRecordEdit, setShowRecordEdit] = useState(false);
    const [definedRecordName, setDefinedRecordName] = useState("");
    const [subType, setSubType] = useState<boolean>(false);

    const handleReqFieldChange = () => {
        setShowRecordEdit(!showRecordEdit);
    };

    useEffect(() => {
        const code = responseCodes.find(code => code.code === response.code).code;
        handleDefinedName(Number(code), response.type);
    }, [subType]);

    useEffect(() => {
        if (response.namedRecord) {
            setSubType(true);
            setDefinedRecordName(response.namedRecord)
        }
    }, []);

    const handleCodeChange = (value: string) => {
        const code = responseCodes.find(code => code.title === value).code;
        handleDefinedName(Number(code), response.type);
        onChange({ ...response, code: Number(code), source: "" });
    };

    const handleTypeChange = (value: string, isArray: boolean) => {
        handleDefinedName(Number(response.code), value);
        onChange({ ...response, type: value, isTypeArray: isArray, source: "" });
    };

    const handleNamedTypeChange = (value: string) => {
        setDefinedRecordName(value.replace(/\[\]/g, ""));
    };

    const handleOnCancel = () => {
        onCancel(response.id);
    };

    const handleOnSave = () => {
        const newParam: ResponseConfig = {
            id: response.id,
            type: response.type,
            code: response.code,
            source: response.source,
            namedRecord: response.namedRecord,
        };
        onSave(newParam, definedRecordName);
    };


    // Check whether the response code selected and default method response code is same
    const methodResponseMatched = (code: number) => {
        const responseCode = responseCodes.find(item => item.code === code);
        return responseCode.code === Number(response.defaultCode);
    }

    // Generate defined name based on the selected type
    const handleDefinedName = (code: number, type?: string) => {
        if (!methodResponseMatched(code) && type && subType) {
            const responseCode = responseCodes.find(item => item.code === code);
            const responseName = responseCode.source.split(":")[1];
            const currentType = type || response.type;
            const nameValue = currentType?.includes(responseName) ? `${currentType}` : `${currentType}${responseName}`;
            setDefinedRecordName(nameValue.replace(/\[\]/g, ""));
        } else {
            setDefinedRecordName("");
        }
    }

    return (
        <EditorContainer>
            <EditorContent>
                <AutoComplete
                    sx={{ zIndex: 1, position: "relative", marginTop: "3px" }}
                    borderBox={isBallerniaExt}
                    label="Code"
                    value={getTitleFromResponseCode(response.code as number)}
                    items={responseCodes.map(code => code.title)}
                    onValueChange={handleCodeChange}
                />
                <TypeBrowser
                    commonRpcClient={commonRpcClient}
                    serviceEndPosition={serviceEndPosition}
                    sx={{ zIndex: 1, position: "relative" }}
                    isOptional={true}
                    borderBox={isBallerniaExt}
                    label="Type"
                    selectedItem={response.type}
                    handleArray={true}
                    isTypeArray={response.isTypeArray}
                    onChange={handleTypeChange}
                    applyModifications={applyModifications}
                />
            </EditorContent>
            <CheckBox label="Make separate named records" value="Make separate named records" checked={subType} onChange={setSubType} />
            {subType && subType &&
                (
                    <ParamContainer>
                        {subTypeText} -
                        {!showRecordEdit && (
                            <ParamDescription onClick={handleReqFieldChange}>
                                {definedRecordName} <Codicon name='edit' iconSx={{ paddingLeft: "5px", font: "normal normal normal 12px/1 codicon" }} />
                            </ParamDescription>
                        )}
                        {showRecordEdit && (
                            <TextField
                                sx={{ marginLeft: "12px", paddingBottom: "10px" }}
                                size={33}
                                placeholder='Enter type'
                                value={definedRecordName}
                                onTextChange={handleNamedTypeChange}
                            />
                        )}
                    </ParamContainer>
                )
            }
            <ActionButtons
                primaryButton={{ text: isEdit ? "Save" : "Add", onClick: handleOnSave }}
                secondaryButton={{ text: "Cancel", onClick: handleOnCancel }}
                sx={{ justifyContent: "flex-end" }}
            />
        </EditorContainer >
    );
}
