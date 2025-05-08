/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React, { useEffect, useState } from 'react';

import { Button } from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import debounce from "lodash.debounce";

import { PrimaryButton, SecondaryButton } from '../buttons';
import { ParamDropDown } from "../DropDown/ParamDropdown";
import { FieldTitle } from '../FieldTitle';
import { FormTextInput } from '../FormTextInput';

import { useStyles } from "./style";

export interface Param {
    id: number;
    name: string;
    dataType?: string;
    defaultValue?: string;
    headerName?: string;
}
export const headerParameterOption = "Header";


export enum PARAM_TYPES {
    DEFAULT = 'Query',
    PAYLOAD = 'Payload',
    REQUEST = 'Request',
    CALLER = 'Caller',
    HEADER = 'Header'
}

export interface ParamProps {
    param: Param;
    syntaxDiag?: string;
    typeDiagnostics?: string;
    nameDiagnostics?: string;
    alternativeName?: string;
    headerName?: string;
    isEdit?: boolean;
    isTypeReadOnly?: boolean;
    dataTypeReqOptions?: string[];
    enabledOptions?: string[];
    optionList?: string[];
    option?: string;
    hideButtons?: boolean;
    hideDefaultValue?: boolean;
    disabled?: boolean;
    onAdd?: (param: Param, selectedOption?: string) => void;
    onUpdate?: (param: Param, selectedOption?: string) => void;
    onChange: (param: Param, selectedOption?: string, optionChanged?: boolean) => void;
    onCancel?: () => void;
}

