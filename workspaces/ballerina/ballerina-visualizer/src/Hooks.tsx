/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { FlowNode, LinePosition } from '@wso2-enterprise/ballerina-core';

export const useInlineDataMapperModel = (
    filePath: string,
    flowNode: FlowNode,
    propertyKey: string,
    position: LinePosition
) => {
    const { rpcClient } = useRpcContext();
    const getIDMModel = async () => {
        try {
            const res = await rpcClient
                .getInlineDataMapperRpcClient()
                .getDataMapperModel({ filePath, flowNode, propertyKey, position });
            console.log('>>> [Inline Data Mapper] Model:', res);
            return res.mappingsModel;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const {
        data: model,
        isFetching,
        isError,
        refetch
    } = useQuery(['getIDMModel', { filePath, flowNode, position }], () => getIDMModel(), { networkMode: 'always' });

    return {model, isFetching, isError, refetch};
};
