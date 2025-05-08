/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

import {
    LibraryDataResponse,
    LibraryInfo,
    LibrarySearchResponse
} from "@wso2-enterprise/ballerina-core";
import { Grid } from '@wso2-enterprise/ui-toolkit';

import { SUGGESTION_COLUMN_SIZE } from '../../../constants';
import { useStmtEditorHelperPanelStyles } from "../../styles";
import { Library } from "../Library";
import { SearchCategory } from "../SearchCategory";

interface SearchResultProps {
    librarySearchResponse: LibrarySearchResponse,
    libraryBrowsingHandler?: (libraryData: LibraryDataResponse) => void
    moduleSelected: boolean
    libraryDataFetchingHandler: (isFetching: boolean, moduleElement?: string) => void
}

export function SearchResult(props: SearchResultProps) {
    const stmtEditorHelperClasses = useStmtEditorHelperPanelStyles();
    const { librarySearchResponse, libraryBrowsingHandler, moduleSelected, libraryDataFetchingHandler } = props;
    const { modules, classes, functions, records, constants, errors, types, clients, listeners, annotations,
            objectTypes, enums } = librarySearchResponse;

    return (
        <div className={stmtEditorHelperClasses.searchResult}>
            {modules.length > 0 && !moduleSelected && (
                    <div>
                        <div className={stmtEditorHelperClasses.helperPaneSubHeader}>Modules</div>
                        <Grid columns={SUGGESTION_COLUMN_SIZE} data-testid="library-element-block-content">
                            {modules.map((library: LibraryInfo, index: number) => (
                                <Library
                                    libraryInfo={library}
                                    key={index}
                                    libraryBrowsingHandler={libraryBrowsingHandler}
                                    libraryDataFetchingHandler={libraryDataFetchingHandler}
                                />
                            ))}
                        </Grid>
                    </div>
                )
            }
            {classes.length > 0 && <SearchCategory label='Classes' searchResult={classes} />}
            {functions.length > 0 && <SearchCategory label='Functions' searchResult={functions}/>}
            {records.length > 0 && <SearchCategory label='Records' searchResult={records} />}
            {constants.length > 0 && <SearchCategory label='Constants' searchResult={constants} />}
            {errors.length > 0 && <SearchCategory label='Errors' searchResult={errors} />}
            {types.length > 0 && <SearchCategory label='Types' searchResult={types} />}
            {clients.length > 0 && <SearchCategory label='Clients' searchResult={clients} />}
            {listeners.length > 0 && <SearchCategory label='Listeners' searchResult={listeners} />}
            {annotations.length > 0 && <SearchCategory label='Annotations' searchResult={annotations} />}
            {objectTypes.length > 0 && <SearchCategory label='Object Types' searchResult={objectTypes} />}
            {enums.length > 0 && <SearchCategory label='Enums' searchResult={enums} />}
        </div>
    );
}
