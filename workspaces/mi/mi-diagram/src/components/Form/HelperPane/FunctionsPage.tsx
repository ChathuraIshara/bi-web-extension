/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Position } from 'vscode-languageserver-types';
import { COMPLETION_ITEM_KIND, getIcon, HelperPane } from '@wso2-enterprise/ui-toolkit';
import { HelperPaneFunctionInfo } from '@wso2-enterprise/mi-core';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import { debounce } from 'lodash';
import { filterHelperPaneFunctionCompletionItems } from '../FormExpressionField/utils';

type FunctionsPageProps = {
    position: Position;
    onChange: (value: string) => void;
    addFunction?: (value: string) => void;
};

export const FunctionsPage = ({
    position,
    onChange,
    addFunction
}: FunctionsPageProps) => {
    const { rpcClient } = useVisualizerContext();
    const firstRender = useRef<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [functionInfo, setFunctionInfo] = useState<HelperPaneFunctionInfo | undefined>(undefined);
    const [filteredFunctionInfo, setFilteredFunctionInfo] = useState<HelperPaneFunctionInfo | undefined>(undefined);
    const [searchValue, setSearchValue] = useState<string>('');

    const getFunctionInfo = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            rpcClient.getVisualizerState().then((machineView) => {
                rpcClient.getMiDiagramRpcClient().getHelperPaneInfo({
                    documentUri: machineView.documentUri,
                    position: position,
                })
                    .then((response) => {
                        if (Object.keys(response.functions)?.length) {
                            setFunctionInfo(response.functions);
                            setFilteredFunctionInfo(response.functions);
                        }
                    })
                    .finally(() => setIsLoading(false));
            });
        }, 1100);
    }, [rpcClient, position]);


    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            getFunctionInfo();
        }
    }, []);

    const debounceFilterFunctions = useCallback(
        debounce((searchText: string) => {
            setFilteredFunctionInfo(filterHelperPaneFunctionCompletionItems(functionInfo, searchText));
            setIsLoading(false);
        }, 1100),
        [functionInfo, setFilteredFunctionInfo, setIsLoading, filterHelperPaneFunctionCompletionItems]
    );

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
        setIsLoading(true);
        debounceFilterFunctions(searchText);
    };

    const sortedFunctionInfo = useMemo(() => {
        if (!filteredFunctionInfo || Object.keys(filteredFunctionInfo).length === 0) {
            return [];
        }

        // Sort the items in each group
        const functionInfoArrayWithSortedItems = [];
        for (const [group, groupInfo] of Object.entries(filteredFunctionInfo)) {
            const sortedItems = groupInfo.items.sort((a, b) => a.label.localeCompare(b.label));
            functionInfoArrayWithSortedItems.push({
                group,
                ...groupInfo,
                items: sortedItems
            });
        }

        // Sort the groups
        const sortedFunctionInfo = functionInfoArrayWithSortedItems.sort((a, b) => a.group.localeCompare(b.group));

        return sortedFunctionInfo;
    }, [filteredFunctionInfo]);

    const handleFunctionItemClick = (insertText: string) => {
        if (addFunction) {
            return addFunction(insertText);
        }
        const functionRegex = /^([a-zA-Z0-9_-]+)\((.*)\)/;
        const matches = insertText.match(functionRegex);
        const functionName = matches?.[1];
        const functionArgs = matches?.[2];

        if (functionName && functionArgs) {
            onChange(`${functionName}(`);
        } else if (functionName) {
            // If the function has no arguments, add an empty pair of parentheses
            onChange(`${functionName}()`);
        }
    }

    return (
        <>
            <HelperPane.Header
                searchValue={searchValue}
                onSearch={handleSearch}
            />
            <HelperPane.Body loading={isLoading}>
                {sortedFunctionInfo.map(({ group, items }) => (
                    <HelperPane.Section title={group}>
                        {items.map((fn) => (
                            <HelperPane.CompletionItem
                                label={fn.label}
                                onClick={() => handleFunctionItemClick(fn.insertText)}
                                getIcon={() => getIcon(COMPLETION_ITEM_KIND.Function)}
                            />
                        ))}
                    </HelperPane.Section>
                ))}
            </HelperPane.Body>
        </>
    );
};
