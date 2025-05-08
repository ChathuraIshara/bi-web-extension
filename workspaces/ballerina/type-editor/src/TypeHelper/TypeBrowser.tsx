/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Codicon, getIcon, HelperPane } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';

import { TypeHelperCategory, TypeHelperItem } from '.';
import { EMPTY_SEARCH_RESULT_MSG, EMPTY_SEARCH_TEXT_MSG } from './constant';

const SearchMsg = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: var(--vscode-descriptionForeground)
`;

type TypeBrowserProps = {
    typeBrowserRef: RefObject<HTMLDivElement>;
    loadingTypeBrowser: boolean;
    typeBrowserTypes: TypeHelperCategory[];
    onSearchTypeBrowser: (searchText: string) => void;
    onTypeItemClick: (item: TypeHelperItem) => Promise<void>;
    onClose: () => void;
};

export const TypeBrowser = (props: TypeBrowserProps) => {
    const {
        typeBrowserRef,
        loadingTypeBrowser,
        typeBrowserTypes,
        onSearchTypeBrowser,
        onTypeItemClick,
        onClose
    } = props;

    const firstRender = useRef<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
        onSearchTypeBrowser(searchText);
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            onSearchTypeBrowser('');
            return;
        }
    }, [typeBrowserTypes]);

    return (
        <HelperPane.LibraryBrowser
            anchorRef={typeBrowserRef}
            loading={loadingTypeBrowser}
            searchValue={searchValue}
            onSearch={handleSearch}
            onClose={onClose}
            title="Type Browser"
            titleSx={{ fontFamily: 'GilmerRegular' }}
        >
            {typeBrowserTypes?.length > 0 ? (
                typeBrowserTypes.map((category) => (
                    <HelperPane.Section
                        key={category.category}
                        title={category.category}
                        titleSx={{ fontFamily: 'GilmerMedium' }}
                        {...(category.items?.length > 0 &&
                            category.subCategory?.length === 0 && {
                                columns: 4
                            })}
                    >
                        {category.items?.map((item) => (
                            <HelperPane.CompletionItem
                                key={`${category.category}-${item.name}`}
                                label={item.name}
                                getIcon={() => getIcon(item.type)}
                                onClick={() => onTypeItemClick(item)}
                            />
                        ))}
                        {category.subCategory?.map((subCategory) => (
                            <HelperPane.LibraryBrowserSubSection
                                key={subCategory.category}
                                title={subCategory.category}
                                columns={4}
                            >
                                {subCategory.items?.map((item) => (
                                    <HelperPane.CompletionItem
                                        key={`${subCategory.category}-${item.name}`}
                                        label={item.name}
                                        getIcon={() => getIcon(item.type)}
                                        onClick={() => onTypeItemClick(item)}
                                    />
                                ))}
                            </HelperPane.LibraryBrowserSubSection>
                        ))}
                    </HelperPane.Section>
                ))
            ) : (
                <SearchMsg>
                    <Codicon name='search' sx={{ marginRight: '10px' }} />
                    <p>
                        {searchValue !== "" ? EMPTY_SEARCH_RESULT_MSG : EMPTY_SEARCH_TEXT_MSG}
                    </p>
                </SearchMsg>
            )}
        </HelperPane.LibraryBrowser>
    );
};
