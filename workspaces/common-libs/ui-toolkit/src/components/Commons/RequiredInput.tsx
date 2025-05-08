/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import React from "react";

export interface RequiredFormInputProps {
    sx?: any;
}
const RequiredElement = styled.span<RequiredFormInputProps>`
    font-size: 13px;
    ${(props: RequiredFormInputProps) => props.sx};
`;

export function RequiredFormInput(props: {id?: string, className?: string, sx?: any}) {
    const { id, className, sx } = props;
    return <RequiredElement id={id} sx={sx} className={className}>*</RequiredElement>;
}
