/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, Codicon, TreeViewItem, Typography } from '@wso2-enterprise/ui-toolkit';
import { RightPathContainerButtons } from '../ComponentNavigator';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../../APIDesignerContext';
import { PathID } from '../../../../constants';

const SchemaItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 6px;
    width: 100%;
    padding: 2px 0;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 5px;
    position: relative;
    &:hover div.buttons-container {
        opacity: 1;
    }
`;

interface PathTreeViewItemProps {
    id: string;
    schema: string;
    onDeleteSchema: (schema: string) => void;
}

export function SchemaTreeViewItem(props: PathTreeViewItemProps) {
    const { id, schema, onDeleteSchema } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);

    const handleDeleteSchema = (e: React.MouseEvent, schema: string) => {
        e.stopPropagation();
        onDeleteSchema(schema);
    };

    return (
        <div onClick={() => onSelectedComponentIDChange(`${PathID.SCHEMA_COMPONENTS}${PathID.SEPERATOR}${schema}`)}>
            <TreeViewItem id={id} selectedId={selectedComponentID}>
                <SchemaItemWrapper>
                    <Typography
                        sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            margin: "0 0 0 2px",
                            fontWeight: 300
                        }}
                        variant="h4">
                        {schema}
                    </Typography>
                    <RightPathContainerButtons className="buttons-container">
                        <Button tooltip="Delete Schema" appearance="icon" onClick={(e) => handleDeleteSchema(e, schema)}><Codicon name="trash" /></Button>
                    </RightPathContainerButtons>
                </SchemaItemWrapper>
            </TreeViewItem>
        </div>
    )
}
