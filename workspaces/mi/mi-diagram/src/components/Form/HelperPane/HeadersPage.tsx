/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Position } from 'vscode-languageserver-types';
import { COMPLETION_ITEM_KIND, getIcon, HelperPane } from '@wso2-enterprise/ui-toolkit';
import { HelperPaneCompletionItem } from '@wso2-enterprise/mi-core';
import { filterHelperPaneCompletionItems, getHelperPaneCompletionItem } from '../FormExpressionField/utils';
import { debounce } from 'lodash';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';

type HeadersPageProps = {
    position: Position;
    setCurrentPage: (page: number) => void;
    onClose: () => void;
    onChange: (value: string) => void;
};

export const HeadersPage = ({
    position,
    setCurrentPage,
    onClose,
    onChange
}: HeadersPageProps) => {
    const { rpcClient } = useVisualizerContext();
    const firstRender = useRef<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [headerInfo, setHeaderInfo] = useState<HelperPaneCompletionItem[]>([]);
    const [filteredHeaderInfo, setFilteredHeaderInfo] = useState<HelperPaneCompletionItem[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const getHeaders = useCallback(() => {
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
                        if (response.headers?.length) {
                            setHeaderInfo(response.headers);
                            setFilteredHeaderInfo(response.headers);
                        }
                    })
                    .finally(() => setIsLoading(false));
            });
        }, 1100);
    }, [rpcClient, position]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            getHeaders();
        }
    }, [getHeaders]);

    const debounceFilterHeaders = useCallback(
        debounce((searchText: string) => {
            setFilteredHeaderInfo(filterHelperPaneCompletionItems(headerInfo, searchText));
            setIsLoading(false);
        }, 1100),
        [headerInfo, setFilteredHeaderInfo, setIsLoading, filterHelperPaneCompletionItems]
    );

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
        setIsLoading(true);
        debounceFilterHeaders(searchText);
    };

    const getCompletionItemIcon = () => getIcon(COMPLETION_ITEM_KIND.Variable);

    return (
        <>
            <HelperPane.Header
                title="Headers"
                onBack={() => setCurrentPage(0)}
                onClose={onClose}
                searchValue={searchValue}
                onSearch={handleSearch}
            />
            <HelperPane.Body loading={isLoading}>
                {filteredHeaderInfo?.map((header) => (
                    getHelperPaneCompletionItem(header, onChange, getCompletionItemIcon)
                ))}
            </HelperPane.Body>
        </>
    );
};
