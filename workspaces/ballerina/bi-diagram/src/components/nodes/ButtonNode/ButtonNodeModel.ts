/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeModel } from "@projectstorm/react-diagrams";
import { NodeTypes } from "../../../resources/constants";

// TODO: improve button node model to support button forms other than suggested buttons
export class ButtonNodeModel extends NodeModel {

    constructor() {
        super({
            id: "suggestion-button-node",
            type: NodeTypes.BUTTON_NODE,
            locked: true,
        });
    }

    getHeight(): number {
        return this.height;
    }
}
