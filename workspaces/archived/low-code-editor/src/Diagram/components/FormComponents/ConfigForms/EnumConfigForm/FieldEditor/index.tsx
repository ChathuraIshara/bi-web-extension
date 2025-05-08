/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { Typography } from "@material-ui/core";
import classnames from "classnames";

import DeleteButton from "../../../../../../assets/icons/DeleteButton";
import { FormState, useRecordEditorContext } from "../../../../../../Contexts/RecordEditor";
import { FormTextInput } from "../../../FormFieldComponents/TextField/FormTextInput";
import { VariableTypeInput, VariableTypeInputProps } from "../../Components/VariableTypeInput";
import { enumStyles } from "../style";
import { EnumModel, SimpleField } from "../types";

export interface FieldEditorProps {
    field: SimpleField;
    nameError?: string;
    onDeleteClick: (field: SimpleField) => void;
    onChange: (event: any) => void;
    onFocusLost: (field: SimpleField) => void;
    onEnterPress?: (field: SimpleField) => void;
}

export function FieldEditor(props: FieldEditorProps) {
    const { field, nameError, onDeleteClick, onChange, onFocusLost } = props;

    const enumClasses = enumStyles();

    const handleDelete = () => {
        onDeleteClick(field);
    };
    const handleKeyUp = (event: any) => {
        onChange(event);
    };

    const handleFocusLost = (event: any) => {
        onFocusLost(event);
    };

    return (
        <div className={enumClasses.itemWrapper}>
            <div className={enumClasses.editItemContentWrapper}>
                <div className={enumClasses.itemLabelWrapper}>
                    <div className={enumClasses.editNameWrapper}>
                        <FormTextInput
                            dataTestId="member-name"
                            customProps={{
                                isErrored: (nameError !== ""),
                                focused: true
                            }}
                            errorMessage={nameError}
                            defaultValue={field?.name}
                            onKeyUp={handleKeyUp}
                            onBlur={handleFocusLost}
                            placeholder={"Member name"}
                            size="small"
                        />
                        <Typography
                            variant='body2'
                            className={classnames(enumClasses.editSingleTokenWrapper)}
                        >
                            ,
                        </Typography>
                    </div>
                    <div className={enumClasses.editFieldDelBtn}>
                        <DeleteButton onClick={handleDelete} />
                    </div>
                </div>

            </div>
        </div>
    );
}
