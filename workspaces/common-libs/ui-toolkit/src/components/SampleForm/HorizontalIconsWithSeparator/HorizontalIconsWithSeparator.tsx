/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import { ComponentCard } from '../../ComponentCard/ComponentCard';
import { Icon } from '../../Icon/Icon';
import styled from '@emotion/styled';
import { Codicon } from '../../Codicon/Codicon';

const ComponentIconWrapper = styled.div`
    display: flex;
    min-width: 10%;
    height: 60px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const PlusIconWrapper = styled.div`
    display: flex;
    width: 10%;
    height: 60px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export interface IconContainerProps {
    id?: string;
    className?: string;
    leftIconName?: string;
    rightIconName?: string;
    title?: string;
    description?: string;
    sx?: any;
    onClick?: () => void;
}

const CardContent = styled.div`
    display: flex;
    flex-grow: 1;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    padding-top: 10px;
    padding-left: 4px;
`;

const TopTextContainer = styled.div`
    font-family: var(--font-family);
    font-size: 20px;
    font-weight: 500;
    color: var(--vscode-charts-purple);
`;

const BottomTextContainer = styled.div`
    font-family: var(--font-family);
    font-size: 16px;
    color: var(--vscode-editor-foreground);
`;

const Divider = styled.div`
    margin-top: 10px;
    align-items: space-between;
    width: 1px;
    height: 40px;
    background-color: var(--vscode-dropdown-border);
`;

const Container = styled.div<IconContainerProps>`
	${(props: IconContainerProps) => props.sx};
`;

const iconStyles = { 
    display: "flex", alignItem: "center", justifyContent: "center", fontSize: 40, height: "fix-content", marginTop: -10
};

const plusStyles = { 
    display: "flex", alignItem: "center", justifyContent: "center", fontSize: 25, height: "fix-content", marginTop: -2, marginLeft: -10
};

export const HorizontalIconsWithSeparator = (props: IconContainerProps) => {
    const { id, className, title, leftIconName, rightIconName,  description, sx, onClick } = props;

    return (
        <Container id={id} className={className} sx={sx}>
            <ComponentCard onClick={onClick} sx={{display: "flex",  flexDirection: "row", justifyContent: "flex-start", width: "unset", minWidth: 600, padding: "10px 0", cursor: "default", "&:hover, &.active": { background: "var(--vscode-background)" } }}>
                <CardContent>
                    <ComponentIconWrapper>
                        <Icon iconSx={iconStyles} name={leftIconName} />
                    </ComponentIconWrapper>
                    <TextContainer>
                        <TopTextContainer>{title}</TopTextContainer>
                        <BottomTextContainer>{description}</BottomTextContainer>
                    </TextContainer>
                    <Divider />
                    <PlusIconWrapper>
                        <Codicon iconSx={plusStyles} name={rightIconName}/>
                    </PlusIconWrapper>
                </CardContent>
            </ComponentCard>
        </Container>
    );
};
