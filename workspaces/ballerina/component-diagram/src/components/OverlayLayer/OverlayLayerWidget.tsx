/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import styled from "@emotion/styled";

import { OverlayLayerModel } from "./OverlayLayerModel";
import { ProgressRing, ThemeColors } from "@wso2-enterprise/ui-toolkit";
export interface NodeLayerWidgetProps {
    layer: OverlayLayerModel;
    engine: DiagramEngine;
}

const DiagramContainer = styled.div<{ color: string; background: string }>`
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

const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: center;
    width: 100%;
    background-color: ${ThemeColors.SURFACE_DIM};
    z-index: 1000;
`;

export class OverlayLayerWidget extends React.Component<NodeLayerWidgetProps> {
    render() {
        return (
            <DiagramContainer background={ThemeColors.SURFACE} color={ThemeColors.ON_SURFACE}>
                <Container>
                    <ProgressRing color={ThemeColors.PRIMARY} />
                </Container>
            </DiagramContainer>
        );
    }
}
