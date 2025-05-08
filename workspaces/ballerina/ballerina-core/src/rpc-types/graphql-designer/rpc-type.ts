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
import { GetGraphqlTypeRequest, GetGraphqlTypeResponse } from "../../interfaces/extended-lang-client";
import { GraphqlModelRequest, GraphqlModelResponse } from "./interfaces";
import { RequestType } from "vscode-messenger-common";

const _preFix = "graphql-designer";
export const getGraphqlModel: RequestType<GraphqlModelRequest, GraphqlModelResponse> = { method: `${_preFix}/getGraphqlModel` };
export const getGraphqlTypeModel: RequestType<GetGraphqlTypeRequest, GetGraphqlTypeResponse> = { method: `${_preFix}/getGraphqlTypeModel` };
