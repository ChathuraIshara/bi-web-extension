/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import styled from "@emotion/styled";

const BadgeContainer = styled.div`
    display: inline-block;
    padding: 2px 6px;
    border-radius: 8px;
    color: white;
    font-size: 11px;
`;

export interface BadgeProps {
    color?: string;
    children?: React.ReactNode;
    sx?: any;
}

export const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
    return <BadgeContainer style={{ backgroundColor: props.color }}>{props.children}</BadgeContainer>;
};
