/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { css } from "@emotion/css";

import { useDMSearchStore } from "../../../../../store/store";

interface SearchHighlightRootProps extends SearchHighlightProps{
    searchText: string;
}

interface SearchHighlightProps {
    children: string;
}

const useStyles = () => ({
    highlighted: css({ background: "var(--vscode-editor-findMatchHighlightBackground)" }),
});

function SearchHighlight({ children, searchText }: SearchHighlightRootProps) {
    const classes = useStyles();
    const parts = children?.split(new RegExp(`(${escapeRegExp(searchText)})`, 'gi')) || [];
    return (
        <>
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part.toLowerCase() === searchText.toLowerCase() ? (
                        <span className={classes.highlighted} data-testid={`search-highlight`}>{part}</span>
                    ) : (
                        part
                    )}
                </React.Fragment>
            ))}
        </>
    );
}

export function InputSearchHighlight({ children }: SearchHighlightProps) {
    const inputSearch = useDMSearchStore((state) => state.inputSearch);
    return <SearchHighlight searchText={inputSearch}>{children}</SearchHighlight>
}

export function OutputSearchHighlight({ children }: SearchHighlightProps) {
    const outputSearch = useDMSearchStore((state) => state.outputSearch);
    return <SearchHighlight searchText={outputSearch}>{children}</SearchHighlight>
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
