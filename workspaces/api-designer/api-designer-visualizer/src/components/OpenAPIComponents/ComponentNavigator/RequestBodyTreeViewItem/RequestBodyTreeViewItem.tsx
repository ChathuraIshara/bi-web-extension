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

const RequestBodyItemWrapper = styled.div`
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

interface RequestBodyTreeViewItemProps {
    id: string;
    requestBody: string;
    onDeleteRequestBody: (schema: string) => void;
}

export function RequestBodyTreeViewItem(props: RequestBodyTreeViewItemProps) {
    const { id, requestBody, onDeleteRequestBody } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);

    const handleDeleteParameter = (e: React.MouseEvent, schema: string) => {
        e.stopPropagation();
        onDeleteRequestBody(schema);
    };

    return (
        <div onClick={() => onSelectedComponentIDChange(`${PathID.REQUEST_BODY_COMPONENTS}${PathID.SEPERATOR}${requestBody}`)}>
            <TreeViewItem id={id} selectedId={selectedComponentID}>
                <RequestBodyItemWrapper>
                    <Typography
                        sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            margin: "0 0 0 2px",
                            fontWeight: 300
                        }}
                        variant="h4">
                        {requestBody}
                    </Typography>
                    <RightPathContainerButtons className="buttons-container">
                        <Button tooltip="Delete Request Body" appearance="icon" onClick={(e) => handleDeleteParameter(e, requestBody)}><Codicon name="trash" /></Button>
                    </RightPathContainerButtons>
                </RequestBodyItemWrapper>
            </TreeViewItem>
        </div>
    )
}
