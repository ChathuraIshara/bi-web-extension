/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    Connector,
    ConnectorRequest,
    ConnectorResponse,
    ConnectorWizardAPI,
    ConnectorsRequest,
    ConnectorsResponse
} from "@wso2-enterprise/ballerina-core";
import { StateMachine } from "../../stateMachine";


export class ConnectorWizardRpcManager implements ConnectorWizardAPI {
    async getConnector(params: ConnectorRequest): Promise<ConnectorResponse> {
        return new Promise((resolve) => {
            StateMachine.langClient()
                .getConnector(params)
                .then((connector) => {
                    console.log(">>> received connector", connector);
                    resolve(connector as Connector);
                })
                .catch((error) => {
                    console.log(">>> error fetching connector", error);
                    return new Promise((resolve) => {
                        resolve(undefined);
                    });
                });
        });
    }

    async getConnectors(params: ConnectorsRequest): Promise<ConnectorsResponse> {
        return new Promise((resolve) => {
            StateMachine.langClient()
                .getConnectors(params)
                .then((connectors) => {
                    console.log(">>> received connectors", connectors);
                    resolve(connectors as ConnectorsResponse);
                })
                .catch((error) => {
                    console.log(">>> error fetching connectors", error);
                    return new Promise((resolve) => {
                        resolve(undefined);
                    });
                });
        });
    }
}
