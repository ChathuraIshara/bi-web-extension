/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode } from 'react';
import styled from "@emotion/styled";
import { Divider } from '../Divider/Divider';

export interface ViewItem {
    id: string;
    name: string;
    icon?: ReactNode;
    moreOptions?: ReactNode;
}
export interface TabsProps {
    views: ViewItem[];
    children: ReactNode;
    currentViewId?: string;
    sx?: any;
    childrenSx?: any;
    titleContainerSx?: any;
    tabTitleSx?: any;
    onViewChange?: (view: string) => void;
}

interface ViewSelectorContainerProps {
    sx: boolean;
}
const ViewSelectorContainer = styled.div<ViewSelectorContainerProps>`
    ${(props: ViewSelectorContainerProps) => props.sx};
`

interface ViewSelectorTabProps {
    isSelected: boolean;
    isFirst: boolean;
}
const Tab = styled.div<ViewSelectorTabProps>`
    display: flex;
    flex-direction: row;
    background-color: var(--vscode-editor-background);
    color: ${(props: ViewSelectorTabProps) => props.isSelected ? 'var(--vscode-focusBorder)' : 'var(--vscode-editor-foreground)'};
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        color: var(--vscode-focusBorder);
    }
`
const ViewSelectorTabsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
`
const TabContent = styled.div<ViewSelectorContainerProps>`
    display: flex;
    flex-direction: column;
    ${(props: TabsProps) => props.sx};
`
const Container = styled.div<ViewSelectorContainerProps>`
    background-color: var(--vscode-editor-background);
    ${(props: ViewSelectorContainerProps) => props.sx};
`
interface ChildrenContainerProps {
    sx: any;
}
const ChildrenContainer = styled.div<ChildrenContainerProps>`
    display: flex;
    flex-direction: column;
    ${(props: ChildrenContainerProps) => props.sx};
`

export const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
    const { views, children, currentViewId, onViewChange, sx, childrenSx, tabTitleSx, titleContainerSx } = props;

    return (
        <ViewSelectorContainer sx={sx}>
            <Container sx={titleContainerSx}>
                <ViewSelectorTabsContainer>
                    {
                        views.map((view, index) => {
                            return (
                                <TabContent sx={tabTitleSx} key={view.id}>
                                    <Tab 
                                        isFirst={index === 0}
                                        isSelected={currentViewId === view.id}
                                        onClick={() => onViewChange(view.id)}
                                    >
                                        {view.icon}
                                        {view.name}
                                        {view.moreOptions}
                                    </Tab>
                                    <Divider sx={{margin: 0, borderTop: currentViewId === view.id ? '2px solid var(--vscode-focusBorder)' : 'none'}} />
                                </TabContent>
                            );
                        })
                    }
                </ViewSelectorTabsContainer>
                <Divider sx={{margin: 0, borderTop: '1px solid var(--vscode-editorIndentGuide-background)'}} />
            </Container>
            {/* Render the children based on the currentViewId */}
            <ChildrenContainer sx={childrenSx}>
                {React.Children.map(children, child => {
                    if (React.isValidElement(child) && child.props.id === currentViewId) {
                        return child;
                    }
                    return null;
                })}
            </ChildrenContainer>
        </ViewSelectorContainer>
    );
};
