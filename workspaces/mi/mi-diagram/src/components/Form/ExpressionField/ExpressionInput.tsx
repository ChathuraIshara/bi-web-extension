/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 * 
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
*/

import React, { ReactNode, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Codicon, Container, RequiredFormInput, TextArea, TextField, Tooltip, Typography } from "@wso2-enterprise/ui-toolkit";

const Colors = {
    INPUT_OPTION_ACTIVE: "var(--vscode-inputOption-activeBackground)",
    INPUT_OPTION_INACTIVE: "var(--vscode-inputOption-inactiveBackground)",
    INPUT_OPTION_HOVER: "var(--vscode-inputOption-hoverBackground)",
    INPUT_OPTION_ACTIVE_BORDER: "var(--vscode-inputOption-activeBorder)",
}

const ExButtonWrapper = styled.div<{ isActive: boolean }>`
    margin-left: -6px;
    padding: 3px;
    cursor: pointer;
    background-color: ${(props: { isActive: any; }) => props.isActive ? Colors.INPUT_OPTION_ACTIVE : Colors.INPUT_OPTION_INACTIVE};
    border: 1px solid ${(props: { isActive: any; }) => props.isActive ? Colors.INPUT_OPTION_ACTIVE_BORDER : "transparent"};
    &:hover {
        background-color: ${(props: { isActive: any; }) => props.isActive ? Colors.INPUT_OPTION_ACTIVE : Colors.INPUT_OPTION_HOVER};
    }
`;

const ExButtonWrapperTextArea = styled.div<{ isActive: boolean }>`
    z-index: 1000;
    right: 43px;
    position: absolute;
    margin-top: 25px;
    padding: 3px;
    cursor: pointer;
    background-color: ${(props: { isActive: any; }) => props.isActive ? Colors.INPUT_OPTION_ACTIVE : Colors.INPUT_OPTION_INACTIVE};
    border: 1px solid ${(props: { isActive: any; }) => props.isActive ? Colors.INPUT_OPTION_ACTIVE_BORDER : "transparent"};
    &:hover {
        background-color: ${(props: { isActive: any; }) => props.isActive ? Colors.INPUT_OPTION_ACTIVE : Colors.INPUT_OPTION_HOVER};
    }
`;

export const Label = styled.label`
    font-size: var(--type-ramp-base-font-size);
    color: var(--vscode-editor-foreground);
`;

export const FlexLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Link = styled.a`
    cursor: pointer;
    font-size: 12px;
    margin-left: auto;
    margin-right: 15px;
    margin-bottom: -20px;
    color: var(--vscode-editor-foreground);
`;

interface Namespace {
    prefix: string;
    uri: string;
}
export interface ExpressionFieldValue {
    isExpression: boolean;
    value: string;
    namespaces: Namespace[];
}

export interface ExpressionFieldProps {
    id?: string;
    label: string;
    labelAdornment?: ReactNode;
    placeholder?: string;
    value?: ExpressionFieldValue;
    required?: boolean;
    disabled?: boolean;
    openExpressionEditor?: (value: any, setValue: any) => void;
    onChange?: any;
    canChange: boolean;
    sx?: any;
    errorMsg?: string;
    isTextArea?: boolean;
}

interface ExBtnComponentProps {
    label: string;
    labelAdornment?: ReactNode;
    ref: React.Ref<HTMLInputElement>;
    required: boolean;
    disabled: boolean;
    isExActive: boolean;
    isTextArea?: boolean;
    openExpressionEditor: (value: any, setValue: any) => void;
    placeholder: string;
    setIsExpression: React.Dispatch<React.SetStateAction<boolean>>;
    value: ExpressionFieldValue;
    setValue: any;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    canChange: boolean;
    errorMsg?: string;
}

const ExButton = (props: { isActive: boolean, isTextArea: boolean, onClick: () => void }) => {
    return (
        props.isTextArea ? (
            <ExButtonWrapperTextArea isActive={props.isActive} onClick={props.onClick}>
                <Typography sx={{
                    textAlign: "center",
                    margin: 0
                }} variant="h6">EX</Typography>
            </ExButtonWrapperTextArea>
        ) : (
            <ExButtonWrapper isActive={props.isActive} onClick={props.onClick}>
                <Typography sx={{
                    textAlign: "center",
                    margin: 0
                }} variant="h6">EX</Typography>
            </ExButtonWrapper>
        )
    );
}

const ExBtnComponent = (props: ExBtnComponentProps) => {
    const { label, labelAdornment, required, isExActive, disabled, openExpressionEditor, placeholder, setIsExpression: setIsExpression, value, setValue, onChange, canChange, errorMsg, isTextArea } = props;

    return <>
        <FlexLabelContainer>
            {isExActive && (
                <Link onClick={() => openExpressionEditor(value, setValue)}>
                    <Tooltip content="Open Expression editor" position="left">
                        <Codicon name="edit" />
                    </Tooltip>
                </Link>
            )}
        </FlexLabelContainer>
        {isTextArea ? (
            <TextArea
                placeholder={placeholder}
                label={label}
                labelAdornment={labelAdornment}
                required={required}
                disabled={disabled}
                resize={"vertical"}
                icon={{
                    iconComponent: <ExButton isActive={isExActive} isTextArea={isTextArea} onClick={() => {
                        if (canChange) {
                            setIsExpression(!isExActive);
                        }
                    }} />,
                    position: "end"
                }}
                value={value.value}
                onTextChange={event => onChange({ isExpression: isExActive, value: event } as any)}
                errorMsg={errorMsg}
            />
        ) : (
            <TextField
                placeholder={placeholder}
                label={label}
                labelAdornment={labelAdornment}
                required={required}
                disabled={disabled}
                icon={{
                    iconComponent: <ExButton isActive={isExActive} isTextArea={false} onClick={() => {
                        if (canChange) {
                            setIsExpression(!isExActive);
                        }
                    }} />,
                    position: "end"
                }}
                value={value.value}
                onTextChange={event => onChange({ isExpression: isExActive, value: event } as any)}
                errorMsg={errorMsg}
            />
        )}
    </>;
}

export const ExpressionField = React.forwardRef<HTMLInputElement, ExpressionFieldProps>((props, ref) => {
    const { label, labelAdornment, placeholder, required, disabled, openExpressionEditor, onChange, canChange, errorMsg, sx, isTextArea } = props;
    let value = props.value;
    const [isExpression, setIsExpression] = React.useState(value?.isExpression || false);

    const textFieldRef = useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(ref, () => textFieldRef.current);
    useEffect(() => {
        if (value && typeof value === 'object') {
            if (isExpression) {
                value.isExpression = true;
            } else {
                value.isExpression = false;
            }
        }
        onChange(value);
    }, [isExpression]); // eslint-disable-line react-hooks/exhaustive-deps

    const setValue = (val: ExpressionFieldValue) => {
        value = val;
        onChange(value);
    };

    return <Container sx={sx}>
        <ExBtnComponent
            label={label}
            labelAdornment={labelAdornment}
            ref={textFieldRef}
            required={required}
            disabled={disabled}
            isExActive={isExpression}
            isTextArea={isTextArea}
            openExpressionEditor={openExpressionEditor}
            placeholder={placeholder}
            setIsExpression={setIsExpression}
            value={value}
            setValue={setValue}
            onChange={onChange}
            canChange={canChange}
            errorMsg={errorMsg}
        />

    </Container>
});
ExpressionField.displayName = "ExprField";
