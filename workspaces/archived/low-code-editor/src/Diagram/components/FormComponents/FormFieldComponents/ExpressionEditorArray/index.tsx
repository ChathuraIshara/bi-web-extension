/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-empty jsx-curly-spacing
import React, { useState } from "react";

import { AddRounded } from "@material-ui/icons";
import {
    ExpressionEditorLabel,
    ExpressionEditorProps,
    getInitialValue
} from "@wso2-enterprise/ballerina-expression-editor";
import {
    FormElementProps
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    IconBtnWithText
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { useStyles } from "../../DynamicConnectorForm/style"
import { LowCodeExpressionEditor } from "../LowCodeExpressionEditor";

import "./style.scss";
import { appendToArray } from "./utils";

export function ExpressionEditorArray(props: FormElementProps<ExpressionEditorProps>) {
    const { customProps, model, defaultValue } = props;
    const classes = useStyles();

    const [changed, setChanged] = useState(true);
    const [clearInput, setClearInput] = useState(false);
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const [subEditorValue, setSubEditorValue] = useState("");
    const [mainEditorValue, setMainEditorValue] = useState(getInitialValue(defaultValue, model));

    const handleSubEditorValidation = (_field: string, isInvalid: boolean) => {
        if (subEditorValue === "") {
            setAddButtonDisabled(true)
        } else {
            setAddButtonDisabled(isInvalid)
        }
    }

    const handleSubEditorChange = (value: string) => {
        setSubEditorValue(value)
    }

    const handleMainEditorChange = (value: string) => {
        setMainEditorValue(value)
    }

    const revertClearInput = () => {
        setClearInput(false);
    }

    const handleAddButtonClick = () => {
        const newArray = appendToArray(subEditorValue, mainEditorValue || "");
        model.value = newArray;
        setMainEditorValue(newArray)
        setClearInput(true)
        setChanged(!changed)
    }

    const elementPropsSubEditor: FormElementProps = {
        model: {
            ...model.memberType,
            optional: true,
            tooltip: "Add elements to Array",
            displayName: "Item",
            value: subEditorValue,
        },
        customProps: {
            validate: handleSubEditorValidation,
            clearInput,
            revertClearInput,
            subEditor: true,
            editPosition: customProps?.editPosition,
        },
        onChange: handleSubEditorChange
    };

    model.displayName = "Array Expression";

    return (
        <>
            <ExpressionEditorLabel {...props} model={{...model, displayName: model.name || model.displayName}} />
            <div className={classes.groupedForm}>
                <LowCodeExpressionEditor {...elementPropsSubEditor} />
                <div className="add-element-button">
                    <IconBtnWithText
                        disabled={addButtonDisabled}
                        text={"Add Item"}
                        onClick={handleAddButtonClick}
                        icon={<AddRounded fontSize="small" className={classes.iconButton} />}
                    />
                </div>
                <LowCodeExpressionEditor
                    model={{
                        ...model,
                        typeInfo: model?.memberType?.typeInfo
                    }}
                    customProps={{
                        ...customProps,
                        changed,
                        expandDefault: true
                    }}
                    onChange={handleMainEditorChange}
                />
            </div>
        </>
    )
}
