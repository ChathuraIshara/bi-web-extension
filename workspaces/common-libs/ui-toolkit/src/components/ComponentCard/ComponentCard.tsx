/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { PropsWithChildren } from "react";
import cn from "classnames";

import styled from "@emotion/styled";

interface CardContainerProps {
    sx?: any;
    isSelected?: boolean;
    disbaleHoverEffect?: boolean;
}

const CardContainer = styled.div<CardContainerProps>`
    // Flex Props
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    // End Flex Props
    // Sizing Props
    width: 120px;
    padding: 3px 6px 6px;
    // End Sizing Props
    // Border Props
    border-radius: 6px;
    border-style: solid;
    border-width: 1px;
    border-color:  ${(props: CardContainerProps) => props.isSelected ? "var(--vscode-focusBorder)" : "var(--vscode-dropdown-border)"};
    color: var(--vscode-editor-foreground);
    cursor: pointer;
    ${(props: CardContainerProps) => props.disbaleHoverEffect ? "" :
        "\
    &:hover, &.active {\
        background: var(--vscode-welcomePage-tileHoverBackground);\
    };\
    "};
	&.not-allowed {
    	cursor: not-allowed;
  	};
	${(props: CardContainerProps) => props.sx};
`;

export interface ComponentCardProps {
    id?: string; // Identifier for the component
    tooltip?: string;
    isSelected?: boolean;
    disabled?: boolean;
    disbaleHoverEffect?: boolean;
    sx?: any;
    onClick?: (value: string) => void;
}

export const ComponentCard: React.FC<PropsWithChildren<ComponentCardProps>> = 
    (props: PropsWithChildren<ComponentCardProps>) => {
        const { id, sx, tooltip, isSelected, disabled, disbaleHoverEffect, children, onClick } = props;

        const handleComponentClick = () => {
            onClick && onClick(id);
        };

        return (
            <CardContainer disbaleHoverEffect= {disbaleHoverEffect} id={`card-select-${id}`} className={cn({ "active": isSelected, 'not-allowed': disabled })} sx={sx} isSelected={isSelected} onClick={handleComponentClick} title={tooltip}>
                {children}
            </CardContainer>
        );
    };
