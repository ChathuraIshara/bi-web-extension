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
import { HelperPaneCompletionItem } from '@wso2-enterprise/mi-core';
import { COMPLETION_ITEM_KIND, getIcon, HelperPane } from '@wso2-enterprise/ui-toolkit';
import { filterHelperPaneCompletionItems, getHelperPaneCompletionItem } from '../FormExpressionField/utils';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';

type PropertiesPageProps = {
    position: Position;
    setCurrentPage: (page: number) => void;
    onClose: () => void;
    onChange: (value: string) => void;
};

export const PropertiesPage = ({
    position,
    setCurrentPage,
    onClose,
    onChange
}: PropertiesPageProps) => {
    const { rpcClient } = useVisualizerContext();
    const firstRender = useRef<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [propertiesInfo, setPropertiesInfo] = useState<HelperPaneCompletionItem[]>([]);
    const [filteredPropertiesInfo, setFilteredPropertiesInfo] = useState<HelperPaneCompletionItem[]>([]);

    const getProperties = useCallback(() => {
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
                        if (response.properties?.length) {
                            setPropertiesInfo(response.properties);
                            setFilteredPropertiesInfo(response.properties);
                        }
                    })
                    .finally(() => setIsLoading(false));
            });
        }, 1100);
    }, [rpcClient, position]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            getProperties();
        }
    }, [getProperties]);

    const debounceFilterProperties = useCallback(
        debounce((searchText: string) => {
            setFilteredPropertiesInfo(filterHelperPaneCompletionItems(propertiesInfo, searchText));
            setIsLoading(false);
        }, 1100),
        [propertiesInfo, setFilteredPropertiesInfo, setIsLoading, filterHelperPaneCompletionItems]
    );

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
        setIsLoading(true);
        debounceFilterProperties(searchText);
    };

    const getCompletionItemIcon = () => getIcon(COMPLETION_ITEM_KIND.Variable);

    return (
        <>
            <HelperPane.Header
                title="Properties"
                onBack={() => setCurrentPage(0)}
                onClose={onClose}
                searchValue={searchValue}
                onSearch={handleSearch}
            />
            <HelperPane.Body loading={isLoading}>
                {filteredPropertiesInfo?.map((property) => (
                    getHelperPaneCompletionItem(property, onChange, getCompletionItemIcon) 
                ))}
            </HelperPane.Body>
        </>
    );
};
