/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda jsx-wrap-multiline no-submodule-imports
import React from "react";

import { Codicon, Item, MenuItem } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../DiagramContext/GraphqlDiagramContext";
import { Position } from "../resources/model";
import { getFormattedPosition } from "../utils/common-util";

interface GoToSourceMenuProps {
    location: Position;
}

export function GoToSourceMenuItem(props: GoToSourceMenuProps) {
    const { location } = props;

    const filePath = location?.filePath;
    const position = getFormattedPosition(location);

    const { goToSource } = useGraphQlContext();
    const handleOnClick = () => {
        goToSource(filePath, position);
    };

    const ItemWithIcon = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Codicon name="code" />
                <div style={{ marginLeft: '5px' }}>
                    Go to Source
                </div>
                <div style={{ marginLeft: '5px', color: '#595959F4' }}>
                    Ctrl + left click
                </div>
            </div>
        )
    }

    const menuItem: Item = { id: "go-to-source", label: ItemWithIcon(), onClick: () => handleOnClick() };

    return (
        <>
            {filePath && position &&
                <MenuItem
                    sx={{ pointerEvents: "auto", userSelect: "none" }}
                    item={menuItem}
                />
            }
        </>
    );
}
