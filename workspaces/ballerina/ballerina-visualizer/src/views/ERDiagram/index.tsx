/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect } from "react";
import { PersistERModel, VisualizerLocation } from "@wso2-enterprise/ballerina-core";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { PersistDiagram } from "@wso2-enterprise/persist-layer-diagram";

export function ERDiagram() {
    const { rpcClient } = useRpcContext();
    const persistDiagramRPCClient = rpcClient.getPersistDiagramRpcClient();
    const [visualizerLocation, setVisualizerLocation] = React.useState<VisualizerLocation>();

    useEffect(() => {
        if (rpcClient) {
            rpcClient.getVisualizerLocation().then((value) => {
                setVisualizerLocation(value);
            });
        }
    }, [rpcClient]);


    const getPersistModel = async () => {
        if (!rpcClient) {
            return;
        }
        const response: PersistERModel = await persistDiagramRPCClient.getPersistERModel();
        return response;
    };

    const showProblemPanel = async () => {
        if (!rpcClient) {
            return;
        }
        await persistDiagramRPCClient.showProblemPanel();
    }

    return (
        <PersistDiagram
            getPersistModel={getPersistModel}
            selectedRecordName={visualizerLocation?.identifier}
            showProblemPanel={showProblemPanel}
        />
    );
}
