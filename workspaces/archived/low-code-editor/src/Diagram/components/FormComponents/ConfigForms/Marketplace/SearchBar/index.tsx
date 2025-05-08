/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useEffect, useState } from "react";

import { Box, Grid, InputBase } from "@material-ui/core";
import debounce from "lodash.debounce";

import SearchIcon from "../../../../../../assets/icons/SearchIcon";

import useStyles from "./style";

export interface SearchBarProps {
    searchQuery: string;
    onSearch: (query: string) => void;
    type: string;
}

const DEBOUNCE_DELAY = 1000;

function SearchBar(props: SearchBarProps) {
    const classes = useStyles();
    const { onSearch, searchQuery } = props;

    const [query, setQuery] = useState(searchQuery);

    const debouncedQueryChanged = debounce(onSearch, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedQueryChanged(query);
        return () => debouncedQueryChanged.cancel();
    }, [query]);

    const onQueryChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key === "Enter") {
            onSearchPress();
        }
    };

    const onSearchPress = () => {
        debouncedQueryChanged.cancel();
        onSearch(query);
    };

    return (
        <Grid container={true} classes={{ root: classes.searchBarRoot }}>
            <Grid item={true} container={true} xs={true}>
                <InputBase
                    classes={{ root: classes.searchText }}
                    placeholder={"Search for " + props.type}
                    value={query}
                    onChange={onQueryChanged}
                    onKeyDown={onKeyDown}
                    aria-label="search-for-connectors"
                    data-testid="search-input"
                />
            </Grid>
        </Grid>
    );
}

export default SearchBar;
