/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { Typography } from "@material-ui/core";
import classnames from "classnames";

import DeleteButton from "../../../../../../assets/icons/DeleteButton";
import EditButton from "../../../../../../assets/icons/EditButton";
import { useRecordEditorContext } from "../../../../../../Contexts/RecordEditor";
import { enumStyles } from "../style";
import { SimpleField } from "../types";

export interface FieldItemProps {
    field: SimpleField;
    onEditCLick: (field: SimpleField) => void;
    onDeleteClick: (field: SimpleField) => void;
}

export function FieldItem(props: FieldItemProps) {
    const { field, onDeleteClick, onEditCLick } = props;

    const enumClasses = enumStyles();

    const { state } = useRecordEditorContext();

    const handleDelete = () => {
        onDeleteClick(field);
    };

    const handleEdit = () => {
        onEditCLick(field);
    };

    return (
        <div className={enumClasses.itemWrapper} onClick={handleEdit}>
            <div className={field.isActive ? enumClasses.activeItemContentWrapper : enumClasses.itemContentWrapper}>
                <div className={enumClasses.itemLabelWrapper}>
                    <div className={enumClasses.fieldItem}>
                        <Typography
                            variant='body2'
                            className={classnames(enumClasses.nameWrapper)}
                        >
                            {field.name}
                        </Typography>
                        <Typography
                            variant='body2'
                            className={classnames(enumClasses.singleTokenWrapper)}
                        >
                            ,
                        </Typography>
                    </div>
                    {!state.isEditorInvalid && (
                        <div className={enumClasses.btnWrapper}>
                            <div className={enumClasses.actionBtnWrapper}>
                                <EditButton onClick={handleEdit} />
                            </div>
                            <div className={enumClasses.actionBtnWrapper}>
                                <DeleteButton onClick={handleDelete} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
