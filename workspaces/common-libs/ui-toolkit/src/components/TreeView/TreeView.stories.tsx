/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import React from 'react';
import Typography from '../Typography/Typography';
import { storiesOf } from '@storybook/react';
import { TreeView } from './TreeView';
import { TreeViewItem } from './TreeViewItem';

export default {
    component: TreeView,
    title: 'TreeView',
};

interface OperationProps {
    backgroundColor: string;
    selected: boolean;
}

const Operation = styled.div<OperationProps>`
    background-color: ${(props: OperationProps) => props.backgroundColor};
    border: ${(props: OperationProps) => props.selected ? "2px solid var(--vscode-inputOption-activeForeground)" : "2px solid transparent"};
    border-radius: 4px;
    margin-bottom: 2px;
    width: fit-content;
    color: white;
    cursor: pointer;
`;

export const TreeViewStory = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const handleClick = (id: string) => {
        setSelectedId(id);
    };
    
    return (
        <TreeView rootTreeView id="1" content={<Typography sx={{margin: 0}} variant="h4">Item 1</Typography>} selectedId={selectedId} onSelect={handleClick}>
            <TreeViewItem id="1-1">
                <Operation backgroundColor="#3d7eff" selected={selectedId === "1-1"}>
                    <Typography variant="h5" sx={{ margin: 0, padding: 6 }}>GET</Typography>
                </Operation>
            </TreeViewItem>
            <TreeViewItem id="1-2">
                <Operation backgroundColor="#49cc90" selected={selectedId === "1-1"}>
                    <Typography variant="h5" sx={{ margin: 0, padding: 6 }}>POST</Typography>
                </Operation>
            </TreeViewItem>
            <TreeView id="1-3" content={<Typography sx={{margin: 0}} variant="h4">Item 1.1</Typography>} selectedId={selectedId} onSelect={handleClick}>
                <TreeViewItem id="1-3-1">Body 1.3.1</TreeViewItem>
            </TreeView>
            <TreeView id="1-4" content={<Typography sx={{margin: 0}} variant="h4">Item 1.2</Typography>} />
        </TreeView>
    );
};

storiesOf("TreeView").add("TreeViewStory", () => <TreeViewStory />);
