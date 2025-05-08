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
import { Typography } from '@wso2-enterprise/ui-toolkit';

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 0;
    padding: 0 16px;
`;

const Title = styled(Typography)`
    margin-bottom: 0;
    color: var(--vscode-foreground);
`;

const Description = styled(Typography)`
    color: var(--vscode-descriptionForeground);
`;

interface FormHeaderProps {
    title: string;
    subtitle?: string;
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
    return (
        <HeaderContainer>
            <Title variant="h3">{title}</Title>
            {subtitle && (
                <Description variant="body2">
                    {subtitle}
                </Description>
            )}
        </HeaderContainer>
    );
} 
