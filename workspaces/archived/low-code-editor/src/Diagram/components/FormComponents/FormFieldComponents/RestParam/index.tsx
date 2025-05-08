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
import { FormattedMessage, useIntl } from "react-intl";

import { FormHelperText } from "@material-ui/core";
import { AddRounded } from "@material-ui/icons";
import CloseRounded from "@material-ui/icons/CloseRounded";
import { ExpressionEditorLabel, ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import {
    FormElementProps
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    ButtonWithIcon,
    IconBtnWithText
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { useStyles } from "../../DynamicConnectorForm/style"
import { LowCodeExpressionEditor } from "../LowCodeExpressionEditor";

export function RestParam(props: FormElementProps<ExpressionEditorProps>) {
    const { model } = props;
    const classes = useStyles();

    const [changed, setChanged] = useState(true);
    const [clearInput, setClearInput] = useState(false);
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const [subEditorValue, setSubEditorValue] = useState("");

    let initialValue: string[];
    if (model?.value?.includes(",")) {
        initialValue = model.value.split(",");
    } else if (!model.value) {
        initialValue = [];
    } else {
        initialValue = [model.value];
    }
    const [values] = useState<string[]>(initialValue);

    const intl = useIntl();
    const addItemText = intl.formatMessage({
        id: "lowcode.develop.elements.restParam.addItemText",
        defaultMessage: "Add Item"
    });

    const handleSubEditorValidation = (_field: string, isInvalid: boolean) => {
        if (subEditorValue === "") {
            setAddButtonDisabled(true)
        } else {
            setAddButtonDisabled(isInvalid)
        }
    };

    const handleSubEditorChange = (value: string) => {
        setSubEditorValue(value);
    };

    const revertClearInput = () => {
        setClearInput(false);
    };

    const handleAddButtonClick = () => {
        values.push(subEditorValue);
        model.value = values.join(",");
        setClearInput(true);
        setChanged(!changed);
    };

    const elementPropsSubEditor: FormElementProps = {
        model: {
            name: "sub_editor_" + model.name,
            displayName: intl.formatMessage({ id: 'lowcode.develop.elements.restParam.itemText', defaultMessage: "Item" }),
            type: model.typeName,
            value: subEditorValue,
            tooltip: intl.formatMessage({ id: 'lowcode.develop.elements.restParam.tooltip', defaultMessage: "Add elements to field" }),
            optional: true
        },
        customProps: {
            validate: handleSubEditorValidation,
            clearInput,
            revertClearInput,
            subEditor: true
        },
        onChange: handleSubEditorChange
    };

    const deleteItem = (index: number) => {
        values.splice(index, 1);
        model.value = values.join(",");
        setChanged(!changed);
    };
    const generateComponents = (addedValues: string[]) : React.ReactNode[] => {
        const components: React.ReactNode[] = [];
        addedValues.map((element, index) => {
            const getDelete = () => {
                return () => deleteItem(index);
            };
            components.push(
                <>
                    <div className={classes.elementValueWrapper}>
                        <FormHelperText className={classes.textlabel}>{element}</FormHelperText>
                        <ButtonWithIcon
                            className={classes.deleteBtn}
                            onClick={getDelete()}
                            icon={<CloseRounded fontSize="small"/>}
                        />
                    </div>
                    <span className={classes.componentGap}/>
                </>
            );
        });
        return components;
    };

    return (
        <div>
            <ExpressionEditorLabel {...props} model={{...model}} />
            <div className={classes.groupedForm}>
                <LowCodeExpressionEditor {...elementPropsSubEditor} />
                <div className={classes.addElementButton}>
                    <IconBtnWithText
                        disabled={addButtonDisabled}
                        text={addItemText}
                        onClick={handleAddButtonClick}
                        icon={<AddRounded fontSize="small" className={classes.iconButton} />}
                    />
                </div>
                <div>
                    <div>
                        {values?.length > 0 ? (
                                <div>
                                    <div className={classes.divider} />
                                    <FormHelperText className={classes.inputLabelWrapper}>
                                        <FormattedMessage id="lowcode.develop.elements.restParam.addedElements" defaultMessage="Added items"/>
                                    </FormHelperText>
                                </div>
                            )
                            : null
                        }
                    </div>
                    <div className={classes.valueWrapper}>
                        {generateComponents(values)}
                    </div>
                </div>
            </div>
        </div>
    )
}
