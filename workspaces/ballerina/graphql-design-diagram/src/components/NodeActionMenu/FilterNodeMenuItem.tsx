/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { Icon, Item, MenuItem } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../DiagramContext/GraphqlDiagramContext";
import { NodeType } from "../NodeFilter";

interface FocusToNodeMenuProps {
    nodeType: NodeType;
}

export function FilterNodeMenuItem(props: FocusToNodeMenuProps) {
    const { nodeType } = props;
    const { setFilteredNode } = useGraphQlContext();

    const handleOnClick = () => {
        setFilteredNode(nodeType);
    };

    const ItemWithIcon = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="center-focus-weak" />
                <div style={{ marginLeft: '5px' }}>
                    Show Subgraph
                </div>
            </div>
        )
    }

    const menuItem: Item = { id: "Show Subgraph", label: ItemWithIcon(), onClick: () => handleOnClick() };

    return (
        <MenuItem
            sx={{ pointerEvents: "auto", userSelect: "none" }}
            item={menuItem}

            data-testid={`show-subgraph-menu`}
        />
    )
}
