/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Codicon, COMPLETION_ITEM_KIND, getIcon, HelperPane, Overlay, ThemeColors } from '@wso2-enterprise/ui-toolkit';
import { LibraryBrowser } from './LibraryBrowser';
import { HelperPaneCompletionItem, HelperPaneFunctionInfo } from '@wso2-enterprise/ballerina-side-panel';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { LineRange, FunctionKind } from '@wso2-enterprise/ballerina-core';
import { convertToHelperPaneFunction, extractFunctionInsertText } from '../../../utils/bi';
import { debounce } from 'lodash';
import { useMutation } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { LoadingRing } from '../../../components/Loader';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 5000;
`;


type FunctionsPageProps = {
    fieldKey: string;
    anchorRef: RefObject<HTMLDivElement>;
    fileName: string;
    targetLineRange: LineRange;
    onClose: () => void;
    onChange: (value: string) => void;
    updateImports: (key: string, imports: {[key: string]: string}) => void;
};

export const FunctionsPage = ({
    fieldKey,
    anchorRef,
    fileName,
    targetLineRange,
    onClose,
    onChange,
    updateImports
}: FunctionsPageProps) => {
    const { rpcClient } = useRpcContext();
    const firstRender = useRef<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isLibraryBrowserOpen, setIsLibraryBrowserOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [functionInfo, setFunctionInfo] = useState<HelperPaneFunctionInfo | undefined>(undefined);
    const [libraryBrowserInfo, setLibraryBrowserInfo] = useState<HelperPaneFunctionInfo | undefined>(undefined);

    const debounceFetchFunctionInfo = useCallback(
        debounce((searchText: string, includeAvailableFunctions?: string) => {
            rpcClient
                .getBIDiagramRpcClient()
                .search({
                    position: targetLineRange,
                    filePath: fileName,
                    queryMap: {
                        q: searchText.trim(),
                        limit: 12,
                        offset: 0,
                        ...(!!includeAvailableFunctions && { includeAvailableFunctions })
                    },
                    searchKind: "FUNCTION"
                })
                .then((response) => {
                    if (response.categories?.length) {
                        if (!!includeAvailableFunctions) {
                            setLibraryBrowserInfo(convertToHelperPaneFunction(response.categories));
                        } else {
                            setFunctionInfo(convertToHelperPaneFunction(response.categories));
                        }
                    }
                })
                .then(() => setIsLoading(false));
        }, 150),
        [rpcClient, fileName, targetLineRange]
    );

    const fetchFunctionInfo = useCallback(
        (searchText: string, includeAvailableFunctions?: string) => {
            setIsLoading(true);
            debounceFetchFunctionInfo(searchText, includeAvailableFunctions);
        },
        [debounceFetchFunctionInfo, searchValue]
    );

    const { mutateAsync: addFunction, isLoading: isAddingFunction  } = useMutation(
        (item: HelperPaneCompletionItem) => 
            rpcClient.getBIDiagramRpcClient().addFunction({
                filePath: fileName,
                codedata: item.codedata,
                kind: item.kind as FunctionKind,
                searchKind: 'FUNCTION'
            })
    );

    const onFunctionItemSelect = async (item: HelperPaneCompletionItem) => {
        const response = await addFunction(item);

        if (response) {
            const importStatement = {
                [response.prefix]: response.moduleId
            };
            updateImports(fieldKey, importStatement);
            return extractFunctionInsertText(response.template);
        }

        return '';
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            fetchFunctionInfo('');
        }
    }, []);

    const handleFunctionSearch = (searchText: string) => {
        setSearchValue(searchText);

        // Search functions
        if (isLibraryBrowserOpen) {
            fetchFunctionInfo(searchText, 'true');
        } else {
            fetchFunctionInfo(searchText);
        }
    };

    const handleFunctionItemSelect = async (item: HelperPaneCompletionItem) => {
        const insertText = await onFunctionItemSelect(item);
        onChange(insertText);
        onClose();
    };

    return (
        <>
            <HelperPane.Header
                searchValue={searchValue}
                onSearch={handleFunctionSearch}
                titleSx={{ fontFamily: 'GilmerRegular' }}
            />
            <HelperPane.Body loading={isLoading}>
                {functionInfo?.category.map((category) => {
                    /* If no sub category found */
                    if (!category.subCategory) {
                        if (!category.items || category.items.length === 0) {
                            return null;
                        }

                        return (
                            <HelperPane.Section
                                key={category.label}
                                title={category.label}
                                collapsible
                                defaultCollapsed
                                columns={2}
                                collapsedItemsCount={6}
                                titleSx={{ fontFamily: 'GilmerMedium' }}
                            >
                                {category.items?.map((item) => (
                                    <HelperPane.CompletionItem
                                        key={`${category.label}-${item.label}`}
                                        label={item.label}
                                        type={item.type}
                                        onClick={async () => await handleFunctionItemSelect(item)}
                                        getIcon={() => getIcon(COMPLETION_ITEM_KIND.Function)}
                                    />
                                ))}
                            </HelperPane.Section>
                        );
                    }

                    /* If sub category found */
                    if (!category.subCategory || category.subCategory.length === 0) {
                        return null;
                    }

                    return (
                        <HelperPane.Section
                            key={category.label}
                            title={category.label}
                            titleSx={{ fontFamily: 'GilmerMedium' }}
                        >
                            {category.subCategory?.map((subCategory) => (
                                <HelperPane.SubSection
                                    key={`${category.label}-${subCategory.label}`}
                                    title={subCategory.label}
                                    collapsible
                                    defaultCollapsed
                                    columns={2}
                                    collapsedItemsCount={6}
                                >
                                    {subCategory.items?.map((item) => (
                                        <HelperPane.CompletionItem
                                            key={`${category.label}-${subCategory.label}-${item.label}`}
                                            label={item.label}
                                            onClick={async () => await handleFunctionItemSelect(item)}
                                            getIcon={() => getIcon(COMPLETION_ITEM_KIND.Function)}
                                        />
                                    ))}
                                </HelperPane.SubSection>
                            ))}
                        </HelperPane.Section>
                    );
                })}
            </HelperPane.Body>
            <HelperPane.Footer>
                <HelperPane.IconButton
                    title="Open function browser"
                    getIcon={() => <Codicon name="library" />}
                    onClick={() => setIsLibraryBrowserOpen(true)}
                />
            </HelperPane.Footer>
            {isLibraryBrowserOpen && (
                <LibraryBrowser
                    anchorRef={anchorRef}
                    isLoading={isLoading}
                    libraryBrowserInfo={libraryBrowserInfo as HelperPaneFunctionInfo}
                    setFilterText={handleFunctionSearch}
                    onBack={() => setIsLibraryBrowserOpen(false)}
                    onClose={onClose}
                    onChange={onChange}
                    onFunctionItemSelect={onFunctionItemSelect}
                />
            )}
            {isAddingFunction && createPortal(
                <>
                    <Overlay sx={{ background: `${ThemeColors.SURFACE_CONTAINER}`, opacity: `0.3`, zIndex: 5000 }} />
                    <LoadingContainer> <LoadingRing /> </LoadingContainer>
                </>
                , document.body
            )}
        </>
    );
};
