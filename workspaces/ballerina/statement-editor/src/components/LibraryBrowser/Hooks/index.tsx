/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { LibraryInfo, LibraryKind, LibrarySearchResponse } from '@wso2-enterprise/ballerina-core';
import { LibraryBrowserRpcClient } from '@wso2-enterprise/ballerina-rpc-client';

import { LANG_LIBS_IDENTIFIER, STD_LIBS_IDENTIFIER } from '../../../constants';

export const useLibrarySearchData = (libraryBrowserRpcClient: LibraryBrowserRpcClient): {
    librariesSearchData: LibrarySearchResponse;
    isFetchingSearchData: boolean;
    isError: boolean;
    refetch: any;
} => {
    const fetchLibrarySearchData = async () => {
        try {
            return await libraryBrowserRpcClient.getLibrariesData();
        } catch (networkError: any) {
            // tslint:disable-next-line:no-console
            console.error('Error while fetching library search data', networkError);
        }
    };

    const {
        data: librariesSearchData,
        isFetching: isFetchingSearchData,
        isError,
        refetch,
    } = useQuery(['fetchProjectComponents'], () => fetchLibrarySearchData(), { networkMode: 'always' });

    return { librariesSearchData, isFetchingSearchData, isError, refetch };
};

export const useLibrariesList = (libraryBrowserRpcClient: LibraryBrowserRpcClient, libraryType: string): {
    libraries: LibraryInfo[];
    isFetchingLibList: boolean;
    isError: boolean;
    refetch: any;
} => {
    const fetchLibrariesList = async () => {
        try {
            let response;
            if (libraryType === LANG_LIBS_IDENTIFIER) {
                response = await libraryBrowserRpcClient.getLibrariesList({kind: LibraryKind.langLib});
            } else if (libraryType === STD_LIBS_IDENTIFIER) {
                response = await libraryBrowserRpcClient.getLibrariesList({kind: LibraryKind.stdLib});
            } else {
                response = await libraryBrowserRpcClient.getLibrariesList({});
            }
            return response.librariesList;
        } catch (networkError: any) {
            // tslint:disable-next-line:no-console
            console.error('Error while fetching libraries list', networkError);
        }
    };

    const {
        data: libraries,
        isFetching: isFetchingLibList,
        isError,
        refetch,
    } = useQuery(['fetchProjectComponents', {libraryType}], () => fetchLibrariesList(), { networkMode: 'always' });

    return { libraries, isFetchingLibList, isError, refetch };
};
