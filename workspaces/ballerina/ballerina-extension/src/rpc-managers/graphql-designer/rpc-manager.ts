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
    GetGraphqlTypeRequest,
    GetGraphqlTypeResponse,
    GraphqlDiagramAPI,
    GraphqlModelRequest,
    GraphqlModelResponse
} from "@wso2-enterprise/ballerina-core";
import { StateMachine } from "../../stateMachine";

export class GraphqlDesignerRpcManager implements GraphqlDiagramAPI {
    async getGraphqlModel(params: GraphqlModelRequest): Promise<GraphqlModelResponse> {
        return new Promise(async (resolve) => {
            const res = await StateMachine.langClient().getGraphqlModel({
                filePath: params.filePath,
                startLine: params.startLine,
                endLine: params.endLine
            }) as GraphqlModelResponse;
            resolve(res);
        });
    }

    async getGraphqlTypeModel(params: GetGraphqlTypeRequest): Promise<GetGraphqlTypeResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                console.log(">>> Fetching GraphqlTypeModel", params);
                const res: GetGraphqlTypeResponse = await context.langClient.getGraphqlTypeModel(params);
                resolve(res);
            } catch (error) {
                console.log(">>> Error obtaining GraphqlTypeModel", error);
                resolve(undefined);
            }
        });
    }
}
