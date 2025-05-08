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

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { getRecordMenuItems } from "../../../MenuItems/menuItems";
import { verticalIconStyle, verticalIconWrapper } from "../../../MenuItems/style";
import { Position } from "../../../resources/model";

interface RecordHeaderMenuProps {
    location: Position;
    nodeName: string;
}

export function RecordHeaderMenu(props: RecordHeaderMenuProps) {
    const { location, nodeName } = props;
    const { recordEditor, langClientPromise, fullST, currentFile, goToSource, setFilteredNode } = useGraphQlContext();

    const getMenuItems = () => {
        const menuItems: Item[] = getRecordMenuItems(location, nodeName, fullST, currentFile, recordEditor,
            langClientPromise, setFilteredNode, goToSource);
        return menuItems;
    }

    return (
        <>
            {location?.filePath && location?.startLine && location?.endLine &&
                <ContextMenu iconSx={verticalIconStyle} sx={verticalIconWrapper} menuItems={getMenuItems()} />
            }
        </>
    );
}
