/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, Codicon, TreeView, Typography } from '@wso2-enterprise/ui-toolkit';
import { LeftPathContainer, PathContainer, RightPathContainerButtons } from '../ComponentNavigator';
import { OpenAPI } from '../../../../Definitions/ServiceDefinitions';
import { PathTreeViewItem } from '../PathTreeViewItem/PathTreeViewItem';
import { useVisualizerContext } from '@wso2-enterprise/api-designer-rpc-client';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../../APIDesignerContext';
import { PathID } from '../../../../constants';

interface PathTreeViewProps {
    id: string;
    openAPI: OpenAPI;
    path: string;
    operations: string[];
    onPathTreeViewChange: (openAPI: OpenAPI) => void;
}

export function PathTreeView(props: PathTreeViewProps) {
    const { id, openAPI, path, operations, onPathTreeViewChange } = props;
    const { rpcClient } = useVisualizerContext();
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);

    const handlePathTreeViewChange = (openAPI: OpenAPI) => {
        onPathTreeViewChange(openAPI);
    };
    const handleDeletePath = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        rpcClient.showConfirmMessage({ message: `Are you sure you want to delete the Path '${path}'?`, buttonText: "Delete" }).then(res => {
            if (res) {
                const { paths } = openAPI;
                const updatedPaths = { ...paths };
                delete updatedPaths[path];
                handlePathTreeViewChange({ ...openAPI, paths: updatedPaths });
                if (Object.keys(updatedPaths).length > 0) {
                    onSelectedComponentIDChange(`${PathID.PARAMETERS_COMPONENTS}${PathID.SEPERATOR}${Object.keys(updatedPaths)[0]}`);
                } else {
                    onSelectedComponentIDChange(PathID.OVERVIEW);
                }
            }
        });
    };

    return (
        <TreeView
            id={id}
            content={
                <PathContainer>
                    <LeftPathContainer>
                        <Typography
                            sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                margin: "0 0 0 2px",
                                fontWeight: 300
                            }} variant="h4">
                            {path}
                        </Typography>
                    </LeftPathContainer>

                    <RightPathContainerButtons className="buttons-container">
                        <Button tooltip="Delete Path" appearance="icon" onClick={(e) => handleDeletePath(e, String(path))}><Codicon name="trash" /></Button>
                    </RightPathContainerButtons>
                </PathContainer>
            }
            selectedId={selectedComponentID}
            onSelect={(id) => onSelectedComponentIDChange(id)}
        >
            {operations?.map((operation) => {
                return (
                    <PathTreeViewItem
                        id={`${PathID.PATHS_COMPONENTS}${PathID.SEPERATOR}${path}${PathID.SEPERATOR}${operation}`}
                        openAPI={openAPI}
                        path={path}
                        operation={operation}
                        onPathTreeViewItemChange={handlePathTreeViewChange}
                    />
                );
            })}
        </TreeView>
    )
}
