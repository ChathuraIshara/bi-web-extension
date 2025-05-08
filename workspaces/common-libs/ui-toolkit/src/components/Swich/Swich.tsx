/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode } from "react";
import styled from "@emotion/styled";

interface SwichContainerProps {
    sx?: any;
    active?: boolean;
    color?: string;
    enableTransition?: boolean;
    disabled?: boolean;
}

const SwitchContainer = styled.div<SwichContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    height: 30px;
    width: 200px;
    border: 1px solid var(--vscode-tree-indentGuidesStroke);
    border-radius: 4px;
    opacity: ${(props: SwichContainerProps) => props.disabled ? 0.5 : 1};
    ${(props: SwichContainerProps) => props.sx};
`;

const LeftInnerContainer = styled.div<SwichContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 50%;
    background-color: var(--vscode-tab-unfocusedInactiveBackground);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
`;

const RightInnerContainer = styled.div<SwichContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 50%;
    background-color: var(--vscode-tab-unfocusedInactiveBackground);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
`;

const InnerContainer = styled.div<SwichContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    font-weight: bold;
    color: ${(props: SwichContainerProps) => props.active ? (props.color ? props.color : "var(--vscode-editorOverviewRuler-warningForeground)") : "var(--vscode-editor-foreground)"};
    background-color: ${(props: SwichContainerProps) => props.active ? "var(--vscode-editor-background)" : "var(--vscode-tab-unfocusedInactiveBackground)"};
    margin: 4px;
    border-radius: ${(props: SwichContainerProps) => props.active ? "4px" : 0};
    transition: ${(props: SwichContainerProps) => props.enableTransition ? "all 0.3s ease-in-out" : "none"};
`;

const Content = styled.div<SwichContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    user-select: none;
`;

const IconContainer = styled.div`
    margin-right: 4px;
`;

export interface SwitchProps {
    id?: string;
    className?: string;
    sx?: any;
    checked: boolean;
    leftLabel: string|ReactNode;
    rightLabel: string|ReactNode;
    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
    checkedColor?: string;
    enableTransition?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    onChange: () => void;
}

const getCheckedComponent = (text: string|ReactNode, icon: ReactNode, color: string, transitionEnabled: boolean) => {
    return (
        <InnerContainer active={true} color={color} enableTransition={transitionEnabled} >
            <Content>
                {icon && (
                    <IconContainer>
                        {icon}
                    </IconContainer>
                )}
                <>
                    {text}
                </>
            </Content>
        </InnerContainer>
    );
}

const getUncheckedComponent = (text: string|ReactNode, icon: ReactNode) => {
    return (
        <InnerContainer active={false}>
            <Content>
                {icon && (
                    <IconContainer>
                        {icon}
                    </IconContainer>
                )}
                <>
                    {text}
                </>
            </Content>
        </InnerContainer>
    );
}

export const Switch: React.FC<SwitchProps> = (props: SwitchProps) => {
    const { id, className, sx, checked, leftLabel, rightLabel, checkedIcon,
        uncheckedIcon, checkedColor, enableTransition, disabled, readonly, onChange 
    } = props;
    const handleLeftComponentClick = () => {
        if (checked && !readonly && !disabled) {
            onChange();
        }
    }
    const handleRightComponentClick = () => {
        if (!(checked || readonly || disabled)) {
            onChange();
        }
    }
    return (
        <SwitchContainer id={id} className={className} sx={sx} disabled={disabled}>
            <LeftInnerContainer onClick={handleLeftComponentClick}>
                {checked ?
                    getUncheckedComponent(leftLabel, uncheckedIcon) :
                    getCheckedComponent(leftLabel, checkedIcon, checkedColor, enableTransition)
                }
            </LeftInnerContainer >
            <RightInnerContainer onClick={handleRightComponentClick}>
                {checked ?
                    getCheckedComponent(rightLabel, checkedIcon, checkedColor, enableTransition) : 
                    getUncheckedComponent(rightLabel, uncheckedIcon)
                }
            </RightInnerContainer>
        </SwitchContainer>
    );
};
