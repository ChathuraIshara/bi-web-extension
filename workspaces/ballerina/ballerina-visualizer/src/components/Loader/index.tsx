/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";
import styled from "@emotion/styled";
import { ProgressRing, ThemeColors } from "@wso2-enterprise/ui-toolkit";
import { Typography } from "@wso2-enterprise/ui-toolkit";
interface LoadingRingProps {
    message?: string;
}

export const LoadingRing = ({ message }: LoadingRingProps) => {
    const ProgressContainer = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
    `;

    const LoadingText = styled(Typography)`
        margin-top: 16px;
        color: var(--vscode-descriptionForeground);
        font-size: 14px;
    `;

    return (
        <ProgressContainer>
            <ProgressRing color={ThemeColors.PRIMARY} />
            {message && (
                <LoadingText variant="body2">
                    {message}
                </LoadingText>
            )}
        </ProgressContainer>
    );
};
