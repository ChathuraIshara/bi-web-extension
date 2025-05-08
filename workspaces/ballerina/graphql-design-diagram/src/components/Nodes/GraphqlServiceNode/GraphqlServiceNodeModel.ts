/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortModelAlignment } from "@projectstorm/react-diagrams";

import { GraphqlNodeBasePort } from "../../Port/GraphqlNodeBasePort";
import { Service } from "../../resources/model";
import { GraphqlDesignNode } from "../BaseNode/GraphqlDesignNode";

export const GRAPHQL_SERVICE_NODE = "graphqlServiceNode";

export class GraphqlServiceNodeModel extends GraphqlDesignNode {
    readonly serviceObject: Service;

    constructor(serviceObject: Service) {
        const serviceName: string = serviceObject.serviceName ? serviceObject.serviceName : "/root";
        super(GRAPHQL_SERVICE_NODE, serviceName);
        this.serviceObject = serviceObject;

        this.addPort(new GraphqlNodeBasePort(serviceName, PortModelAlignment.LEFT));
        this.addPort(new GraphqlNodeBasePort(serviceName, PortModelAlignment.RIGHT));
        this.addPort(new GraphqlNodeBasePort(serviceName, PortModelAlignment.TOP));

        this.serviceObject.resourceFunctions?.forEach(resource => {
            this.addPort(new GraphqlNodeBasePort(resource.identifier, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(resource.identifier, PortModelAlignment.RIGHT));
        });

        this.serviceObject.remoteFunctions?.forEach(remoteFunc => {
            this.addPort(new GraphqlNodeBasePort(remoteFunc.identifier, PortModelAlignment.LEFT));
            this.addPort(new GraphqlNodeBasePort(remoteFunc.identifier, PortModelAlignment.RIGHT));
        });
    }
}
