/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { ReactNode } from "react";
import { MultiSelect } from "../MultiSelect/MultiSelect";
import React from "react";

interface PullUpProps {
    options: string[];
    children: ReactNode;
    selectedOptions?: string[];
    selectSingleOption?: boolean;
    dropdownWidth?: number;
    dripdownHeight?: number;
    onOptionChange?: (options: string[]) => void;
    sx?: any;
}
interface ContainerProps {
    sx?: any;
}

const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    ${(props: PullUpProps) => props.sx};
`;

export function PullUpButton(props: PullUpProps) {
    const { options, sx, children, selectedOptions, selectSingleOption, dripdownHeight, dropdownWidth, onOptionChange } = props;

    const onChangeValues = (values: string[], currentOption: string) => {
        if (onOptionChange) {
            if (selectSingleOption) {
                onOptionChange([currentOption]);
            } else {
                onOptionChange(values);
            }
        }
    };

    return (
        <Container sx={sx}>
            <MultiSelect
                addHoverEffect
                closeOnSelect
                dropdownSx={{marginTop: 2}}
                options={options}
                displayValue={children}
                values={selectedOptions}
                dropdownWidth={dropdownWidth}
                dropdownHeight={dripdownHeight}
                onChange={onChangeValues}
            />
        </Container>
    );
}
