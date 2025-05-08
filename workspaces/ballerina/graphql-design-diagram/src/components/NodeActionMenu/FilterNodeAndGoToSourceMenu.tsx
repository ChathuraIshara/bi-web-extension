/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda jsx-wrap-multiline  no-implicit-dependencies no-submodule-imports
import React from "react";

import { ContextMenu, Item } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../DiagramContext/GraphqlDiagramContext";
import { getFilterNodeMenuItem, getGoToSourceMenuItem } from "../MenuItems/menuItems";
import { verticalIconStyle, verticalIconWrapper } from "../MenuItems/style";
import { NodeType } from "../NodeFilter";
import { Position } from "../resources/model";

interface GoToSourceNodeMenuProps {
    location: Position;
    nodeType: NodeType;
}

export function FilterNodeAndGoToSourceMenu(props: GoToSourceNodeMenuProps) {
    const { location, nodeType } = props;
    const { setFilteredNode, goToSource } = useGraphQlContext();

    const getMenuItems = () => {
        const items: Item[] = [];
        items.push(getGoToSourceMenuItem(location, goToSource));
        items.push(getFilterNodeMenuItem(nodeType, setFilteredNode));
        return items;
    }

    return (
        <>
            {location?.filePath && location?.startLine && location?.endLine &&
                <ContextMenu iconSx={verticalIconStyle} sx={verticalIconWrapper} menuItems={getMenuItems()} />
            }
        </>
    );
}
