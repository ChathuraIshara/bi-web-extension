/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormView } from "@wso2-enterprise/ui-toolkit";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { EVENT_TYPE, MACHINE_VIEW } from "@wso2-enterprise/mi-core";
import CardWrapper from "./Commons/CardWrapper";

export interface EndpointWizardProps {
    path: string;
    isPopup?: boolean;
    handlePopupClose?: () => void;
}

export function EndpointWizard(props: EndpointWizardProps) {

    const { rpcClient } = useVisualizerContext();

    const setEndpointType = (type: string) => {
        const endpointMappings: { [key: string]: MACHINE_VIEW } = {
            'HTTP Endpoint': MACHINE_VIEW.HttpEndpointForm,
            'WSDL Endpoint': MACHINE_VIEW.WsdlEndpointForm,
            'Address Endpoint': MACHINE_VIEW.AddressEndpointForm,
            'Default Endpoint': MACHINE_VIEW.DefaultEndpointForm,
            'Failover Endpoint': MACHINE_VIEW.FailoverEndPointForm,
            'Load Balance Endpoint': MACHINE_VIEW.LoadBalanceEndPointForm,
            'Recipient List Endpoint': MACHINE_VIEW.RecipientEndPointForm,
            'Template Endpoint': MACHINE_VIEW.TemplateEndPointForm,
        };

        const view = endpointMappings[type];
        if (view) {
            rpcClient.getMiVisualizerRpcClient().openView({
                type: EVENT_TYPE.OPEN_VIEW,
                location: {
                    view,
                    documentUri: props.path,
                    customProps: { type: 'endpoint' }
                },
                isPopup: props.isPopup
            });
        }
    };

    const handleOnClose = () => {
        rpcClient.getMiVisualizerRpcClient().goBack();
    };

    return (
        <FormView title={"Create Endpoint"} onClose={props.handlePopupClose ?? handleOnClose}>
            <CardWrapper cardsType={"ENDPOINT"} setType={setEndpointType} />
        </FormView>
    );
}
