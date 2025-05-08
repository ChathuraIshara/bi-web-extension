/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import "@wso2-enterprise/font-wso2-vscode/dist/wso2-vscode.css";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import styled from "@emotion/styled";

interface ProgressRingProps {
    sx?: React.CSSProperties;
    color?: string;
}

const StyledProgressRing = styled(VSCodeProgressRing)<{ color?: string }>`
    &::part(indeterminate-indicator-1) {
        stroke: ${(props: { color: string }) => props.color || "var(--vscode-progressBar-background)"};
    }
`;

export const ProgressRing: React.FC<ProgressRingProps> = (props: ProgressRingProps) => (
    <StyledProgressRing style={props.sx} color={props.color} />
);

export default ProgressRing;
