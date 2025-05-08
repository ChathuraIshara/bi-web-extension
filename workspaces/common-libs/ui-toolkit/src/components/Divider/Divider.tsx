/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from '@emotion/styled';
import React from 'react';
export interface DeviderProps {
    id?: string;
    className?: string;
    sx?: any;
}

const Container = styled.div<DeviderProps>`
	border-top: 1px solid var(--vscode-editorIndentGuide-background);
	margin: 10px 0;
	${(props: DeviderProps) => props.sx};
`;

export const Divider: React.FC<DeviderProps> = (props: DeviderProps) => {
    const { id, className, sx } = props;
    return (
        <Container id={id} className={className} sx={sx} />
    );
};
