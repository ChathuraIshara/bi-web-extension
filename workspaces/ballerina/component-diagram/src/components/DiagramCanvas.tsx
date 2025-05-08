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
import { css, Global } from "@emotion/react";
import "../resources/assets/font/fonts.css";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
export interface DiagramCanvasProps {
    color?: string;
    background?: string;
    children?: React.ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const Container = styled.div<{ color: string; background: string }>`
    height: 100%;
    background-size: 50px 50px;
    display: flex;

    > * {
        height: 100%;
        min-height: 100%;
        width: 100%;
    }

    background-image: radial-gradient(var(--vscode-editor-inactiveSelectionBackground) 10%, transparent 0px);
    background-size: 16px 16px;
    font-family: "GilmerRegular";

    & svg:first-child {
        z-index: 1;
    }
`;

const Expand = css`
    html,
    body,
    #root {
        height: 100%;
    }
`;

export function DiagramCanvas(props: DiagramCanvasProps) {
    const { color, background, children, onMouseEnter, onMouseLeave } = props;
    return (
        <>
            <Global styles={Expand} />
            <Container
                background={background || ThemeColors.SURFACE_BRIGHT}
                color={color || ThemeColors.ON_SURFACE}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </Container>
        </>
    );
}
