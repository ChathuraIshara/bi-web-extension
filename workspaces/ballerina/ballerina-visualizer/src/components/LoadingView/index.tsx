/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import styled from '@emotion/styled';
import { ProgressRing, ThemeColors } from '@wso2-enterprise/ui-toolkit';

const LoadingContainer = styled.div<{ fullHeight?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${props => props.fullHeight ? '100vh' : '100%'};
    min-height: 200px;
`;

const LoadingText = styled.div`
    margin-top: 16px;
    color: var(--vscode-descriptionForeground);
    font-size: 14px;
`;

interface LoadingViewProps {
    message?: string;
    fullHeight?: boolean;
}

export function LoadingView({ message = 'Loading...', fullHeight = false }: LoadingViewProps) {
    return (
        <LoadingContainer fullHeight={fullHeight}>
             <ProgressRing color={ThemeColors.PRIMARY} />
            <LoadingText>{message}</LoadingText>
        </LoadingContainer>
    );
} 
