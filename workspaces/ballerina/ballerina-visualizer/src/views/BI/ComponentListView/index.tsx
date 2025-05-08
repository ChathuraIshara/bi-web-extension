/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { View, ViewContent } from "@wso2-enterprise/ui-toolkit";
import { SCOPE, TriggerModelsResponse } from "@wso2-enterprise/ballerina-core";

import { TitleBar } from "../../../components/TitleBar";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import { AddPanel, Container } from "./styles";
import { AutomationPanel } from "./AutomationPanel";
import { EventIntegrationPanel } from "./EventIntegrationPanel";
import { FileIntegrationPanel } from "./FileIntegrationPanel";
import { IntegrationAPIPanel } from "./IntegrationApiPanel";
import { OtherArtifactsPanel } from "./OtherArtifactsPanel";
import { AIAgentPanel } from "./AIAgentPanel";
import { useVisualizerContext } from "../../../Context";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";

interface ComponentListViewProps {
    scope: SCOPE;
};

export function ComponentListView(props: ComponentListViewProps) {
    const { scope } = props;
    const { rpcClient } = useRpcContext();
    const [triggers, setTriggers] = useState<TriggerModelsResponse>({ local: [] });
    const { cacheTriggers, setCacheTriggers } = useVisualizerContext();
    const [isNPSupported, setIsNPSupported] = useState<boolean>(false);

    useEffect(() => {
        getTriggers();

        rpcClient.getCommonRpcClient().isNPSupported().then((supported) => {
            setIsNPSupported(supported);
        });
    }, []);

    const getTriggers = () => {
        if (cacheTriggers.local.length > 0) {
            setTriggers(cacheTriggers);
        } else {
            rpcClient
                .getServiceDesignerRpcClient()
                .getTriggerModels({ query: "" })
                .then((model) => {
                    console.log(">>> bi triggers", model);
                    setTriggers(model);
                    setCacheTriggers(model);
                });
        }
    };

    return (
        <View>
            <TopNavigationBar />
            <TitleBar title="Artifacts" subtitle="Add a new artifact to your integration" />
            <ViewContent padding>
                <Container>
                    <AddPanel>
                        <AutomationPanel scope={scope} />
                        <AIAgentPanel scope={scope} />
                        <IntegrationAPIPanel scope={scope} />
                        <EventIntegrationPanel triggers={triggers} scope={scope} />
                        <FileIntegrationPanel triggers={triggers} scope={scope} />
                        <OtherArtifactsPanel isNPSupported={isNPSupported} />
                    </AddPanel>
                </Container>
            </ViewContent>
        </View>
    );
}
