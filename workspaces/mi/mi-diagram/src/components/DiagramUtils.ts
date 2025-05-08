/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 *
 */

export function restructureDssQueryST(query: any) {

    const inputMappings: any = query.params;
    const outputMappings: any = {};
    const queryParams: any = {};

    if (query.result) {
        if (query.result.elements) {
            outputMappings.elements = query.result.elements;
            delete query.result.elements;
        }
        if (query.result.attributes) {
            outputMappings.attributes = query.result.attributes;
            delete query.result.attributes;
        }
        if (query.result.callQueries) {
            outputMappings.callQueries = query.result.callQueries;
            delete query.result.callQueries;
        }
    }

    const transformation: any = query.result;
    queryParams.sql = query.sql;

    delete query.params
    delete query.sql
    if (query.result) {
        delete query.result
    }
    queryParams.properties = query;

    let updatedQuery = {
        inputMappings: inputMappings,
        query: queryParams,
        transformation: transformation,
        outputMappings: outputMappings
    };

    return updatedQuery;
}
