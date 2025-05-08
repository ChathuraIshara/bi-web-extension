/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortModel } from "@projectstorm/react-diagrams";

import { GraphqlServiceNodeModel } from "../../Nodes/GraphqlServiceNode/GraphqlServiceNodeModel";
import { RemoteFunction, ResourceFunction } from "../../resources/model";

export function findCallingFunction(targetPort: PortModel): RemoteFunction | ResourceFunction | undefined {
    const targetService: GraphqlServiceNodeModel = targetPort.getNode() as GraphqlServiceNodeModel;
    let targetFunc: ResourceFunction | RemoteFunction | undefined;

    if (targetService.serviceObject.resourceFunctions.length > 0) {
        targetFunc = targetService.serviceObject.resourceFunctions.find(resource =>
            resource.identifier ===
            targetPort.getID().split(`${targetPort.getOptions().alignment}-`)[1]
        );
    }
    if (!targetFunc && targetService.serviceObject.remoteFunctions.length > 0) {
        targetFunc = targetService.serviceObject.remoteFunctions.find(remoteFunc =>
            remoteFunc.identifier === targetPort.getID().split(`${targetPort.getOptions().alignment}-`)[1]);
    }
    return targetFunc;
}
