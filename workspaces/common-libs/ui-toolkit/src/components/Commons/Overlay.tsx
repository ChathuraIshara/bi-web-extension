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
export interface OverlayProps {
    id?: string;
    className?: string;
    onClose?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    sx?: any;
}

const OverlayContainer = styled.div<OverlayProps>`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    ${(props: OverlayProps) => props.sx};
`;

export const Overlay: React.FC<OverlayProps> = (props: OverlayProps) => {
    const { id, className, sx, onClose } = props;

    return (
        <OverlayContainer id={id} className={className} sx={sx} onClick={onClose} />
    );
};
