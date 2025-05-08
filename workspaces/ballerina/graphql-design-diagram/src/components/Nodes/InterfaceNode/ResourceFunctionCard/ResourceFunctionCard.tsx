/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js
import React, { useEffect, useRef, useState } from "react";

import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";
import { Popover } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { ParametersPopup } from "../../../Popup/ParametersPopup";
import { popOverCompStyle } from "../../../Popup/styles";
import { GraphqlBasePortWidget } from "../../../Port/GraphqlBasePortWidget";
import { ResourceFunction } from "../../../resources/model";
import { FieldName, FieldType, NodeFieldContainer } from "../../../resources/styles/styles";
import { InterfaceNodeModel } from "../InterfaceNodeModel";

interface ResourceFunctionCardProps {
    engine: DiagramEngine;
    node: InterfaceNodeModel;
    functionElement: ResourceFunction;
}

export function ResourceFunctionCard(props: ResourceFunctionCardProps) {
    const { engine, node, functionElement } = props;
    const { setSelectedNode } = useGraphQlContext();

    const functionPorts = useRef<PortModel[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEvent, setAnchorEvent] = useState<null | HTMLElement>(null);

    const path = functionElement.identifier;

    useEffect(() => {
        functionPorts.current.push(node.getPortFromID(`left-${path}`));
        functionPorts.current.push(node.getPortFromID(`right-${path}`));
    }, [functionElement]);


    const openPanel = (event: React.MouseEvent<HTMLElement>) => {
        setIsOpen(true);
        setAnchorEvent(event.currentTarget);
    };
    const closePanel = () => {
        setIsOpen(false);
        setAnchorEvent(null);
    };

    const updateSelectedNode = () => {
        setSelectedNode(functionElement.returns);
    }


    return (
        <NodeFieldContainer data-testid={`interface-func-field-${functionElement.identifier}`}>
            <GraphqlBasePortWidget
                port={node.getPort(`left-${path}`)}
                engine={engine}
            />
            <FieldName
                onMouseOver={openPanel}
                onMouseLeave={closePanel}
                style={{ marginLeft: '7px' }}
                data-testid={`interface-func-${functionElement.identifier}`}
            >
                {functionElement.identifier}
            </FieldName>
            <div onClick={updateSelectedNode}>
                <FieldType data-testid={`interface-func-type-${functionElement.returns}`}>{functionElement.returns}</FieldType>
            </div>
            <GraphqlBasePortWidget
                port={node.getPort(`right-${path}`)}
                engine={engine}
            />

            {functionElement.parameters?.length > 0 && (
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
                    <ParametersPopup parameters={functionElement.parameters} />
                </Popover>
            )}
        </NodeFieldContainer>
    );
}
