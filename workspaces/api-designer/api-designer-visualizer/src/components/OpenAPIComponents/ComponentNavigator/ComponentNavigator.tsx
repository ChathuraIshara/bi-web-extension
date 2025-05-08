/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Codicon, Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { OpenAPI } from '../../../Definitions/ServiceDefinitions';
import { PathsTreeView } from './PathsTreeView/PathsTreeView';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { ComponentTreeView } from './ComponentTreeView/ComponentTreeView';
import { PathID } from '../../../constants';

interface ContainerProps {
    selected?: boolean;
}
const OverviewTitle = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    gap: 6px;
    padding: 0px 0;
    cursor: pointer;
    background-color: ${(props: ContainerProps) => props.selected ? "var(--vscode-editorHoverWidget-background)" : "none"};
    &:hover {
        background-color: var(--vscode-editorHoverWidget-background);
    }
`;
export const LeftPathContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    width: 100%;
`;
export const RightPathContainerButtons = styled.div`
    display: flex;
    gap: 1px;
    opacity: 0;
    align-items: center;
    transition: opacity 0.2s ease;
    position: absolute;
    right: 0;
    z-index: 10;
    background: var(--vscode-editor-background);
`
export const PathContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    position: relative;
    cursor: pointer;
    width: 100%;
    &:hover div.buttons-container {
        opacity: 1;
    }
`;
export const PathItemWrapper = styled.div<ContainerProps>`
    display: flex;
    flex-direction: row;
    gap: 6px;
    width: 100%;
    padding: 0px 0;
    cursor: pointer;
    position: relative;;
    background-color: ${(props: ContainerProps) => props.selected ? "var(--vscode-editorHoverWidget-background)" : "none"};
    &:hover div.buttons-container {
        opacity: 1;
    }
`;
interface OperationProps {
    foreGroundColor: string;
    hoverForeGroundColor?: string;
}
export const Operation = styled.div<OperationProps>`
    width: fit-content;
    color: ${(props: OperationProps) => props.foreGroundColor};
    cursor: pointer;
    &:hover { // Added hover style
        color: ${(props: OperationProps) => props.hoverForeGroundColor || props.foreGroundColor};
    }
`;

interface ComponentNavigatorProps {
    openAPI: OpenAPI;
    onComponentNavigatorChange: (openAPI: OpenAPI) => void;
}

export function ComponentNavigator(props: ComponentNavigatorProps) {
    const { openAPI, onComponentNavigatorChange } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);

    const handleComponentNavigatorChange = (openAPI: OpenAPI) => {
        onComponentNavigatorChange(openAPI);
    };

    return (
        <div>
            <OverviewTitle selected={selectedComponentID === PathID.OVERVIEW} onClick={() => onSelectedComponentIDChange(PathID.OVERVIEW)}>
                <Codicon sx={{ marginTop: -1 }} name="globe" />
                <Typography variant="h4" sx={{ margin: 0, fontWeight: 300 }}>Overview</Typography>
            </OverviewTitle>
            <PathsTreeView
                openAPI={openAPI}
                onPathTreeViewChange={handleComponentNavigatorChange}
                paths={openAPI.paths}
            />
            <ComponentTreeView
                openAPI={openAPI}
                onSchemaTreeViewChange={handleComponentNavigatorChange}
            />
        </div>
    )
}
