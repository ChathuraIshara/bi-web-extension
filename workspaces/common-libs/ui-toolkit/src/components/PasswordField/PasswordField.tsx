/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useRef } from 'react';
import { TextFieldProps, TextField } from '../TextField/TextField';
import { Icon } from '../Icon/Icon';

export interface PasswordFieldProps extends TextFieldProps {
    showPassword?: boolean;
    onPasswordToggle?: (showPassword: boolean) => void;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
    const { showPassword = false, onPasswordToggle, ...rest } = props;
    const [isPasswordVisible, setPasswordVisibility] = React.useState(showPassword);
    const textFieldRef = useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(ref, () => textFieldRef.current);

    const handlePasswordToggle = () => {
        if (onPasswordToggle) {
            onPasswordToggle(!isPasswordVisible);
        }
        setPasswordVisibility(!isPasswordVisible);
    };

    const passwordToggleIconName = isPasswordVisible ? "eye" : "eye-closed";
    const passwordToggleIcon = (
        <div onClick={handlePasswordToggle} style={{ cursor: "pointer" }}>
            <Icon isCodicon name={passwordToggleIconName} />
        </div>
    );

    useEffect(() => {
        setPasswordVisibility(showPassword);
    }, [showPassword]);

    return (
        <TextField
            {...rest}
            ref={textFieldRef}
            type={isPasswordVisible ? "text" : "password"}
            icon={
                props.icon
                    ? {
                        iconComponent: props.icon.iconComponent,
                        position: props.icon.position,
                        onClick: props.icon.onClick,
                    }
                    : {
                        iconComponent: passwordToggleIcon,
                        position: "end",
                        onClick: handlePasswordToggle,
                    }
            }
        
        />
    );
});
PasswordField.displayName = "TextField";
