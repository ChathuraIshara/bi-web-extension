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

import { AddIcon } from "../../../../../../../../assets/icons";
import { ReturnType, ReturnTypeCollection } from "../../types";
import {
    convertReturnTypeStringToSegments,
    generateReturnTypeFromReturnCollection,
    recalculateItemIds
} from "../../util";

import { ReturnTypeItem } from "./ReturnTypeItem";
import { ReturnTypeSegmentEditor } from "./SegmentEditor";
import { useStyles } from './style';

interface ReturnTypeEditorProps {
    returnTypeString?: string;
    defaultValue?: string;
    isCaller?: boolean;
    onChange?: (text: string) => void;
}

export function ReturnTypeEditor(props: ReturnTypeEditorProps) {
    const { returnTypeString, defaultValue, isCaller, onChange } = props;

    const initReturnType: ReturnTypeCollection = {
        types: convertReturnTypeStringToSegments(returnTypeString)
    }
    const classes = useStyles();

    const [returnTypeCollection, setReturnTypeCollection] = useState<ReturnTypeCollection>(initReturnType);
    const [addingReturnType, setAddingReturnType] = useState<boolean>(false);


    const onDelete = (returnType: ReturnType) => {
        const id = returnType.id;
        if (id > -1) {
            const returnTypeCollectionClone: ReturnTypeCollection = {
                types: returnTypeCollection.types
            };
            returnTypeCollectionClone.types.splice(id, 1);
            recalculateItemIds(returnTypeCollectionClone.types);
            setReturnTypeCollection(returnTypeCollectionClone);
            if (onChange) {
                onChange(generateReturnTypeFromReturnCollection(returnTypeCollectionClone.types));
            }
        }
    };

    const returnTypeItems: React.ReactElement[] = [];
    returnTypeCollection.types.forEach((value, index) => {
        if (value.type) {
            returnTypeItems.push(<ReturnTypeItem returnType={value} onDelete={onDelete}/>);
        }
    });

    const onSave = (returnType: ReturnType) => {
        if (returnType.type !== "error") {
            returnTypeCollection.types.push(returnType);
        }
        setReturnTypeCollection(returnTypeCollection);
        setAddingReturnType(!addingReturnType);
        if (onChange) {
            onChange(generateReturnTypeFromReturnCollection(returnTypeCollection.types));
        }
    };

    const onCancel = () => {
        setAddingReturnType(!addingReturnType);
    };

    const addReturnType = () => {
        setAddingReturnType(!addingReturnType);
    }

    const returnTypeSegmentEditor = (
        <div>
            <ReturnTypeSegmentEditor
                id={returnTypeCollection.types.length}
                showDefaultError={isCaller}
                onCancel={onCancel}
                onSave={onSave}
            />
        </div>
    );

    const addReturnTypeBtn = (
        <div id="">
            <button
                onClick={addReturnType}
                className={classes.addReturnTypeBtn}
            >
                <div className={classes.addReturnTypeBtnWrap}>
                    <AddIcon/>
                    <p><FormattedMessage id="lowcode.develop.apiConfigWizard.addReturnType.title" defaultMessage="Add Return Type"/></p>
                </div>
            </button>
        </div>
    );

    return (
        <div>
            <div id="listReturnTypes" >
                {returnTypeItems}
            </div>
            {addingReturnType ?  returnTypeSegmentEditor : addReturnTypeBtn}
        </div>
    );
}
