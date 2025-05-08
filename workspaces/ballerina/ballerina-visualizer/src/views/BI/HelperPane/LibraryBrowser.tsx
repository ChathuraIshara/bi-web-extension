/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RefObject, useEffect, useRef, useState } from 'react';
import { COMPLETION_ITEM_KIND, getIcon, HelperPane } from '@wso2-enterprise/ui-toolkit';
import { HelperPaneCompletionItem, HelperPaneFunctionInfo } from '@wso2-enterprise/ballerina-side-panel';

type LibraryBrowserProps = {
    anchorRef: RefObject<HTMLDivElement>;
    isLoading: boolean;
    libraryBrowserInfo: HelperPaneFunctionInfo;
    setFilterText: (filterText: string) => void;
    onBack: () => void;
    onClose: () => void;
    onChange: (value: string) => void;
    onFunctionItemSelect: (item: HelperPaneCompletionItem) => Promise<string>;
};

export const LibraryBrowser = ({
    anchorRef,
    isLoading,
    libraryBrowserInfo,
    setFilterText,
    onBack,
    onClose,
    onChange,
    onFunctionItemSelect
}: LibraryBrowserProps) => {
    const firstRender = useRef<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            setFilterText('');
        }
    }, []);

    const handleSearch = (searchText: string) => {
        setFilterText(searchText);
        setSearchValue(searchText);
    };

    const handleFunctionItemSelect = async (item: HelperPaneCompletionItem) => {
        const response = await onFunctionItemSelect(item);
        onChange(response);
        onClose();
    };

    return (
        <HelperPane.LibraryBrowser
            anchorRef={anchorRef}
            loading={isLoading}
            searchValue={searchValue}
            onSearch={handleSearch}
            onClose={onBack}
            title='Function Browser'
            titleSx={{ fontFamily: 'GilmerRegular' }}
        >
            {libraryBrowserInfo?.category.map((category) => (
                <HelperPane.LibraryBrowserSection
                    key={category.label}
                    title={category.label}
                    titleSx={{ fontFamily: 'GilmerMedium' }}
                    {...(category.items?.length > 0 && category.subCategory?.length === 0 && {
                        columns: 4
                    })}
                >
                    {category.items?.map((item) => (
                        <HelperPane.CompletionItem
                            key={`${category.label}-${item.label}`}
                            label={item.label}
                            type={item.type}
                            getIcon={() => getIcon(COMPLETION_ITEM_KIND.Function)}
                            onClick={async () => await handleFunctionItemSelect(item)}
                        />
                    ))}
                    {category.subCategory?.map((subCategory) => (
                        <HelperPane.LibraryBrowserSubSection
                            key={`${category.label}-${subCategory.label}`}
                            title={subCategory.label}
                            columns={4}
                        >
                            {subCategory.items?.map((item) => (
                                <HelperPane.CompletionItem
                                    key={`${category.label}-${subCategory.label}-${item.label}`}
                                    label={item.label}
                                    getIcon={() => getIcon(COMPLETION_ITEM_KIND.Function)}
                                    onClick={async () => await handleFunctionItemSelect(item)}
                                />
                            ))}
                        </HelperPane.LibraryBrowserSubSection>
                    ))}
                </HelperPane.LibraryBrowserSection>
            ))}
        </HelperPane.LibraryBrowser>
    );
};
