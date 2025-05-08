/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DefaultPortModel, DefaultPortModelOptions, LinkModel, PortModelAlignment } from "@projectstorm/react-diagrams";
import { NodeLinkModel } from "../NodeLink";
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";
import { NODE_PORT } from "../../resources/constants";

export class NodePortModel extends DefaultPortModel {
    constructor(isIn: boolean, name?: string, label?: string);
    constructor(options: DefaultPortModelOptions);
    constructor(options: DefaultPortModelOptions | boolean, name?: string, label?: string) {
        if (name) {
            options = {
                in: !!options,
                name: name,
                label: label,
            };
        }
        options = options as DefaultPortModelOptions;
        super({
            label: options.label || options.name,
            alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
            type: NODE_PORT,
            ...options,
        });
    }

    createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
        const link = super.createLinkModel();
        if (!link && factory) {
            return factory.generateModel({});
        }
        return link || new NodeLinkModel();
    }
}
