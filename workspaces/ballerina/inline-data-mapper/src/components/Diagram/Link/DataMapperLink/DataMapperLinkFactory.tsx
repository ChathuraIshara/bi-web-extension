/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { DefaultLinkFactory } from "@projectstorm/react-diagrams";

import { DataMapperLinkModel, LINK_TYPE_ID } from "./DataMapperLink";
import { DefaultLinkWidget } from "./DefaultLinkWidget";

export class DataMapperLinkFactory extends DefaultLinkFactory {
    constructor() {
        super(LINK_TYPE_ID);
    }

    generateModel(): DataMapperLinkModel {
        return new DataMapperLinkModel();
    }

    generateReactWidget(event: { model: DataMapperLinkModel }): JSX.Element {
        return (
            <DefaultLinkWidget link={event.model} diagramEngine={this.engine} />
        );
    }
}
