/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode, useEffect, useState } from 'react';
import styled from "@emotion/styled";
import { Codicon } from '../Codicon/Codicon';

export interface TreeViewProps {
    id: string;
    content?: string | ReactNode;
    children?: ReactNode;
    rootTreeView?: boolean;
    selectedId?: string;
    disableClick?: boolean;
    sx?: any;
    onSelect?: (id: string) => void;
}

interface TreeContainerProps {
    isRootTreeView: boolean;
    sx?: any;
}
const TreeContainer = styled.div<TreeContainerProps>`
    padding-left: ${(props: TreeContainerProps) => props.isRootTreeView ? 0 : "20px"};
    ${(props: TreeContainerProps) => props.sx}
`;

interface IconContainerProps {
    isCollapsed: boolean;
    isSelected?: boolean;
}
const IconContainer = styled.div<IconContainerProps>`
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    padding-top: 3px;
    background-color: ${(props: IconContainerProps) => props.isSelected ? "var(--vscode-editorHoverWidget-background)" : "transparent"};
    &:hover {
        background-color: var(--vscode-editorHoverWidget-background);
    }
`;
const EmptyContainer = styled.div`
    width: 14px;
`;

export const TreeView: React.FC<TreeViewProps> = (props: TreeViewProps) => {
    const { id, content, children, rootTreeView: isRootTreeView, onSelect, selectedId, disableClick = false, sx } = props
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = (sId: string) => {
        if (!disableClick) {
            if (onSelect) {
                onSelect(sId);
            }
            setIsExpanded(!isExpanded);
        }
    };

    const handleSelect = (sId: string) => {
        if (onSelect) {
            onSelect(sId);
        }
    };

    useEffect(() => {
        const hasSelectedChild = (children: ReactNode): boolean => {
            return React.Children.toArray(children).some((child: any) => {
                // Check if the child matches the selectedId
                if (child?.props?.id === selectedId) {
                    return true;
                }
                // Recursively check if the child has its own children
                return child?.props?.children && hasSelectedChild(child.props.children);
            });
        };
    
        // Expand if this TreeView is selected or contains the selected item
        if (selectedId === id || (children && hasSelectedChild(children))) {
            setIsExpanded(true);
        }
    }, [selectedId, id, children]);

    return (
        <TreeContainer isRootTreeView={isRootTreeView} sx={sx}>
            <div onClick={() => toggleExpand(id)}>
                <IconContainer isCollapsed={!isExpanded} isSelected={selectedId === id}>
                    {React.Children.count(children) === 0 ? <EmptyContainer /> : <Codicon name={isExpanded ? "chevron-down" : "chevron-right"} />} 
                    {content}
                </IconContainer>
            </div>
            {isExpanded && (
                <div>
                    {React.Children.map(children, child =>
                        React.cloneElement(child as React.ReactElement<any>, {
                            selectedId: selectedId,
                            disableClick: disableClick,
                            onSelect: handleSelect,
                        })
                    )}
                </div>
            )}
        </TreeContainer>
    );
};
