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
import { getDeleteOperationMenuItem, getDesignOperationMenuItem, getEditOperationMenuItem, getGoToSourceMenuItem } from "../../../MenuItems/menuItems";
import { verticalIconSubMenu, verticalIconWrapperSubMenu } from "../../../MenuItems/style";
import { FunctionType, Position } from "../../../resources/model";

interface FunctionMenuWidgetProps {
    location: Position;
    functionType: FunctionType;
}

export function FunctionMenuWidget(props: FunctionMenuWidgetProps) {
    const { location, functionType } = props;
    const { onDelete, functionPanel, model, operationDesignView, goToSource } = useGraphQlContext();

    const getMenuItems = () => {
        const items: Item[] = [];
        // if (location) {
        //     items.push(getDesignOperationMenuItem(location, operationDesignView));
        //     items.push(getEditOperationMenuItem(location, functionType, functionPanel, model));
        //     items.push(getDeleteOperationMenuItem(location, onDelete));

        // }
        if (location?.filePath) {
            items.push(getGoToSourceMenuItem(location, goToSource));
        }

        return items;
    }

    return (
        <>
            {location &&
                <ContextMenu iconSx={verticalIconSubMenu} sx={verticalIconWrapperSubMenu} menuItems={getMenuItems()} />
            }
        </>
    );
}
