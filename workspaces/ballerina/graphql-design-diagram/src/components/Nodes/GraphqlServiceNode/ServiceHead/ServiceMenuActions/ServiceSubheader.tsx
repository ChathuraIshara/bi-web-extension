/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda jsx-wrap-multiline no-implicit-dependencies no-submodule-imports
import React from "react";

import { LabelEditIcon } from "@wso2-enterprise/ballerina-core";
import { Item } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../../../../DiagramContext/GraphqlDiagramContext";
import { Position } from "../../../../resources/model";

interface ServiceSubheaderProps {
    location: Position;
    nodeName: string;
}

export function ServiceSubheader(props: ServiceSubheaderProps) {
    const { servicePanel } = useGraphQlContext();

    const ItemWithIcon = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <LabelEditIcon />
                <div style={{ marginLeft: '5px' }}>
                    Edit Service
                </div>
            </div>
        )
    }

    const menuItem: Item = { id: "edit-service", label: ItemWithIcon(), onClick: () => servicePanel() };

    return (
        { menuItem }
    );
}
