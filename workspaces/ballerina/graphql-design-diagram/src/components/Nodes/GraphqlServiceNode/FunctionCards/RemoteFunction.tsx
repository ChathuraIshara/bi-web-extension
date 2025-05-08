/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js
import React, { useState } from 'react';

import { DiagramEngine } from '@projectstorm/react-diagrams';
import { GraphqlMutationIcon } from "@wso2-enterprise/ballerina-core";
import { Popover } from '@wso2-enterprise/ui-toolkit';

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { ParametersPopup } from "../../../Popup/ParametersPopup";
import { popOverCompStyle } from "../../../Popup/styles";
import { GraphqlBasePortWidget } from "../../../Port/GraphqlBasePortWidget";
import { RemoteFunction } from "../../../resources/model";
import { FieldName, FieldType } from "../../../resources/styles/styles";
import { GraphqlServiceNodeModel } from "../GraphqlServiceNodeModel";

interface RemoteFunctionProps {
    engine: DiagramEngine;
    node: GraphqlServiceNodeModel;
    remoteFunc: RemoteFunction;
    remotePath: string;
}

export function RemoteFunctionWidget(props: RemoteFunctionProps) {
    const { engine, node, remoteFunc, remotePath } = props;
    const { setSelectedNode } = useGraphQlContext();

    const [isOpen, setIsOpen] = useState(false);
    const [anchorEvent, setAnchorEvent] = useState<null | HTMLElement>(null);
    const openPanel = (event: React.MouseEvent<HTMLElement>) => {
        setIsOpen(true);
        setAnchorEvent(event.currentTarget);
    };
    const closePanel = () => {
        setIsOpen(false);
        setAnchorEvent(null);
    };

    const updateSelectedNode = () => {
        setSelectedNode(remoteFunc.returns);
    }

    return (
        <>
            <GraphqlBasePortWidget
                port={node.getPort(`left-${remotePath}`)}
                engine={engine}
            />
            <GraphqlMutationIcon />
            <FieldName
                onMouseOver={openPanel}
                onMouseLeave={closePanel}
                style={{ marginLeft: '7px' }}
                data-testid={`remote-identifier-${remoteFunc.identifier}`}
            >
                {remoteFunc.identifier}
            </FieldName>
            <div onClick={updateSelectedNode}>
                <FieldType data-testid={`remote-type-${remoteFunc.returns}`}>{remoteFunc.returns}</FieldType>
            </div>
            <GraphqlBasePortWidget
                port={node.getPort(`right-${remotePath}`)}
                engine={engine}
            />
            {remoteFunc.parameters?.length > 0 && (
                <Popover
                    anchorOrigin={
                        {
                            vertical: "bottom",
                            horizontal: "center",
                        }
                    }
                    transformOrigin={
                        {
                            vertical: "center",
                            horizontal: "left",
                        }
                    }
                    sx={popOverCompStyle}
                    open={isOpen}
                    anchorEl={anchorEvent}
                >
                    <ParametersPopup parameters={remoteFunc.parameters} />
                </Popover>
            )}
        </>
    );
}
