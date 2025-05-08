/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { debounce } from 'lodash';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Position } from 'vscode-languageserver-types';
import styled from '@emotion/styled';
import { HelperPaneCompletionItem } from '@wso2-enterprise/mi-core';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import { Alert, COMPLETION_ITEM_KIND, getIcon, HelperPane } from '@wso2-enterprise/ui-toolkit';
import { filterHelperPaneCompletionItems, getHelperPaneCompletionItem } from '../FormExpressionField/utils';

const InfoMessage = styled.div`
    margin-top: auto;
    padding-inline: 8px;
`;

type PayloadPageProps = {
    position: Position;
    setCurrentPage: (page: number) => void;
    onClose: () => void;
    onChange: (value: string) => void;
};

export const PayloadPage = ({
    position,
    setCurrentPage,
    onClose,
    onChange
}: PayloadPageProps) => {
    const { rpcClient } = useVisualizerContext();
    const firstRender = useRef<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [payloadInfo, setPayloadInfo] = useState<HelperPaneCompletionItem[]>([]);
    const [filteredPayloadInfo, setFilteredPayloadInfo] = useState<HelperPaneCompletionItem[]>([]);

    const getPayloads = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            rpcClient.getVisualizerState().then((machineView) => {
                rpcClient
                    .getMiDiagramRpcClient()
                    .getHelperPaneInfo({
                        documentUri: machineView.documentUri,
                        position: position,
                    })
                    .then((response) => {
                        if (response.payload?.length) {
                            setPayloadInfo(response.payload);
                            setFilteredPayloadInfo(response.payload);
                        }
                    })
                    .finally(() => setIsLoading(false));
            });
        }, 1100);
    }, [rpcClient, position]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            getPayloads();
        }
    }, [getPayloads]);

    const debounceFilterPayloads = useCallback(
        debounce((searchText: string) => {
            setFilteredPayloadInfo(filterHelperPaneCompletionItems(payloadInfo, searchText));
            setIsLoading(false);
        }, 1100),
        [payloadInfo, setFilteredPayloadInfo, setIsLoading, filterHelperPaneCompletionItems]
    );

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
        setIsLoading(true);
        debounceFilterPayloads(searchText);
    };

    const getCompletionItemIcon = () => getIcon(COMPLETION_ITEM_KIND.Variable);

    return (
        <>
            <HelperPane.Header
                title="Payload"
                onBack={() => setCurrentPage(0)}
                onClose={onClose}
                searchValue={searchValue}
                onSearch={handleSearch}
            />
            <HelperPane.Body loading={isLoading}>
                {filteredPayloadInfo?.map((payload) => (
                    getHelperPaneCompletionItem(payload, onChange, getCompletionItemIcon)
                ))}
            </HelperPane.Body>
            <InfoMessage>
                <Alert
                    variant='primary'
                    title='Important!'
                    subTitle="Payload suggestions are generated based on the first request payload defined in the 'Start' node. If no payloads are defined yet, please add one in the 'Start' node of the diagram."
                />
            </InfoMessage>
        </>
    );
};
