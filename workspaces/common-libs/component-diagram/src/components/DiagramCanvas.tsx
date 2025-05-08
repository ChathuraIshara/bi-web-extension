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
import { Colors } from "../resources/constants";
import '../resources/assets/font/fonts.css';

export interface DiagramCanvasProps {
    color?: string;
    background?: string;
    children?: React.ReactNode;
}

export namespace DiagramStyles {
    export const Container = styled.div<{ color: string; background: string }>`
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
    `;

    export const Expand = css`
        html,
        body,
        #root {
            height: 100%;
        }
    `;
}

export function DiagramCanvas(props: DiagramCanvasProps) {
    const { color, background, children } = props;
    return (
        <>
            <Global styles={DiagramStyles.Expand} />
            <DiagramStyles.Container background={background || Colors.SURFACE_BRIGHT} color={color || Colors.ON_SURFACE}>
                {children}
            </DiagramStyles.Container>
        </>
    );
}
