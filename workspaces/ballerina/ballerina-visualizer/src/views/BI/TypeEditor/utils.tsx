/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AvailableNode, Category, functionKinds, Item, VisibleTypeItem } from '@wso2-enterprise/ballerina-core';
import type { TypeHelperCategory, TypeHelperItem, TypeHelperOperator } from '@wso2-enterprise/type-editor';
import { COMPLETION_ITEM_KIND, convertCompletionItemKind } from '@wso2-enterprise/ui-toolkit';
import { getFunctionItemKind, isDMSupportedType } from '../../../utils/bi';

// TODO: Remove this order onces the LS is fixed
const TYPE_CATEGORY_ORDER = [
    { label: "User-Defined", sortText: "0"},
    { label: "Primitive Types", sortText: "1"},
    { label: "Data Types", sortText: "2"},
    { label: "Structural Types", sortText: "3"},
    { label: "Error Types", sortText: "4"},
    { label: "Behaviour Types", sortText: "5"},
    { label: "Other Types", sortText: "6"},
    { label: "Used Variable Types", sortText: "7"},
] as const;

/**
 * Get the categories for the type editor
 *
 * @param types - The types to get the categories for
 * @param filterDMTypes - Whether to filter the types for the data mapper
 * @returns The categories for the type editor
 */
export const getTypes = (types: VisibleTypeItem[], filterDMTypes?: boolean): TypeHelperCategory[] => {
    const categoryRecord: Record<string, TypeHelperItem[]> = {};

    for (const type of types) {
        if (!type) {
            continue;
        }

        // If types should be filtered for the data mapper
        if (filterDMTypes && !isDMSupportedType(type)) {
            continue;
        }

        if (!categoryRecord[type.labelDetails.detail]) {
            categoryRecord[type.labelDetails.detail] = [];
        }
        categoryRecord[type.labelDetails.detail].push({
            name: type.label,
            insertText: type.insertText,
            type: convertCompletionItemKind(type.kind)
        });
    }

    const categories = Object.entries(categoryRecord).map(([category, items]) => ({
        category,
        sortText: TYPE_CATEGORY_ORDER.find((order) => order.label === category)?.sortText,
        items
    }));

    return categories.sort((a, b) => a.sortText.localeCompare(b.sortText));
};

export const filterTypes = (types: TypeHelperCategory[], searchText: string) => {
    const filteredTypes = [];

    for (const category of types) {
        const filteredItems = category.items.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        if (filteredItems.length > 0) {
            filteredTypes.push({ ...category, items: filteredItems });
        }
    }

    return filteredTypes;
};

export const filterOperators = (operators: TypeHelperOperator[], searchText: string) => {
    return operators.filter((operator) => operator.name.toLowerCase().includes(searchText.toLowerCase()));
};

const isCategoryType = (item: Item): item is Category => {
    return !(item as AvailableNode)?.codedata;
}

export const getImportedTypes = (types: Category[]) => {
    const categories: TypeHelperCategory[] = [];

    for (const category of types) {
        if (category.items.length === 0) {
            continue;
        }
        
        const categoryKind = getFunctionItemKind(category.metadata.label);
        if (categoryKind !== functionKinds.IMPORTED) {
            continue;
        }

        const items: TypeHelperItem[] = [];
        const subCategories: TypeHelperCategory[] = [];
        for (const categoryItem of category.items) {
            if (isCategoryType(categoryItem)) {
                if (categoryItem.items.length === 0) {
                    continue;
                }

                subCategories.push({
                    category: categoryItem.metadata.label,
                    items: categoryItem.items.map((item) => ({
                        name: item.metadata.label,
                        insertText: item.metadata.label,
                        type: COMPLETION_ITEM_KIND.TypeParameter,
                        codedata: (item as AvailableNode).codedata,
                        kind: categoryKind
                    }))
                });
            } else {
                items.push({
                    name: categoryItem.metadata.label,
                    insertText: categoryItem.metadata.label,
                    type: COMPLETION_ITEM_KIND.TypeParameter,
                    codedata: categoryItem.codedata,
                    kind: categoryKind
                });
            }
        }

        const categoryItem: TypeHelperCategory = {
            category: category.metadata.label,
            subCategory: subCategories,
            items: items
        }

        categories.push(categoryItem);
    }

    return categories;
};

export const getTypeBrowserTypes = (types: Category[]) => {
    const categories: TypeHelperCategory[] = [];

    for (const category of types) {
        if (category.items.length === 0) {
            continue;
        }
        
        const categoryKind = getFunctionItemKind(category.metadata.label);
        const items: TypeHelperItem[] = [];
        const subCategories: TypeHelperCategory[] = [];
        for (const categoryItem of category.items) {
            if (isCategoryType(categoryItem)) {
                if (categoryItem.items.length === 0) {
                    continue;
                }

                subCategories.push({
                    category: categoryItem.metadata.label,
                    items: categoryItem.items.map((item) => ({
                        name: item.metadata.label,
                        insertText: item.metadata.label,
                        type: COMPLETION_ITEM_KIND.TypeParameter,
                        codedata: (item as AvailableNode).codedata,
                        kind: categoryKind
                    }))
                });
            } else {
                items.push({
                    name: categoryItem.metadata.label,
                    insertText: categoryItem.metadata.label,
                    type: COMPLETION_ITEM_KIND.TypeParameter,
                    codedata: categoryItem.codedata,
                    kind: categoryKind
                });
            }
        }

        const categoryItem: TypeHelperCategory = {
            category: category.metadata.label,
            subCategory: subCategories,
            items: items
        }

        categories.push(categoryItem);
    }

    return categories;
};
