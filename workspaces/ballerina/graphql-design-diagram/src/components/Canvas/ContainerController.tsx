/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-lambda
import React from 'react';

import styled from "@emotion/styled";
import { Codicon, Icon } from '@wso2-enterprise/ui-toolkit';

import { CanvasControlTooltip } from './CanvasControlTooltip';

interface ContainerControllerProps {
    zoomToFit: () => void;
    onZoom: (zoomIn: boolean) => void;
    onDownload?: () => void;
}

const ControlPanel: React.FC<any> = styled.div`
  bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: space-between;
  position: absolute;
  right: 30px;
  width: 32px;
  height: fit-content;
  min-height: max-content;

  .control-button {
    background-color: white !important;
    border: 1px solid #E0E2E9 !important;
    border-radius: 2px !important;
    height: 32px !important;
    width: 32px !important;
  }
`;


export function ContainerController(props: ContainerControllerProps) {
    const { onZoom, zoomToFit, onDownload } = props;

    return (
        <ControlPanel>
            <CanvasControlTooltip onClick={onDownload} tooltipTitle={'Download'}>
                <Icon
                    name="import"
                    sx={{ height: "fit-content", width: "fit-content" }}
                    iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                />
            </CanvasControlTooltip>
            <CanvasControlTooltip onClick={zoomToFit} tooltipTitle={'Fit to screen'}>
                <Icon
                    name="fullscreen"
                    sx={{ height: "fit-content", width: "fit-content" }}
                    iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                />
            </CanvasControlTooltip>
            <div>
                <CanvasControlTooltip onClick={() => { onZoom(true) }} tooltipTitle={'Zoom in'}>
                    <Codicon
                        name="add"
                        iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                        sx={{ height: "fit-content", width: "fit-content" }}
                    />
                </CanvasControlTooltip>
                <CanvasControlTooltip onClick={() => { onZoom(false) }} tooltipTitle={'Zoom out'}>
                    <Codicon
                        name="remove"
                        iconSx={{ fontWeight: "bolder", fontSize: "20px", color: "var(--vscode-input-placeholderForeground)" }}
                        sx={{ height: "fit-content", width: "fit-content" }}
                    />
                </CanvasControlTooltip>
            </div>
        </ControlPanel>
    )
}
