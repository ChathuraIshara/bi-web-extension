/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import styled from "@emotion/styled";

export interface GridItemProps {
    id: number | string;
    sx?: any;
    onClick?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    children?: React.ReactNode;
    selected?: boolean;
}

interface ContainerProps {
    sx: any;
}

const Container = styled.div<ContainerProps>`
    text-align: left;
    ${(props: ContainerProps) => props.sx};
`;

export const GridItem: React.FC<GridItemProps> = (props: GridItemProps) => {
    const { id, sx, onClick, children } = props;

    const handleItemClick = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (onClick) {
            event.stopPropagation();
            onClick(event);
        }
    }

    return (
        <Container
            key={id}
            onClick={handleItemClick}
            sx={sx}
            id={`grid-item-${id}`}
        >
            <div style={{...sx}}>{children}</div>
        </Container>
    );
};
