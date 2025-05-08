/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: no-implicit-dependencies jsx-no-multiline-js
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";

import { GraphqlNodeBasePort } from "./GraphqlNodeBasePort";

export class GraphqlBasePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
    constructor() {
        super('graphqlBasePort');
    }

    generateModel(event: { initialConfig: any }): GraphqlNodeBasePort {
        return new GraphqlNodeBasePort(event.initialConfig.id, event.initialConfig.portType);
    }
}
