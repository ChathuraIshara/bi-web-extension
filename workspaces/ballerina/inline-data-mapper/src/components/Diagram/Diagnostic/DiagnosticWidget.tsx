/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { Button, Icon } from "@wso2-enterprise/ui-toolkit";

import { DiagnosticTooltip } from "./DiagnosticTooltip";

export interface DiagnosticWidgetProps {
    diagnostic: any,
    value?: string,
    onClick?: () => void,
    isLabelElement? : boolean,
    btnSx?: React.CSSProperties
}

export function DiagnosticWidget(props: DiagnosticWidgetProps) {
    const {diagnostic, value, onClick, btnSx} =  props;

    return (
        <DiagnosticTooltip diagnostic={diagnostic} value={value} onClick={onClick}>
            <Button
                appearance="icon"
                data-testid={`expression-label-diagnostic`}
                onClick={onClick}
                sx={btnSx}
            >
                <Icon
                    name="error-icon"
                    sx={{ height: "14px", width: "14px" }}
                    iconSx={{ fontSize: "14px", color: "var(--vscode-errorForeground)" }}
                />
            </Button>
        </DiagnosticTooltip>
    )
}
