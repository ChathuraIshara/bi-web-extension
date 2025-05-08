/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from 'react';

import { LibraryDataResponse, LibraryInfo } from "@wso2-enterprise/ballerina-core";
import { GridItem, Icon, Tooltip, Typography } from "@wso2-enterprise/ui-toolkit";

import { MAX_COLUMN_WIDTH } from '../../../constants';
import { StatementEditorContext } from "../../../store/statement-editor-context";
import { useStmtEditorHelperPanelStyles } from "../../styles";

interface LibraryProps {
    libraryInfo: LibraryInfo,
    key: number,
    libraryBrowsingHandler: (libraryData: LibraryDataResponse) => void
    libraryDataFetchingHandler: (isFetching: boolean, moduleElement?: string) => void
}

export function Library(props: LibraryProps) {
    const { libraryBrowserRpcClient } = useContext(StatementEditorContext);
    const stmtEditorHelperClasses = useStmtEditorHelperPanelStyles();
    const { libraryInfo, key, libraryBrowsingHandler, libraryDataFetchingHandler } = props;
    const { id, orgName, version } = libraryInfo;

    const onClickOnLibrary = async () => {
        libraryDataFetchingHandler(true);
        const response = await libraryBrowserRpcClient.getLibraryData({
            orgName,
            moduleName: id,
            version
        });

        if (response) {
            libraryBrowsingHandler(response);
            libraryDataFetchingHandler(false);
        }
    }

    return (
        <GridItem
            key={key}
            id={key}
            onClick={onClickOnLibrary}
            sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: MAX_COLUMN_WIDTH,
                color: 'var(--foreground)'
            }}
        >
            <div className={stmtEditorHelperClasses.suggestionListItem}>
                <Icon name="module-icon" sx={{color: 'var(--vscode-icon-foreground)', margin: '2px 2px 0 0'}} />
                <Tooltip
                    content={id}
                    position="bottom-end"
                >
                    <Typography
                        variant="body3"
                        className={stmtEditorHelperClasses.suggestionValue}
                        data-testid={`library-item-${key}`}
                    >
                        {id}
                    </Typography>
                </Tooltip>
            </div>
        </GridItem>
    );
}
