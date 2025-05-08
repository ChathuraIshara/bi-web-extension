/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { toJpeg } from 'html-to-image';
import { DiagramContext } from '../DiagramContext/DiagramContext';
import { CanvasControlButton } from './ControlButtons/ControlButton';
import { Codicon, Icon } from '@wso2-enterprise/ui-toolkit';

interface ControlProps {
    engine: DiagramEngine;
    refreshDiagram: () => void;
    showProblemPanel: () => void;
}

export const ControlPanel: React.FC<any> = styled.div`
    bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: space-between;
    position: absolute;
    right: 15px;
    width: 32px;
`;

export function DiagramControls(props: ControlProps) {
    const { engine, refreshDiagram, showProblemPanel } = props;
    const { hasDiagnostics } = useContext(DiagramContext);

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
        <ControlPanel >
            {hasDiagnostics &&
                <CanvasControlButton onClick={showProblemPanel} tooltipTitle={'Diagnostics were detected in the model.'}>
                    <Codicon
                        name="warning"
                        sx={{ height: "fit-content", width: "fit-content" }}
                        iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-inputValidation-errorBorder)" }}
                    />
                </CanvasControlButton>
            }
            <CanvasControlButton onClick={downloadDiagram} tooltipTitle={'Download'}>
                <Icon
                    name="import"
                    sx={{ height: "fit-content", width: "fit-content" }}
                    iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                />
            </CanvasControlButton>

            <CanvasControlButton onClick={refreshDiagram} tooltipTitle={'Refresh'}>
                <Icon
                    name="cached-round"
                    sx={{ height: "fit-content", width: "fit-content" }}
                    iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                />
            </CanvasControlButton>

            <CanvasControlButton onClick={zoomToFit} tooltipTitle={'Zoom to fit nodes'}>
                <Icon
                    name="fullscreen"
                    sx={{ height: "fit-content", width: "fit-content" }}
                    iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                />
            </CanvasControlButton>

            <div>
                <CanvasControlButton onClick={() => { onZoom(true) }} tooltipTitle={'Zoom in'}>
                    <Codicon name="add"
                        iconSx={{ fontWeight: "bolder", fontSize: "17px", color: "var(--vscode-input-placeholderForeground)" }}
                        sx={{ height: "fit-content", width: "fit-content" }}
                    />
                </CanvasControlButton>

                <CanvasControlButton onClick={() => { onZoom(false) }} tooltipTitle={'Zoom out'}>
                    <Codicon name="remove"
                        iconSx={{ fontWeight: "bolder", fontSize: "17px", color: "var(--vscode-input-placeholderForeground)" }}
                        sx={{ height: "fit-content", width: "fit-content" }}
                    />
                </CanvasControlButton>
            </div>
        </ControlPanel>
    )
}
