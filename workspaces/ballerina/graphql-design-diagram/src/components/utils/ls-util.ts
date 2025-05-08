/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    ExtendedLangClientInterface,
    GraphqlDesignService, GraphqlDesignServiceParams,
    SyntaxTree,
} from "@wso2-enterprise/ballerina-core";
import { STNode } from "@wso2-enterprise/syntax-tree";
import { URI } from "vscode-uri";

export async function getModelForGraphqlService(
    graphqlDesignRequest: GraphqlDesignServiceParams,
    langClientPromise: Promise<ExtendedLangClientInterface>): Promise<GraphqlDesignService> {
    const langClient: ExtendedLangClientInterface = await langClientPromise;
    const resp = await langClient.getGraphqlModel(graphqlDesignRequest) as GraphqlDesignService;
    return resp;
}

export async function getSyntaxTree(filePath: string, langClientPromise: Promise<ExtendedLangClientInterface>): Promise<STNode> {
    const langClient: ExtendedLangClientInterface = await langClientPromise;
    const resp = await langClient.getSyntaxTree({
        documentIdentifier: {
            uri: URI.file(filePath).toString()
        }
    }) as SyntaxTree;
    return resp.syntaxTree;
}
