/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { RefObject, useRef, useState } from 'react';

import { CheckBox, CheckBoxGroup, ClickAwayListener, Codicon } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';

const DropDownContainer = styled.div({
    position: "absolute",
    top: "100%",
    right: "0",
    zIndex: 5,
    backgroundColor: "var(--vscode-sideBar-background)",
    padding: "5px"
});

const SearchBoxOptionsContainer = styled.div({
    display: "flex",
    flexDirection: "row"
});

interface HeaderSearchBoxOptionsProps {
    searchTerm: string;
    searchInputRef: RefObject<HTMLInputElement>;
    searchOptions: string[];
    searchOptionsData: { value: string, label: string }[];
    handleSearchOptions: (options: string[]) => void;
    handleOnSearchTextClear: () => void;
}

export function HeaderSearchBoxOptions(props: HeaderSearchBoxOptionsProps) {
    const {
        searchTerm,
        searchInputRef,
        searchOptions,
        handleSearchOptions,
        handleOnSearchTextClear,
        searchOptionsData
    } = props;

    const [showSearchOptions, setShowSearchOptions] = useState(false);
    const showSearchOptionsRef = useRef(null);

    const handleSearchOptionsChange = (checked: boolean, value: string) => {
        if (checked) {
            if (searchOptions.indexOf(value) === -1) {
                handleSearchOptions([value, ...searchOptions]);
            }
        } else {
            handleSearchOptions(searchOptions.filter(option => option !== value));
        }
        searchInputRef.current.shadowRoot.querySelector('input').focus();
    };

    return (
        <SearchBoxOptionsContainer>
            {searchTerm && (
                <Codicon
                    name="close"
                    onClick={handleOnSearchTextClear}
                    sx={{ marginRight: "5px" }}
                />
            )}

            <div>
                <div ref={showSearchOptionsRef}>
                    <Codicon
                        name={showSearchOptions ? "chevron-up" : "chevron-down"}
                        onClick={() => setShowSearchOptions(!showSearchOptions)}
                    />
                </div>
                <ClickAwayListener
                    onClickAway={() => { setShowSearchOptions(false); }}
                    anchorEl={showSearchOptionsRef.current}
                >
                    {showSearchOptions && (
                        <DropDownContainer>
                            <CheckBoxGroup direction="vertical">
                                {searchOptionsData.map((item) => (
                                    <CheckBox
                                        checked={searchOptions.indexOf(item.value) > -1}
                                        label={item.label}
                                        onChange={(checked) => {
                                            handleSearchOptionsChange(checked, item.value);
                                        }}
                                        value={item.value}
                                    />
                                ))}
                            </CheckBoxGroup>
                        </DropDownContainer>
                    )}
                </ClickAwayListener>
            </div>
        </SearchBoxOptionsContainer>
    );
};
