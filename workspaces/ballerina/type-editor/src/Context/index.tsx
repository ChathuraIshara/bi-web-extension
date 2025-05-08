/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createContext, useContext } from "react"
import { RecordCreatorContext } from "../types"
import { TypeHelperCategory, TypeHelperItem, TypeHelperOperator } from "../TypeHelper";
import { AddImportItemResponse } from "@wso2-enterprise/ballerina-core";

const defaultContext: any = {}

export const Context = createContext<RecordCreatorContext>(defaultContext);

export type TypeHelperContext = {
    // Whether the types or operators are being loaded
    loading?: boolean;
    // Whether the type browser is loading
    loadingTypeBrowser?: boolean;
    // Array of reference types for the type helper
    referenceTypes: TypeHelperCategory[];
    // Array of types for the type helper
    basicTypes: TypeHelperCategory[];
    // Array of imported types for the type helper
    importedTypes: TypeHelperCategory[];
    // Array of operators for type helper
    operators: TypeHelperOperator[];
    // Callback function to search the type helper
    onSearchTypeHelper: (searchText: string, isType: boolean) => void;
    // Array of types for the type browser
    typeBrowserTypes: TypeHelperCategory[];
    // Callback function to search the type browser
    onSearchTypeBrowser: (searchText: string) => void;
    // Callback function to handle type item click
    onTypeItemClick: (item: TypeHelperItem) => Promise<AddImportItemResponse>;
    // Callback function to close the completions
    onCloseCompletions?: () => void;
};

const defaultTypeHelperContext: TypeHelperContext = {
    loading: false,
    loadingTypeBrowser: false,
    referenceTypes: [],
    basicTypes: [],
    importedTypes: [],
    operators: [],
    typeBrowserTypes: [],
    onSearchTypeHelper: () => {},
    onSearchTypeBrowser: () => {},
    onTypeItemClick: () => Promise.resolve({} as AddImportItemResponse),
    onCloseCompletions: () => {}
};

export const TypeHelperContext = createContext<TypeHelperContext>(defaultTypeHelperContext);

export const useTypeHelperContext = () => {
    return useContext(TypeHelperContext);
};
