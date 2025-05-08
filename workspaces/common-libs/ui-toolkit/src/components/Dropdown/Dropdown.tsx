/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ComponentProps, ReactNode } from "react";
import {
    VSCodeDropdown,
    VSCodeOption,
    VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";
import styled from "@emotion/styled";
import { ErrorBanner } from "../Commons/ErrorBanner";
import { RequiredFormInput } from "../Commons/RequiredInput";
import { Codicon } from "../Codicon/Codicon";

export interface OptionProps {
    id?: string;
    content?: string | ReactNode;
    value: any;
}

export interface DropdownProps extends ComponentProps<"select"> {
    id: string;
    isLoading?: boolean;
    isRequired?: boolean;
    label?: string;
    labelAdornment?: ReactNode;
    items?: OptionProps[];
    errorMsg?: string;
    sx?: any;
    containerSx?: any;
    dropdownContainerSx?: any;
    description?: string | ReactNode;
    descriptionSx?: any;
    onValueChange?: (value: string) => void;
    addNewBtnLabel?: string;
    addNewBtnClick?: () => void;
}

const SmallProgressRing = styled(VSCodeProgressRing)`
    height: calc(var(--design-unit) * 3px);
    width: calc(var(--design-unit) * 3px);
    margin-top: auto;
    padding: 4px;
`;

interface ContainerProps {
    sx?: any;
}

const DropDownContainer = styled.div<ContainerProps>`
    display: flex;
    flex-direction: column;
    gap : 2px;
    color: var(--vscode-editor-foreground);
    ${(props: ContainerProps) => props.sx};
`;

const Container = styled.div<ContainerProps>`
    ${(props: ContainerProps) => props.sx};
`;

const Label = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    margin-bottom: 2px;
`;

const Description = styled.div<ContainerProps>`
    color: var(--vscode-list-deemphasizedForeground);
    margin-bottom: 4px;
    text-align: left;
    ${(props: ContainerProps) => props.sx};
`;
const LabelContainer = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>((props, ref) => {
    const { isLoading, isRequired, id, items, label, errorMsg, sx, containerSx, addNewBtnLabel, addNewBtnClick, description, descriptionSx, dropdownContainerSx, labelAdornment, ...rest } = props;

    const handleValueChange = (e: any) => {
        props.onValueChange && props.onValueChange(e.target.value);
        props.onChange && props.onChange(e);
    };

    return (
        <Container sx={containerSx}>
            {isLoading ? (
                <SmallProgressRing />
            ) : (
                <DropDownContainer sx={dropdownContainerSx}>
                    {label && (
                        <LabelContainer>
                            <Label>
                                <label htmlFor={id}>{label}</label>
                                {(isRequired) && (<RequiredFormInput />)}
                                {labelAdornment && labelAdornment}
                            </Label>
                        </LabelContainer>
                    )}
                    {description && (
                        <Description sx={descriptionSx}>
                            {description}
                        </Description>
                    )}
                    <VSCodeDropdown ref={ref} id={id} style={sx} {...rest} onChange={handleValueChange}>
                        {items?.map((item: OptionProps) => (
                            <VSCodeOption key={item?.id} value={item.value}>
                                {item?.content || item.value}
                            </VSCodeOption>
                        ))}
                        {addNewBtnClick &&
                            <VSCodeOption
                                key={"NEW"}
                                onClick={() => addNewBtnClick()}
                                value={undefined}
                            >
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Codicon name="add" />
                                    {addNewBtnLabel}
                                </div>
                            </VSCodeOption>
                        }
                    </VSCodeDropdown>
                    {errorMsg && (
                        <ErrorBanner errorMsg={errorMsg} />
                    )}
                </DropDownContainer>
            )}
        </Container>
    );
});
Dropdown.displayName = "Dropdown";
