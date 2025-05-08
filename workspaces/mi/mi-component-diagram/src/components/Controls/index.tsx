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
import { Colors } from "../../resources/constants";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { FitScreenIcon } from "../../resources/icons/FitScreenIcon";
import { PlusIcon } from "../../resources/icons/nodes/PlusIcon";
import { MinusIcon } from "../../resources/icons/MinusIcon";
import { centerDiagram } from "../../utils/diagram";

export namespace ControlsStyles {
    export const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;

        position: absolute;
        margin-top: 30px;
        right: 10px;
        margin-right: 10px;
        z-index: 1000;
    `;

    export const GroupContainer = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0;

        & > *:not(:last-child) {
            border-bottom: 1px solid ${Colors.OUTLINE_VARIANT};
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

    export const Button = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        border-radius: 4px;
        background-color: ${Colors.SURFACE};
        fill: ${Colors.ON_SURFACE};
        width: 20px;
        height: 20px;
        cursor: pointer;

        &:hover {
            background-color: ${Colors.SURFACE_CONTAINER};
        }

        &:active {
            background-color: ${Colors.SURFACE_CONTAINER};
        }
    `;
}

interface ControlsProps {
    engine: DiagramEngine;
}

export function Controls(props: ControlsProps) {
    const { engine } = props;

    const handleZoomToFit = () => {
        if (engine.getCanvas()?.getBoundingClientRect) {
            engine.zoomToFitNodes({ margin: 0, maxZoom: 1 });
            centerDiagram(engine);
        }
    };

    const onZoom = (zoomIn: boolean) => {
        const delta: number = zoomIn ? +5 : -5;
        engine.getModel().setZoomLevel(engine.getModel().getZoomLevel() + delta);
        engine.repaintCanvas();
    };

    return (
        <ControlsStyles.Container>
            <ControlsStyles.Button onClick={handleZoomToFit}>
                <FitScreenIcon />
            </ControlsStyles.Button>
            <ControlsStyles.GroupContainer>
                <ControlsStyles.Button onClick={() => onZoom(true)}>
                    <PlusIcon />
                </ControlsStyles.Button>
                <ControlsStyles.Button onClick={() => onZoom(false)}>
                    <MinusIcon />
                </ControlsStyles.Button>
            </ControlsStyles.GroupContainer>
        </ControlsStyles.Container>
    );
}

export default Controls;