export function ParamEditor(props: ParamProps) {
    const { param, typeDiagnostics, nameDiagnostics, syntaxDiag, alternativeName, headerName, isTypeReadOnly,
            hideDefaultValue, hideButtons, disabled, optionList, enabledOptions, dataTypeReqOptions, option = "",
            onChange, onAdd, onUpdate, onCancel } = props;
    const { id, name, dataType, headerName: hName, defaultValue } = param;

    const classes = useStyles();

    const [paramDataType, setParamDataType] = useState<string>(dataType);
    const [paramName, setParamName] = useState<string>(name);
    const [paramHeaderName, setParamHeaderName] = useState<string>(paramName);
    const [paramDefaultValue, setParamDefaultValue] = useState<string>(defaultValue);
    const [selectedOption, setSelectedOption] = useState<string>(option);
    const [isHeaderConfigInProgress, setIsHeaderConfigInProgress] = useState<boolean>(!!hName);
    // States related to syntax diagnostics
    const [currentComponentName, setCurrentComponentName] = useState<string>("");

    const isTypeVisible = dataTypeReqOptions ? dataTypeReqOptions.includes(selectedOption) : true;

    const handleNameChange = (value: string) => {
        setCurrentComponentName("Name");
        if (optionList) {
            onChange({
                id, name: value, dataType: paramDataType, headerName: paramHeaderName,
                defaultValue: paramDefaultValue
            }, selectedOption);
        } else {
            onChange({
                id, name: value, dataType: paramDataType, headerName: paramHeaderName,
                defaultValue: paramDefaultValue
            });
        }
    };
    const debouncedNameChange = debounce(handleNameChange, 800);

    const handleHeaderNameChange = (value: string) => {
        setParamHeaderName(value);
        setCurrentComponentName("HeaderName");
        if (optionList) {
            onChange({
                id, name: paramName, dataType: paramDataType, headerName: value, defaultValue:
                    paramDefaultValue
            }, selectedOption);
        } else {
            onChange({
                id, name: paramName, dataType: paramDataType, headerName: value, defaultValue:
                    paramDefaultValue
            });
        }
    };
    const debouncedHeaderNameChange = debounce(handleHeaderNameChange, 800);

    const handleTypeChange = (value: string) => {
        setCurrentComponentName("Type");
        if (optionList) {
            onChange({
                id, name: paramName, dataType: value, headerName: paramHeaderName,
                defaultValue: paramDefaultValue
            }, selectedOption);
        } else {
            onChange({
                id, name: paramName, dataType: value, headerName: paramHeaderName, defaultValue:
                    paramDefaultValue
            });
        }
    };
    const debouncedTypeChange = debounce(handleTypeChange, 800);

    const handleDefaultValueChange = (value: string) => {
        setParamDefaultValue(value);
        setCurrentComponentName("DefaultValue");
        if (optionList) {
            onChange({ id, name: paramName, dataType: paramDataType, headerName, defaultValue: value },
                selectedOption);
        } else {
            onChange({ id, name: paramName, dataType: paramDataType, headerName, defaultValue: value });
        }
    };
    const debouncedDefaultValeChange = debounce(handleDefaultValueChange, 800);

    const handleOnSelect = (value: string) => {
        setSelectedOption(value);
        onChange({ id, name: "", dataType: "" }, value, true);
    };

    const handleAddParam = () => {
        if (onUpdate) {
            if (optionList) {
                onUpdate({
                    id, name: paramName, dataType: paramDataType, headerName: paramHeaderName,
                    defaultValue: paramDefaultValue
                }, selectedOption);
            } else {
                onUpdate({
                    id, name: paramName, dataType: paramDataType, headerName: paramHeaderName,
                    defaultValue: paramDefaultValue
                });
            }
        } else {
            if (optionList) {
                onAdd({
                    id, name: paramName, dataType: paramDataType, headerName: paramHeaderName, defaultValue:
                        paramDefaultValue
                }, selectedOption);
            } else {
                onAdd({
                    id, name: paramName, dataType: paramDataType, headerName: paramHeaderName, defaultValue:
                        paramDefaultValue
                });
            }
        }
    };

    const handleShowHeaderName = () => {
        setIsHeaderConfigInProgress(true);
    };

    useEffect(() => {
        setParamDataType(dataType);
    }, [dataType]);

    useEffect(() => {
        setParamName(name);
    }, [name]);

    useEffect(() => {
        setSelectedOption(option);
    }, [option]);

    useEffect(() => {
        setParamHeaderName(hName);
    }, [hName]);

    useEffect(() => {
        setParamDefaultValue(defaultValue);
    }, [defaultValue]);

    return (
        <div className={classes.paramContainer}>
            {optionList && (
                <div className={classes.paramTypeWrapper}>
                    <ParamDropDown
                        dataTestId="param-type-selector"
                        defaultValue={selectedOption}
                        placeholder={"Select Type"}
                        customProps={{ values: optionList, enabledValues: enabledOptions }}
                        onChange={handleOnSelect}
                        label="Param Type"
                    />
                </div>
            )}
            <div className={classes.paramContent}>
                {isTypeVisible && (
                    <div className={classes.paramDataTypeWrapper}>
                        <FormTextInput
                            label="Data Type"
                            dataTestId="data-type"
                            defaultValue={paramDataType}
                            onChange={debouncedTypeChange}
                            onBlur={null}
                            customProps={{
                                isErrored: (syntaxDiag !== "" && currentComponentName === "Type")
                                    || (typeDiagnostics !== "" && typeDiagnostics !== undefined),
                                readonly: isTypeReadOnly
                            }}
                            errorMessage={((currentComponentName === "Type" && syntaxDiag ? syntaxDiag : "")
                                || typeDiagnostics)}
                            placeholder={"Enter Type"}
                            size="small"
                            disabled={(syntaxDiag && currentComponentName !== "Type") || disabled}
                        />
                    </div>
                )}
                <div className={classes.paramNameWrapper}>
                    <FormTextInput
                        label={alternativeName ? alternativeName : "Name"}
                        dataTestId="param-name"
                        defaultValue={paramName}
                        onChange={debouncedNameChange}
                        customProps={{
                            isErrored: ((syntaxDiag !== "" && currentComponentName === "Name") ||
                                (nameDiagnostics !== "" && nameDiagnostics !== undefined))
                        }}
                        errorMessage={((currentComponentName === "Name" && (syntaxDiag) ? syntaxDiag : "")
                            || nameDiagnostics)}
                        onBlur={null}
                        placeholder={"Enter Name"}
                        size="small"
                        disabled={(syntaxDiag && currentComponentName !== "Name") || disabled}
                    />
                </div>
                {!hideDefaultValue && (
                    <div className={classes.paramNameWrapper}>
                        <FormTextInput
                            label="Default Value"
                            dataTestId="default-value"
                            defaultValue={paramDefaultValue}
                            onChange={debouncedDefaultValeChange}
                            customProps={{
                                isErrored: ((syntaxDiag !== "" && currentComponentName === "DefaultValue") ||
                                    (nameDiagnostics !== "" && nameDiagnostics !== undefined)),
                                optional: true
                            }}
                            errorMessage={((currentComponentName === "DefaultValue" && (syntaxDiag) ? syntaxDiag : "")
                                || nameDiagnostics)}
                            onBlur={null}
                            placeholder={"Enter Default Value"}
                            size="small"
                            disabled={(syntaxDiag && currentComponentName !== "DefaultValue") || disabled}
                        />
                    </div>
                )}
            </div>
            <>
                {(selectedOption === headerParameterOption && isHeaderConfigInProgress) && (
                    <div className={classes.headerNameWrapper}>
                        <FormTextInput
                            label="Header Name"
                            dataTestId="header-name"
                            defaultValue={paramHeaderName}
                            onChange={debouncedHeaderNameChange}
                            customProps={{
                                isErrored: ((syntaxDiag !== "" && currentComponentName === "HeaderName") ||
                                    (nameDiagnostics !== "" && nameDiagnostics !== undefined)),
                                optional: true
                            }}
                            errorMessage={((currentComponentName === "HeaderName" && (syntaxDiag) ? syntaxDiag : "")
                                || nameDiagnostics)}
                            onBlur={null}
                            placeholder={"Enter Header Name"}
                            size="small"
                            disabled={syntaxDiag && currentComponentName !== "HeaderName"}
                        />
                    </div>
                )}
            </>
            {(selectedOption === headerParameterOption && !isHeaderConfigInProgress) && (
                <Button
                    data-test-id="request-add-button"
                    onClick={handleShowHeaderName}
                    className={classes.addHeaderBtn}
                    startIcon={<AddIcon />}
                    color="primary"
                    disabled={(syntaxDiag !== "") || disabled}
                >
                    If identifier not equal header name
                </Button>
            )}
            {!hideButtons && (
                <div className={classes.btnContainer}>
                    <SecondaryButton
                        text="Cancel"
                        fullWidth={false}
                        onClick={onCancel}
                        className={classes.actionBtn}
                    />
                    <PrimaryButton
                        dataTestId={"path-segment-add-btn"}
                        text={onUpdate ? "Update" : " Add"}
                        disabled={(!!syntaxDiag) || (!!typeDiagnostics) || (!!nameDiagnostics)
                            || !(paramName !== "") || !(paramDataType !== "" || isTypeReadOnly || !isTypeVisible)
                        }
                        fullWidth={false}
                        onClick={handleAddParam}
                        className={classes.actionBtn}
                    />
                </div>
            )}
        </div >
    );
}
