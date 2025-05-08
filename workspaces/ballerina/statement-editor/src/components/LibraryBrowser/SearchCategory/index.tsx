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

import { ModuleProperty } from "@wso2-enterprise/ballerina-core";
import { Grid } from '@wso2-enterprise/ui-toolkit';
import classNames from "classnames";

import { SUGGESTION_COLUMN_SIZE } from '../../../constants';
import { useStatementEditorStyles, useStmtEditorHelperPanelStyles } from "../../styles";
import { ModuleElement } from "../ModuleElement";

interface SearchCategoryProps {
    label: string,
    searchResult: ModuleProperty[]
}

export function SearchCategory(props: SearchCategoryProps) {
    const stmtEditorHelperClasses = useStmtEditorHelperPanelStyles();
    const statementEditorClasses = useStatementEditorStyles();
    const { label, searchResult } = props;

    return (
        <div className={stmtEditorHelperClasses.libraryElementBlock}>
            <div
                className={classNames(
                    stmtEditorHelperClasses.helperPaneSubHeader,
                    stmtEditorHelperClasses.libraryElementBlockLabel
                )}
            >
                {label}
            </div>
            <Grid columns={SUGGESTION_COLUMN_SIZE} data-testid="library-element-block-content">
                {searchResult.map((property: ModuleProperty, index: number) => (
                    <ModuleElement
                        moduleProperty={property}
                        key={index}
                        isFunction={label === 'Functions'}
                        label={label}
                    />
                ))}
            </Grid>
            <div className={statementEditorClasses.separatorLine} />
        </div>
    );
}
