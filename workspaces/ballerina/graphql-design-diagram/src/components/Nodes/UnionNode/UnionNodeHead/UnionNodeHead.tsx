/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useRef } from "react";

import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";
import { ContextMenu, Item } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { getFilterNodeMenuItem } from "../../../MenuItems/menuItems";
import { verticalIconStyle, verticalIconWrapper } from "../../../MenuItems/style";
import { NodeCategory } from "../../../NodeFilter";
import { GraphqlBasePortWidget } from "../../../Port/GraphqlBasePortWidget";
import { UnionIcon } from "../../../resources/assets/icons/UnionIcon";
import { HeaderName, NodeHeader } from "../../../resources/styles/styles";
import { UnionNodeModel } from "../UnionNodeModel";

interface UnionNodeHeadWidgetProps {
    engine: DiagramEngine;
    node: UnionNodeModel;
}

export function UnionNodeHeadWidget(props: UnionNodeHeadWidgetProps) {
    const { engine, node } = props;
    const headPorts = useRef<PortModel[]>([]);
    const { setFilteredNode } = useGraphQlContext();

    const displayName: string = node.unionObject.name;

    useEffect(() => {
        headPorts.current.push(node.getPortFromID(`left-${node.getID()}`));
        headPorts.current.push(node.getPortFromID(`right-${node.getID()}`));
    }, [node]);

    const getMenuItems = () => {
        const menuItems: Item[] = [];
        menuItems.push(getFilterNodeMenuItem({ name: displayName, type: NodeCategory.UNION }, setFilteredNode));
        return menuItems;
    }

    return (
        <NodeHeader data-testid={`union-head-${displayName}`}>
            <UnionIcon />
            <GraphqlBasePortWidget
                port={node.getPort(`left-${node.getID()}`)}
                engine={engine}
            />
            <HeaderName>{displayName}</HeaderName>
            {/* <ContextMenu iconSx={verticalIconStyle} sx={verticalIconWrapper} menuItems={getMenuItems()} /> */}
            <GraphqlBasePortWidget
                port={node.getPort(`right-${node.getID()}`)}
                engine={engine}
            />
            <GraphqlBasePortWidget
                port={node.getPort(`top-${node.getID()}`)}
                engine={engine}
            />
        </NodeHeader>
    );
}
