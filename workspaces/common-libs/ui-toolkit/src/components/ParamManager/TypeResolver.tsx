/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { TextField } from "../TextField/TextField";
import { Dropdown } from "../Dropdown/Dropdown";
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { TextArea } from "../TextArea/TextArea";
import { EnableCondition } from "./ParamManager";

export interface Param {
    id: number;
    label: string;
    type: "TextField" | "Dropdown" | "Checkbox" | "TextArea";
    value: string | boolean; // Boolean is for Checkbox
    isRequired?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    isEnabled?: boolean;
    enableCondition?: EnableCondition;
    values?: string[]; // For Dropdown
}

interface TypeResolverProps {
    param: Param;
    onChange: (param: Param, ec?: EnableCondition) => void;
}

export function TypeResolver(props: TypeResolverProps) {
    const { param, onChange } = props;
    const { id, label, type, value, isRequired, values, disabled, errorMessage  } = param;

    const handleOnChange = (newValue: string | boolean) => {
        onChange({ ...param, value: newValue }, param.enableCondition);
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...param, value: e.target.checked }, param.enableCondition);
    }

    const dropdownItems = values?.map(val => {
        return { value: val };
    });

    if (param.enableCondition && !param.isEnabled) {
        return null;
    }
    switch (type) {
        case "TextField":
            return (
                <TextField
                    sx={{marginBottom: 5}}
                    id={`txt-field-${id}`}
                    label={label}
                    value={value as string}
                    disabled={disabled}
                    errorMsg={errorMessage}
                    required={isRequired}
                    onTextChange={handleOnChange}
                />
            );
        case "Dropdown":
            return (
                <Dropdown
                    containerSx={{width: 166, fontFamily: "var(--vscode-font-family)", fontSize: "var(--vscode-font-size)", marginBottom: 5}}
                    id={`dropdown-${id}`}
                    label={label}
                    value={value as string}
                    items={dropdownItems}
                    disabled={disabled}
                    errorMsg={errorMessage}
                    isRequired={isRequired}
                    onValueChange={handleOnChange}
                />
            );
        case "Checkbox":
            return (
                <div style={{marginBottom: 5}}>
                    <VSCodeCheckbox
                        id={`checkbox-${id}`}
                        checked={value as boolean}
                        onChange={handleCheckboxChange}
                        disabled={disabled}
                    >
                        Is Required?
                    </VSCodeCheckbox>
                </div>
            );
        case "TextArea":
            return (
                <TextArea
                    sx={{marginBottom: 5, width: 200}}
                    id={`txt-area-${id}`}
                    value={value as string}
                    disabled={disabled}
                    label={label}
                    errorMsg={errorMessage}
                    onTextChange={handleOnChange}
                />
            );
        default:
            return null;
    }
}
