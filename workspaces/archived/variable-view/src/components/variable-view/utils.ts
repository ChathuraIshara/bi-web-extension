/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Sorts an array of objects by a given key
 * 
 * @param values array of objects to be sorted
 * @param key key to use for sorting
 * @param ascending sort direction
 * @returns sorted array
 */

export function sortArrayOfObjectsByKey(values: any[], key: string, ascending: boolean = true) {
    const sorted = values.sort((val1, val2) => val1[key].localeCompare(val2[key]));
    return ascending ? sorted : sorted.reverse();
}

export function getIsDarkMode() {
    return document.body.getAttribute('data-vscode-theme-kind')?.includes('dark') ?? false;
}
