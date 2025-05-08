/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import React, { ComponentPropsWithRef, ReactNode } from "react";
import { Control, Controller } from "react-hook-form";

const Directions = {
    vertical: "vertical",
    horizontal: "horizontal",
} as const;

export type CheckBoxProps = {
    label: string;
    labelAdornment?: ReactNode;
    value?: string;
    checked: boolean;
    disabled?: boolean;
    sx?: any;
    onChange: (checked: boolean) => void;
};

export type CheckBoxGroupProps = ComponentPropsWithRef<"div"> & {
    columns?: number;
    containerSx?: React.CSSProperties;
    direction?: (typeof Directions)[keyof typeof Directions];
};

const CheckBoxContainer = styled.div<CheckBoxGroupProps>`
    display: grid;
    ${({ columns, direction }: CheckBoxGroupProps) =>
        direction === Directions.vertical
            ? `grid-template-columns: repeat(${columns}, auto);
        column-gap: 5%;
        grid-auto-flow: row dense;`
            : `grid-template-rows: repeat(${columns}, auto);
        row-gap: 5%;
        grid-auto-flow: column dense;`}
    ${({ containerSx }: CheckBoxGroupProps) => containerSx};
`;

export const StyledCheckBox = styled(VSCodeCheckbox)<CheckBoxProps>`
    --checkbox-border: var(--vscode-icon-foreground);
    display: flex;
    align-items: center;
    ${(props: CheckBoxProps) => props.sx};
`;

const LabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 4px;
`;
export const CheckBox = ({ label, labelAdornment, value, sx, checked, onChange, disabled }: CheckBoxProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    const handleLabelClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(!checked);
    };

    return (
        <StyledCheckBox key={`checkbox-${value}`} sx={sx} value={value} checked={checked} onClick={handleChange} disabled={disabled}>
            <LabelContainer>
                <div style={{ color: "var(--vscode-editor-foreground)", cursor: "pointer" }} onClick={handleLabelClick}>
                    {label}
                </div>
                {labelAdornment && labelAdornment}
            </LabelContainer>
        </StyledCheckBox>
    );
};

interface ContainerProps {
    sx?: any;
}
const Description = styled.div<ContainerProps>`
    color: var(--vscode-list-deemphasizedForeground);
    margin-bottom: 4px;
    text-align: left;
    ${(props: ContainerProps) => props.sx};
`;

interface FormCheckBoxProps {
    name: string;
    label?: string;
    labelAdornment?: ReactNode;
    description?: string;
    descriptionSx?: any;
    sx?: any;
    control: Control<any>;
}

const FormCheckBoxContainer = styled.div<ContainerProps>`
    ${({ sx }: ContainerProps) => sx};
`;

export const FormCheckBox: React.FC<FormCheckBoxProps> = ({ name, control, label, labelAdornment, description, sx, descriptionSx }) => {
    return (
        <FormCheckBoxContainer sx={sx}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value: checked } }) => {
                    return (
                        <div>
                            {description && (
                                <Description sx={descriptionSx}>
                                    {description}
                                </Description>
                            )}
                            <CheckBox
                                label={label}
                                labelAdornment={labelAdornment}
                                checked={checked}
                                onChange={onChange}
                            />
                        </div>
                    );
                }}
            />
        </FormCheckBoxContainer>
    );
};

export const CheckBoxGroup = ({
    id,
    className,
    columns = 1,
    direction = Directions.vertical,
    containerSx,
    children,
}: CheckBoxGroupProps) => {
    return (
        <CheckBoxContainer
            id={id}
            className={className}
            columns={columns}
            direction={direction}
            containerSx={containerSx}
        >
            {children}
        </CheckBoxContainer>
    );
};
