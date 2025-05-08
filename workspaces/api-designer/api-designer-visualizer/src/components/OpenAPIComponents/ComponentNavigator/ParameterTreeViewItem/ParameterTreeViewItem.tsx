/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, Codicon, Typography, TreeViewItem } from '@wso2-enterprise/ui-toolkit';
import { RightPathContainerButtons } from '../ComponentNavigator';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../../APIDesignerContext';
import { PathID } from '../../../../constants';

const ParameterItemWrapper = styled.div`
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

const ParamTypeWrapper = styled.div`
    margin-left: 5px;
    color: var(--vscode-list-deemphasizedForeground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 0 2px;
`;

interface PathTreeViewItemProps {
    id: string;
    parameterName: string;
    parameterType: string;
    onDeleteParameter: (schema: string) => void;
}

export function ParameterTreeViewItem(props: PathTreeViewItemProps) {
    const { id, parameterName, parameterType, onDeleteParameter } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);

    const handleDeleteParameter = (e: React.MouseEvent, schema: string) => {
        e.stopPropagation();
        onDeleteParameter(schema);
    };

    return (
        <div onClick={() => onSelectedComponentIDChange(`${PathID.PARAMETERS_COMPONENTS}${PathID.SEPERATOR}${parameterName}`)}>
            <TreeViewItem id={id} selectedId={selectedComponentID}>
                <ParameterItemWrapper>
                    <Typography
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            margin: "0 0 0 2px",
                            fontWeight: 300
                        }}
                        variant="h4"
                    >
                        {parameterName}
                        <ParamTypeWrapper>{`[${parameterType}]`}</ParamTypeWrapper>
                    </Typography>
                    <RightPathContainerButtons className="buttons-container">
                        <Button tooltip="Delete Parameter" appearance="icon" onClick={(e) => handleDeleteParameter(e, parameterName)}><Codicon name="trash" /></Button>
                    </RightPathContainerButtons>
                </ParameterItemWrapper>
            </TreeViewItem>
        </div>
    )
}
