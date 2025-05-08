/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { toJpeg } from 'html-to-image';

import { Icon, ThemeColors } from '@wso2-enterprise/ui-toolkit';

interface ControlProps {
    engine: DiagramEngine;
    refreshDiagram: () => void;
    showProblemPanel: () => void;
}

namespace ControlsStyles {
    export const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;

        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    `;

    export const GroupContainer = styled.div`
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

    export const Button = styled.div`
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
}

export function DiagramControls(props: ControlProps) {
    const { engine, refreshDiagram } = props;

    const downloadDiagram = () => {
        const canvas: HTMLDivElement = engine.getCanvas();
        if (!canvas) {
            return;
        }

        toJpeg(canvas, { cacheBust: true, quality: 0.95, width: canvas.scrollWidth, height: canvas.scrollHeight })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'er-diagram.jpeg';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onZoom = (zoomIn: boolean) => {
        let delta: number = zoomIn ? +5 : -5;
        engine.getModel().setZoomLevel(engine.getModel().getZoomLevel() + delta);
        engine.repaintCanvas();
    }

    const zoomToFit = () => {
        engine.zoomToFitNodes({ margin: 10, maxZoom: 1 });
    }

    return (
        <ControlsStyles.Container>
            <ControlsStyles.Button onClick={downloadDiagram} title='Download'>
                <Icon name="bi-download" iconSx={{ fontSize: "16px"}}/>
            </ControlsStyles.Button>
            <ControlsStyles.Button onClick={refreshDiagram} title='Refresh'>
                <Icon name="bi-retry" iconSx={{ fontSize: "16px"}}/>
            </ControlsStyles.Button>
            <ControlsStyles.Button onClick={zoomToFit} title='Zoom to fit nodes'>
                <Icon name="bi-fit-screen" iconSx={{ fontSize: "16px"}}/>
            </ControlsStyles.Button>
            <ControlsStyles.GroupContainer>
                <ControlsStyles.Button onClick={() => onZoom(true)} title='Zoom in'>
                    <Icon name="bi-plus" iconSx={{ fontSize: "16px"}}/>
                </ControlsStyles.Button>
                <ControlsStyles.Button onClick={() => onZoom(false)} title='Zoom out'>
                    <Icon name="bi-minus" iconSx={{ fontSize: "16px"}} />
                </ControlsStyles.Button>
            </ControlsStyles.GroupContainer>
        </ControlsStyles.Container>
    )
}
