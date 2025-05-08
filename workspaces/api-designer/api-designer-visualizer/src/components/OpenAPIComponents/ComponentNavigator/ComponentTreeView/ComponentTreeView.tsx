/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TreeView, Typography } from '@wso2-enterprise/ui-toolkit';
import { LeftPathContainer, PathContainer } from '../ComponentNavigator';
import { OpenAPI } from '../../../../Definitions/ServiceDefinitions';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../../APIDesignerContext';
import { SchemaTreeView } from '../SchemaTreeView/SchemaTreeView';
import { ParameterTreeView } from '../ParameterTreeView/ParameterTreeView';
import { RequestBodyTreeView } from '../RequestBodyTreeView/RequestBodyTreeView';
import { ResponsesTreeView } from '../ResponsesTreeView/ResponsesTreeView';
import { PathID } from '../../../../constants';

interface PathTreeViewItemProps {
    openAPI: OpenAPI;
    onSchemaTreeViewChange: (openAPI: OpenAPI) => void;
}

export function ComponentTreeView(props: PathTreeViewItemProps) {
    const { openAPI, onSchemaTreeViewChange } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);
    return (
        <TreeView
            sx={{ paddingBottom: 2 }}
            rootTreeView
            id={PathID.COMPONENTS_COMPONENTS}
            content={
                <PathContainer>
                    <LeftPathContainer>
                        <Typography 
                            sx={{ 
                                margin: "0 0 0 2px",
                                fontWeight: 300,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }} 
                            variant="h4"
                        >
                            Components
                        </Typography>
                    </LeftPathContainer>
                </PathContainer>
            }
            selectedId={selectedComponentID}
            onSelect={onSelectedComponentIDChange}
        >
            <SchemaTreeView
                openAPI={openAPI}
                onSchemaTreeViewChange={onSchemaTreeViewChange}
            />
            <ParameterTreeView
                openAPI={openAPI}
                onParameterTreeViewChange={onSchemaTreeViewChange}
            />
            <RequestBodyTreeView
                openAPI={openAPI}
                onRequestBodyTreeViewChange={onSchemaTreeViewChange}
            />
            <ResponsesTreeView
                openAPI={openAPI}
                onResponseTreeViewChange={onSchemaTreeViewChange}
            />
        </TreeView>
    )
}
