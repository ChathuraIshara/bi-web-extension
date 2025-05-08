/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { Icon } from "@wso2-enterprise/ui-toolkit";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { BetaSVG } from "../../views/Connectors/Marketplace/BetaSVG";

const TitleBarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    min-height: 56px;
    background-color: var(--vscode-editorWidget-background);
    z-index: 1000;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    width: 100%;
`;

const RightContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const TitleSection = styled.div`
    display: flex;
    align-items: baseline;
    gap: 12px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--vscode-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: fit-content;
`;

const SubTitle = styled.span`
    font-size: 14px;
    color: var(--vscode-descriptionForeground);
`;

const ActionsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const IconButton = styled.div`
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: var(--vscode-toolbar-hoverBackground);
    }

    & > div:first-child {
        width: 24px;
        height: 24px;
        font-size: 24px;
    }
`;

const BetaSVGWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    margin-top: 2px;
`;

interface TitleBarProps {
    title: string;
    subtitle?: string;
    subtitleElement?: ReactNode;
    actions?: ReactNode;
    hideBack?: boolean;
    onBack?: () => void; // Override back functionality
    isBetaFeature?: boolean;
}

export function TitleBar(props: TitleBarProps) {
    const { title, subtitle, subtitleElement, actions, hideBack, onBack, isBetaFeature } = props;
    const { rpcClient } = useRpcContext();

    const handleBackButtonClick = () => {
        if (onBack) {
            onBack();
        } else {
            rpcClient.getVisualizerRpcClient().goBack();
        }
    };

    return (
        <TitleBarContainer>
            <LeftContainer>
                {!hideBack && (
                    <IconButton onClick={handleBackButtonClick}>
                        <Icon name="bi-arrow-back" iconSx={{ fontSize: "24px", color: "var(--vscode-foreground)" }} />
                    </IconButton>
                )}
                <TitleSection>
                    <Title>{title}</Title>
                    {subtitle && <SubTitle>{subtitle}</SubTitle>}
                    {subtitleElement && subtitleElement}
                </TitleSection>
                {isBetaFeature && (
                    <BetaSVGWrapper>
                        <BetaSVG width={45} height={18} />
                    </BetaSVGWrapper>
                )}
            </LeftContainer>
            <RightContainer>{actions && <ActionsContainer>{actions}</ActionsContainer>}</RightContainer>
        </TitleBarContainer>
    );
}
