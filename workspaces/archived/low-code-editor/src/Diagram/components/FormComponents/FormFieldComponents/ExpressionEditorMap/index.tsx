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
    getInitialValue,
    transformFormFieldTypeToString
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
import { appendToMap } from "./utils";

export function ExpressionEditorMap(props: FormElementProps<ExpressionEditorProps>) {
    const { customProps, model, defaultValue } = props;
    const classes = useStyles();

    model.label = "Map Expression"
    const [changed, setChanged] = useState(true);
    const [mainEditorValue, setMainEditorValue] = useState(getInitialValue(defaultValue, model));
    const [clearInput, setClearInput] = useState(false);

    const handleMainEditorChange = (value: string) => {
        setMainEditorValue(value)
    }

    const handleAddButtonClick = () => {
        const updatedMap = appendToMap(keyEditorContent, valueEditorContent, mainEditorValue || "");
        model.value = updatedMap;
        setMainEditorValue(updatedMap)
        setClearInput(true)
        setChanged(!changed)
    }

    const revertClearInput = () => {
        setClearInput(false);
    }


    // States and functions for key-exp-editor
    const [keyEditorValid, setKeyEditorValid] = useState(false);
    const [keyEditorContent, setKeyEditorContent] = useState("");
    const keyEditorType: string = "string";

    const handleKeyEditorValidation = (_field: string, isInvalid: boolean) => {
        if (keyEditorContent === "") {
            setKeyEditorValid(true)
        } else {
            setKeyEditorValid(isInvalid)
        }
    }

    const handleKeyEditorChange = (value: string) => {
        setKeyEditorContent(value)
    }

    const elementPropsKeyEditor: FormElementProps = {
        model: {
            name: "key_editor_" + model.name,
            label: `${model.name} Key`,
            typeName: keyEditorType,
            value: keyEditorContent,
            tooltip: "Key of the Key-Value pair",
            optional: true,
            customAutoComplete: model?.customAutoComplete
        },
        customProps: {
            validate: handleKeyEditorValidation,
            clearInput,
            revertClearInput,
            subEditor: true
        },
        onChange: handleKeyEditorChange
    };


    // States and functions for value-exp-editor
    const [valueEditorValid, setValueEditorValid] = useState(false);
    const [valueEditorContent, setValueEditorContent] = useState("");
    // We can safely get 0'th element since currently map constraint type
    // supports single(union/record etc..) field only.
    const fields = (model?.paramType && model?.paramType?.typeName) ?  model?.paramType?.typeName : model?.fields?.[0];
    const valueEditorType: string = transformFormFieldTypeToString(fields);

    const handleValueEditorValidation = (_field: string, isInvalid: boolean) => {
        if (valueEditorContent === "") {
            setValueEditorValid(true)
        } else {
            setValueEditorValid(isInvalid)
        }
    }

    const handleValueEditorChange = (value: string) => {
        setValueEditorContent(value)
    }

    const elementPropsValueEditor: FormElementProps = {
        model: {
            name: "value_editor_" + model.name,
            label: `${model.name} Value`,
            typeName: valueEditorType,
            value: valueEditorContent,
            tooltip: "Value of the Key-Value pair",
            optional: true,
            customAutoComplete: model?.customAutoComplete
        },
        customProps: {
            validate: handleValueEditorValidation,
            clearInput,
            revertClearInput,
            subEditor: true
        },
        onChange: handleValueEditorChange
    };

    return (
        <>
            <ExpressionEditorLabel {...props} model={{...model, label: model.name}} />
            <div className={classes.groupedForm}>
                <LowCodeExpressionEditor {...elementPropsKeyEditor} />
                <LowCodeExpressionEditor {...elementPropsValueEditor} />
                <div className="add-element-button">
                    <IconBtnWithText
                        disabled={keyEditorValid || valueEditorValid}
                        text={"Add Key-Value Pair"}
                        onClick={handleAddButtonClick}
                        icon={<AddRounded fontSize="small" className={classes.iconButton} />}
                    />
                </div>
                <LowCodeExpressionEditor
                    model={model}
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
