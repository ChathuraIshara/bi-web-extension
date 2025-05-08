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
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { loadDiagramZoomAndPosition, resetDiagramZoomAndPosition } from "../../utils/diagram";
import { Icon, ThemeColors } from "@wso2-enterprise/ui-toolkit";

const Container = styled.div<{}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;

    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
`;

const GroupContainer = styled.div<{}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;

    & > *:not(:last-child) {
        border-bottom: 1px solid ${ThemeColors.OUTLINE_VARIANT};
    }

    & > *:first-child {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    & > *:last-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    & > *:not(:first-child):not(:last-child) {
        border-radius: 0;
    }
`;

const Button = styled.div<{}>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    background-color: ${ThemeColors.SURFACE};
    fill: ${ThemeColors.ON_SURFACE};
    width: 32px;
    height: 32px;
    cursor: pointer;

    &:hover {
        background-color: ${ThemeColors.SURFACE_CONTAINER};
    }

    &:active {
        background-color: ${ThemeColors.SURFACE_CONTAINER};
    }
`;

interface ControlsProps {
    engine: DiagramEngine;
}

export function Controls(props: ControlsProps) {
    const { engine } = props;

    const handleZoomToFit = () => {
        resetDiagramZoomAndPosition();
        loadDiagramZoomAndPosition(engine);
        engine.repaintCanvas();
    };

    const onZoom = (zoomIn: boolean) => {
        const delta: number = zoomIn ? +5 : -5;
        engine.getModel().setZoomLevel(engine.getModel().getZoomLevel() + delta);
        engine.repaintCanvas();
    };

    return (
        <Container>
            <Button onClick={handleZoomToFit}>
                <Icon name="bi-fit-screen" sx={{ width: 16, height: 16, fontSize: 16 }} />
            </Button>
            <GroupContainer>
                <Button onClick={() => onZoom(true)}>
                    <Icon name="bi-plus" sx={{ width: 16, height: 16, fontSize: 16 }} />
                </Button>
                <Button onClick={() => onZoom(false)}>
                    <Icon name="bi-minus" sx={{ width: 16, height: 16, fontSize: 16 }} />
                </Button>
            </GroupContainer>
        </Container>
    );
}

export default Controls;
