/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { HelperPaneHeight, Overlay, ThemeColors } from "@wso2-enterprise/ui-toolkit";

import { RefObject } from 'react';

import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { LineRange } from '@wso2-enterprise/ballerina-core';
import {
    TypeHelperCategory,
    TypeHelperComponent,
    TypeHelperItem,
    TypeHelperOperator
} from '@wso2-enterprise/type-editor';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { filterOperators, filterTypes, getImportedTypes, getTypeBrowserTypes, getTypes } from '../TypeEditor/utils';
import { TYPE_HELPER_OPERATORS } from '../TypeEditor/constants';
import { useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { LoadingRing } from "../../../components/Loader";
import styled from "@emotion/styled";

const LoadingContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 5000;
`;

type TypeHelperProps = {
    fieldKey: string;
    valueTypeConstraint: string;
    typeBrowserRef: RefObject<HTMLDivElement>;
    filePath: string;
    targetLineRange: LineRange;
    currentType: string;
    currentCursorPosition: number;
    helperPaneHeight: HelperPaneHeight;
    typeHelperState: boolean;
    onChange: (newType: string, newCursorPosition: number) => void;
    changeTypeHelperState: (isOpen: boolean) => void;
    updateImports: (key: string, imports: {[key: string]: string}) => void;
    onTypeCreate: (typeName: string) => void;
    onCloseCompletions?: () => void;
};

const TypeHelperEl = (props: TypeHelperProps) => {
    const {
        fieldKey,
        valueTypeConstraint,
        typeHelperState,
        filePath,
        targetLineRange,
        currentType,
        currentCursorPosition,
        helperPaneHeight,
        onChange,
        changeTypeHelperState,
        typeBrowserRef,
        updateImports,
        onTypeCreate,
        onCloseCompletions
    } = props;

    const { rpcClient } = useRpcContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingTypeBrowser, setLoadingTypeBrowser] = useState<boolean>(false);

    const [basicTypes, setBasicTypes] = useState<TypeHelperCategory[] | undefined>(undefined);
    const [importedTypes, setImportedTypes] = useState<TypeHelperCategory[] | undefined>(undefined);
    const [filteredBasicTypes, setFilteredBasicTypes] = useState<TypeHelperCategory[]>([]);
    const [filteredOperators, setFilteredOperators] = useState<TypeHelperOperator[]>([]);
    const [filteredTypeBrowserTypes, setFilteredTypeBrowserTypes] = useState<TypeHelperCategory[]>([]);

    const debouncedSearchTypeHelper = useCallback(
        debounce((searchText: string, isType: boolean) => {
            if (isType && basicTypes === undefined) {
                if (rpcClient) {
                    rpcClient
                        .getBIDiagramRpcClient()
                        .getVisibleTypes({
                            filePath: filePath,
                            position: {
                                line: targetLineRange.startLine.line,
                                offset: targetLineRange.startLine.offset
                            },
                            ...(valueTypeConstraint && { typeConstraint: valueTypeConstraint })
                        })
                        .then((types) => {
                            const isFetchingTypesForDM = valueTypeConstraint === "json";
                            const basicTypes = getTypes(types, isFetchingTypesForDM);
                            setBasicTypes(basicTypes);
                            setFilteredBasicTypes(basicTypes);

                            /* Get imported types */
                            rpcClient
                                .getBIDiagramRpcClient()
                                .search({
                                    filePath: filePath,
                                    position: targetLineRange,
                                    queryMap: {
                                        q: '',
                                        offset: 0,
                                        limit: 1000
                                    },
                                    searchKind: 'TYPE'
                                })
                                .then((response) => {
                                    const importedTypes = getImportedTypes(response.categories);
                                    setImportedTypes(importedTypes);
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                            setLoading(false);
                        });
                }
            } else if (isType) {
                setFilteredBasicTypes(filterTypes(basicTypes, searchText));
                rpcClient
                    .getBIDiagramRpcClient()
                    .search({
                        filePath: filePath,
                        position: targetLineRange,
                        queryMap: {
                            q: searchText,
                            offset: 0,
                            limit: 1000
                        },
                        searchKind: 'TYPE'
                    })
                    .then((response) => {
                        const importedTypes = getImportedTypes(response.categories);
                        setImportedTypes(importedTypes);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setFilteredOperators(filterOperators(TYPE_HELPER_OPERATORS, searchText));
                setLoading(false);
            }
        }, 150),
        [basicTypes, filePath, targetLineRange]
    );

    const handleSearchTypeHelper = useCallback(
        (searchText: string, isType: boolean) => {
            setLoading(true);
            debouncedSearchTypeHelper(searchText, isType);
        },
        [debouncedSearchTypeHelper, basicTypes]
    );

    const debouncedSearchTypeBrowser = useCallback(
        debounce((searchText: string) => {
            if (rpcClient) {
                rpcClient
                    .getBIDiagramRpcClient()
                    .search({
                        filePath: filePath,
                        position: targetLineRange,
                        queryMap: {
                            q: searchText,
                            offset: 0,
                            limit: 1000
                        },
                        searchKind: 'TYPE'
                        })
                    .then((response) => {
                        setFilteredTypeBrowserTypes(getTypeBrowserTypes(response.categories));
                    })
                    .finally(() => {
                        setLoadingTypeBrowser(false);
                    });
            }
        }, 150),
        [filePath, targetLineRange]
    );

    const handleSearchTypeBrowser = useCallback(
        (searchText: string) => {
            setLoadingTypeBrowser(true);
            debouncedSearchTypeBrowser(searchText);
        },
        [debouncedSearchTypeBrowser]
    );

    const { mutateAsync: addFunction, isLoading: isAddingType  } = useMutation(
        (item: TypeHelperItem) => 
            rpcClient.getBIDiagramRpcClient().addFunction({
                filePath: filePath,
                codedata: item.codedata,
                kind: item.kind,
                searchKind: 'TYPE'
            })
    );

    const handleTypeItemClick = async (item: TypeHelperItem) => {
        const response = await addFunction(item);

        if (response) {
            const importStatement = {
                [response.prefix]: response.moduleId
            };
            updateImports(fieldKey, importStatement);
            return response.template;
        }

        return '';
    };

    const handleTypeHelperClose = () => {
        changeTypeHelperState(false);
    };

    const handleTypeCreate = (typeName?: string) => {
        changeTypeHelperState(false);
        onTypeCreate(typeName || 'MyType');
    };

    return (
        <>
            <TypeHelperComponent
                open={typeHelperState}
                currentType={currentType}
                currentCursorPosition={currentCursorPosition}
                loading={loading}
                loadingTypeBrowser={loadingTypeBrowser}
                referenceTypes={basicTypes}
                basicTypes={filteredBasicTypes}
                importedTypes={importedTypes}
                operators={filteredOperators}
                typeBrowserTypes={filteredTypeBrowserTypes}
                typeBrowserRef={typeBrowserRef}
                typeHelperHeight={helperPaneHeight}
                onChange={onChange}
                onSearchTypeHelper={handleSearchTypeHelper}
                onSearchTypeBrowser={handleSearchTypeBrowser}
                onTypeItemClick={handleTypeItemClick}
                onClose={handleTypeHelperClose}
                onTypeCreate={handleTypeCreate}
                onCloseCompletions={onCloseCompletions}
            />
            {isAddingType && createPortal(
                <>
                    <Overlay sx={{ background: `${ThemeColors.SURFACE_CONTAINER}`, opacity: `0.3`, zIndex: 5000 }} />
                    <LoadingContainer> <LoadingRing /> </LoadingContainer>
                </>
                , document.body
            )}
        </>
    );
};

export const getTypeHelper = (props: TypeHelperProps) => {
    return (
        <TypeHelperEl {...props} />
    );
};
