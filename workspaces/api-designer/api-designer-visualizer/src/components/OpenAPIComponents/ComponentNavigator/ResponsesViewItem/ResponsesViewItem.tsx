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

const ResponseViewItemWrapper = styled.div`
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

interface ResponseViewItemProps {
    id: string;
    response: string;
    onDeleteResponse: (schema: string) => void;
}

export function ResponseViewItem(props: ResponseViewItemProps) {
    const { id, response: response, onDeleteResponse } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);

    const handleDeleteResponse = (e: React.MouseEvent, response: string) => {
        e.stopPropagation();
        onDeleteResponse(response);
    };

    return (
        <div onClick={() => onSelectedComponentIDChange(`${PathID.RESPONSE_COMPONENTS}${PathID.SEPERATOR}${response}`)}>
            <TreeViewItem id={id} selectedId={selectedComponentID}>
                <ResponseViewItemWrapper>
                    <Typography
                        sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            margin: "0 0 0 2px",
                            fontWeight: 300
                        }}
                        variant="h4">
                        {response}
                    </Typography>
                    <RightPathContainerButtons className="buttons-container">
                        <Button tooltip="Delete Response" appearance="icon" onClick={(e) => handleDeleteResponse(e, response)}><Codicon name="trash" /></Button>
                    </RightPathContainerButtons>
                </ResponseViewItemWrapper>
            </TreeViewItem>
        </div>
    )
}
