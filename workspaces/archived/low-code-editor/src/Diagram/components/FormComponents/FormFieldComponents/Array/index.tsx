/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormHelperText } from "@material-ui/core";
import AddRounded from "@material-ui/icons/AddRounded";
import CloseRounded from "@material-ui/icons/CloseRounded";
import { FormElementProps, FormField, getType } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ButtonWithIcon, IconBtnWithText } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import classNames from "classnames";

import { getFormElement, getParams } from "../../../Portals/utils";
import "../../DynamicConnectorForm/ConnectorInitForm/Wizard/style.scss"
import { useStyles } from "../../DynamicConnectorForm/style";

export interface ArrayProps {
    validate?: (field: string, isInvalid: boolean) => void;
}

export function Array(props: FormElementProps<ArrayProps>) {
    const { model, customProps, onChange } = props;
    const classes = useStyles();
    const intl = useIntl();

    let arrayValues: React.ReactNode[];
    if (!model.fields) {
        model.fields = [];
    }

    const [arrayField, setArrayField] = useState(undefined);
    const [arrayLength, setArrayLength] = useState(model.fields.length);
    const [validForm, setValidForm] = useState(false);
    const [arrayValue, setArrayValue] = useState(undefined);

    if (arrayLength <= 0 && !model.optional && customProps?.validate) {
        customProps?.validate(model.name, arrayLength <= 0);
    }

    const fieldModel: FormField = {
        name: model.name,
        typeName: getType(model.memberType?.type),
        displayName: model.displayName
    };

    if (arrayValue) {
        fieldModel.value = arrayValue;
    }

    const validateField = (field: string, isInvalid: boolean) => {
        setValidForm(!isInvalid);
    };

    const onJsonChange = (json: string) => {
        setArrayValue(json);
    };

    const onCollectionChange = (collection: string) => {
        setArrayValue(collection);
    };

    const addValueIconText = intl.formatMessage({
        id: "lowcode.develop.elements.array.addValue.iconText",
        defaultMessage: "Add Value"
    });

    const deleteItem = (index: number) => {
        if (model.fields && model.fields.length > 0) {
            model.fields.splice(index, 1);
            if (model.memberType.type === "json" || model.memberType.type === "xml") {
                onChange("[" + getParams(model.fields).toString() + "]");
            } else {
                if (onChange) {
                    onChange("[" + getParams(model.fields) + "]");
                }
            }
            setArrayLength(arrayLength - 1);
        }
    };

    const generateComponents = (addedValues: FormField[]) => {
        const components: React.ReactNode[] = [];
        addedValues.map((element, index) => {
            if (model.memberType?.type) {
                if (model.memberType.type === "record") {
                    // TODO: Handle record
                } else if (model.memberType.type === "array") {
                    // TODO: Handle collection
                } else if (model.memberType.type === "json") {
                    const getDelete = () => {
                        return () => deleteItem(index);
                    };
                    components.push(
                        <div key={index} className={classes.elementValueWrapper}>
                            <FormHelperText>{element.value}</FormHelperText>
                            <ButtonWithIcon
                                className={classes.deleteBtn}
                                onClick={getDelete()}
                                icon={<CloseRounded fontSize="small" />}
                            />
                        </div>
                    );
                } else if (model.memberType.type === "xml") {
                    const getDelete = () => {
                        return () => deleteItem(index);
                    };
                    components.push(
                        <div className={classes.elementValueWrapper}>
                            <FormHelperText>{element.value}</FormHelperText>
                            <ButtonWithIcon
                                className={classes.deleteBtn}
                                onClick={getDelete()}
                                icon={<CloseRounded fontSize="small" />}
                            />
                        </div>
                    );
                } else if (element) {
                    const getDelete = () => {
                        return () => deleteItem(index);
                    };
                    components.push(
                        <div className={classes.elementValueWrapper}>
                            <FormHelperText className={classes.textlabel}>{element.value}</FormHelperText>
                            <ButtonWithIcon
                                className={classes.deleteBtn}
                                onClick={getDelete()}
                                icon={<CloseRounded fontSize="small" />}
                            />
                        </div>
                    );
                }
            }
        });
        return components;
    };

    const addValue = () => {
        fieldModel.typeName = getType(model.memberType?.type);
        fieldModel.memberType  = model.memberType;
        if (model.memberType.type) {
            if (model.memberType.type === "record") {
                // TODO: Handle record
            } else if (model.memberType.type === "array") {
                // TODO: Handle collection
            } else if (model.memberType.type === "xml") {
                if (validForm && (arrayValue !== undefined) && (arrayValue !== '')) {
                    fieldModel.value = arrayValue;
                    model.fields.push(fieldModel);
                    setArrayLength(model.fields.length);
                    if (!model.optional && customProps?.validate) {
                        customProps?.validate(model.name, model.fields.length <= 0);
                    }
                    onChange("[" + getParams(model.fields) + "]");
                    model.value = undefined;
                    setArrayValue(undefined);
                }
            } else if (model.memberType.type === "json") {
                if (validForm && (arrayValue !== undefined) && (arrayValue !== '')) {
                    fieldModel.value = arrayValue;
                    model.fields.push(fieldModel);
                    setArrayLength(model.fields.length);
                    if (!model.optional && customProps?.validate) {
                        customProps?.validate(model.name, model.fields.length <= 0);
                    }
                    onChange("[" + getParams(model.fields) + "]");
                    setArrayValue(undefined);
                    model.value = undefined;
                }
            } else {
                if ((arrayValue && (arrayValue !== '') && validForm) ||
                    // 2nd condition is to cater boolean values coming at the initial instance where array value state
                    // is empty
                    (model.memberType.type === "boolean") && (arrayValue === undefined)) {
                    if (model.typeName === "array") {
                        model.fields.push(fieldModel);
                        if (onChange) {
                            // Arrays coming from property-form
                            onChange("[" + getParams(model.fields) + "]");
                        }
                    } else {
                        model.fields.push(fieldModel);
                        onChange("[" + getParams(model.fields) + "]");
                    }
                    setArrayLength(model.fields.length);
                    if (!model.optional && customProps?.validate) {
                        customProps?.validate(model.name, model.fields.length <= 0);
                    }
                    if (model.memberType.type !== "boolean") {
                        setArrayValue(undefined);
                        model.value = undefined;
                    }
                }
            }
        }
    };

    arrayValues = generateComponents(model.fields);

    React.useEffect(() => {
        if (model) {
            if (model.memberType?.type) {
                const elementProps: FormElementProps = {
                    model: fieldModel,
                };
                elementProps.customProps = {
                    validate: validateField,
                    statementType: fieldModel.typeName
                };
                if (model.memberType.type === "json" || model.memberType.type === "xml") {
                    elementProps.onChange = onJsonChange;
                    elementProps.defaultValue = arrayValue;
                } else if (model.memberType.typeName === "boolean") {
                    elementProps.onChange = onCollectionChange;
                    elementProps.defaultValue = arrayValue;
                } else if (model.typeName === "array") {
                    elementProps.onChange = onCollectionChange;
                }
                setArrayField(getFormElement(elementProps, model.memberType.type));
            }
        }
        setArrayValue(undefined);
    }, [model]);

    return (
        <div data-testid="array" className={classNames(classes.groupedForm, classes.marginTB)}>
            {/* code to be refactored keeping the connented code for refernce
            {
                (fieldModel.type === "json" || fieldModel.type === "xml" || fieldModel.type === "boolean") ? (
                    <div data-testid="ison-add-btn" className="json-add-container">
                        <div className="json-array-wrapper">
                            {arrayField}
                        </div>
                        <div className="add-json-btn">
                            <IconBtnWithText
                                onClick={addValue}
                                text="Add Value"
                                icon={<AddRounded fontSize="small" className={classes.iconButton} />}
                            />
                        </div>
                    </div>
                ) :
                    (
                        <div className="add-container">
                            <div className="label-inside-wapper"></div>
                            <div className="array-wrapper">
                                {arrayField}
                            </div>
                            <div data-testid="add-btn" className="add-btn">
                                <ButtonWithIcon
                                    className="add-button"
                                    onClick={addValue}
                                    icon={<AddRounded fontSize="small" />}
                                />
                            </div>
                        </div>
                    )
            }
            */}
            <div data-testid="ison-add-btn" className={classes.addContainer}>
                <div className={classes.arrayWrapperContent}>
                    {arrayField}
                </div>
                <div className={classes.addWrapperBtn} data-testid="add-btn">
                    <IconBtnWithText
                        onClick={addValue}
                        text={addValueIconText}
                        icon={<AddRounded fontSize="small" className={classes.iconButton} />}
                    />
                </div>
            </div>
            <div>
                <>
                    {arrayValues.length > 0 ? (
                        <div>
                            <div className={classes.divider} />
                            <FormHelperText className={classes.inputLabelWrapper}><FormattedMessage id="lowcode.develop.elements.array.addedElements" defaultMessage="Added Elements"/> </FormHelperText>
                        </div>
                    )
                        : null
                    }
                </>
                <div className={classes.valueWrapper}>
                    {arrayValues}
                </div>
            </div>
        </div>
    );
}
