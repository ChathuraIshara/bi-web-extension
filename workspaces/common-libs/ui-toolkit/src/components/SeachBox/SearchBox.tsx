/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import { Codicon } from '../Codicon/Codicon';
import { TextField } from '../TextField/TextField';

export interface SearchBoxProps {
    value: string;
    label?: string;
    id?: string;
    icon?: React.ReactNode;
    iconPosition?: "start" | "end";
    autoFocus?: boolean;
    size?: number;
    type?: "email" | "password" | "tel" | "text" | "url";
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    sx?: any;
    onChange?: (e: string) => void;
}

const searchIcon = (<Codicon name="search" sx= {{cursor: "auto"}}/>);

export function SearchBox(props: SearchBoxProps) {
    const { label, size, disabled, readonly, value, id,
        icon, iconPosition, autoFocus, onChange, placeholder, sx
    } = props;
    const handleChange = (value: string) => {
        onChange && onChange(value);
    }
    return (
        <TextField
            autoFocus={autoFocus}
            icon={{ iconComponent: icon ?? searchIcon, position: iconPosition || "start" }}
            size={size}
            disabled={disabled}
            readonly={readonly}
            placeholder={placeholder}
            label={label}
            onTextChange={handleChange}
            value={value || ""}
            id={id}
            sx={sx}
        />
    );
}
