/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { AddIcon } from "../../../../../../../../assets/icons";
import { QueryParam, QueryParamCollection } from "../../types";
import {
    convertQueryParamStringToSegments,
    generateQueryParamFromQueryCollection,
    recalculateItemIds
} from "../../util";

import { QueryParamItem } from "./queryParamItem";
import { QueryParamSegmentEditor } from "./queryParamSegmentEditor";
import { useStyles } from './style';

interface QueryParamEditorProps {
    queryParams?: string;
    defaultValue?: string;
    onChange?: (text: string) => void;
    targetPosition?: NodePosition;
}

export function QueryParamEditor(props: QueryParamEditorProps) {
    const { queryParams, onChange, targetPosition } = props;
    const queryParamCollection: QueryParamCollection = convertQueryParamStringToSegments(queryParams ? queryParams : "");
    const classes = useStyles();

    const [queryParamCollectionState, setQueryParamCollectionState] = useState<QueryParamCollection>(queryParamCollection);
    const [addingQueryParam, setAddingQueryParam] = useState<boolean>(false);
    // editingSegmentId > -1 when editing
    const [editingSegmentId, setEditingSegmentId] = useState<number>(-1);

    const onDelete = (queryParam: QueryParam) => {
        const id = queryParam.id;
        if (id > -1) {
            const queryParamCollectionClone: QueryParamCollection = {
                queryParams: queryParamCollectionState.queryParams
            };
            queryParamCollectionClone.queryParams.splice(id, 1);
            recalculateItemIds(queryParamCollectionClone.queryParams);
            setQueryParamCollectionState(queryParamCollectionClone);
            if (onChange) {
                onChange(generateQueryParamFromQueryCollection(queryParamCollectionClone));
            }
        }
    };

    const handleOnSave = (queryParam: QueryParam) => {
        queryParamCollectionState.queryParams.push(queryParam);
        setQueryParamCollectionState(queryParamCollectionState);
        setAddingQueryParam(false);
        setEditingSegmentId(-1);
        if (onChange) {
            onChange(generateQueryParamFromQueryCollection(queryParamCollectionState));
        }
    };

    const onEdit = (queryParam: QueryParam) => {
        const id = queryParamCollectionState.queryParams.indexOf(queryParam);
        // Once edit is clicked
        if (id > -1) {
            setEditingSegmentId(id);
        }
        setAddingQueryParam(false);
    };

    const onUpdate = (queryParam: QueryParam) => {
        const id = queryParam.id;
        if (id > -1) {
            queryParamCollectionState.queryParams[id] = queryParam;
            setQueryParamCollectionState(queryParamCollectionState);
        }
        setAddingQueryParam(false);
        setEditingSegmentId(-1);
        if (onChange) {
            onChange(generateQueryParamFromQueryCollection(queryParamCollectionState));
        }
    };

    const onCancel = () => {
        setAddingQueryParam(false);
        setEditingSegmentId(-1);
    };

    const queryParamsItems: React.ReactElement[] = [];
    queryParamCollectionState.queryParams.forEach((value, index) => {
        if (editingSegmentId !== index) {
            queryParamsItems.push(
                <QueryParamItem
                    queryParam={value}
                    onDelete={onDelete}
                    onEditClick={onEdit}
                    addInProgress={addingQueryParam}
                />
            );
        } else if (editingSegmentId === index) {
            queryParamsItems.push(
                <QueryParamSegmentEditor
                    id={editingSegmentId}
                    queryParam={value}
                    onCancel={onCancel}
                    onUpdate={onUpdate}
                />
            );
        }
    });

    const addQueryParam = () => {
        setAddingQueryParam(true);
    }

    const queryParamSegmentEditor = (
        <div>
            <QueryParamSegmentEditor
                id={queryParamCollectionState.queryParams.length}
                onCancel={onCancel}
                onSave={handleOnSave}
                targetPosition={targetPosition}
            />
        </div>
    );

    const addQueryParamBtnUI = (
        <div>
            <button
                onClick={addQueryParam}
                className={classes.addQueryParamBtn}
            >
                <div className={classes.addQueryParamBtnWrap}>
                    <AddIcon data-testid="add-query-param-button" />
                    <p><FormattedMessage id="lowcode.develop.apiConfigWizard.addQueryParam.title" defaultMessage="Add Query Param" /></p>
                </div>
            </button>
        </div>
    );

    return (
        <div>
            <div id="listOfQueryParams" >
                {queryParamsItems}
            </div>
            {addingQueryParam && queryParamSegmentEditor}
            {!addingQueryParam && (editingSegmentId === -1) && addQueryParamBtnUI}
        </div>
    );
}
