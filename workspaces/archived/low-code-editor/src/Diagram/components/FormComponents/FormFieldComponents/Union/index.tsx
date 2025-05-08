/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText } from "@material-ui/core";
import { FormElementProps, FormField} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { Form } from "../../DynamicConnectorForm";
import { useStyles } from "../../DynamicConnectorForm/style";
import { ExpressionInjectablesProps } from "../../FormGenerator";
import { SelectDropdownWithButton } from "../DropDown/SelectDropdownWithButton";

interface UnionProps {
    validate: (field: string, isInvalid: boolean) => void;
    expressionInjectables?: ExpressionInjectablesProps;
    editPosition?: NodePosition;
}

export function Union(props: FormElementProps<UnionProps>) {
    const { model, customProps } = props;
    const {validate, expressionInjectables, editPosition} = customProps;
    const classes = useStyles();
    const textLabel = model && model.displayName ? model.displayName : model.name;

    const [selectedType, setSelectedType] = useState(model.selectedDataType);

    useEffect(() => {
        if (!selectedType) {
            const types = getTypes();
            if (types && types.length > 0) {
                setSelectedType(types[0]);
            }
        }
    }, [selectedType]);

    const getTypes = () => {
        const types: string[] = [];
        model.members?.forEach((field: FormField, key: number) => {
            const name = getUnionFormFieldName(field);
            if (name) {
                types.push(name);
            }
        });

        return types;
    };

    const getSelectedFormField = () => {
        const selectedField: FormField = model.members?.find((field: FormField) => {
            const name = getUnionFormFieldName(field);
            return name === selectedType;
        });

        return selectedField;
    };

    const getElement = () => {
        let element: React.ReactNode = null;
        const selectedField = getSelectedFormField();
        model.selectedDataType = selectedType;
        if (selectedField && selectedField.typeName && selectedField.fields) {
            element = (
                <div className={classes.removeInnerMargin}>
                    <Form
                        fields={selectedField.fields}
                        onValidate={validateForm}
                        key={selectedType}
                        expressionInjectables={expressionInjectables}
                        editPosition={editPosition}
                    />
                </div>
            );
        } else if (selectedField && selectedField.typeName) {
            element = (
                <div className={classes.removeInnerMargin}>
                    <Form
                        fields={[selectedField]}
                        onValidate={validateForm}
                        key={selectedType}
                        expressionInjectables={expressionInjectables}
                        editPosition={editPosition}
                    />
                </div>
            );
        }

        return element;
    };

    const validateForm = (isValid: boolean) => {
        validate(model.name, !isValid);
    };

    const handleTypeChange = (value: string) => {
        model.selectedDataType = value;
        setSelectedType(value);
        if (value === "nil") {
            validate(model.name, false);
        }
    };

    const selector = model && model.members && model.members.length > 1 && (
        <SelectDropdownWithButton
            onChange={handleTypeChange}
            customProps={ {
                values: getTypes(),
                disableCreateNew: true,
                className: "unionDropdown"
            } }
            defaultValue={selectedType ? selectedType : ""}
            placeholder="Select Type"
        />
    );

    return (
        <div className={classes.groupedFormUnion}>
            {model && model.optional ?
                (
                    <div className={classes.labelWrapper}>
                        <FormHelperText className={classes.inputLabelForRequired}>{textLabel}</FormHelperText>
                        <FormHelperText className={classes.optionalLabel}><FormattedMessage id="lowcode.develop.elements.union.optional.label" defaultMessage="Optional" /></FormHelperText>
                    </div>
                ) : (
                    <div className={classes.labelWrapper}>
                        <FormHelperText className={classes.inputLabelForRequired}>{textLabel}</FormHelperText>
                        <FormHelperText className={classes.starLabelForRequired}>*</FormHelperText>
                    </div>
                )
            }
            {selector}
            {getElement()}
        </div>
    );
}

// get field name of the union record
export function getUnionFormFieldName(field: FormField): string {
    let name = field.name;
    if (!name) {
        name = field.typeInfo?.name;
    }
    if (!name) {
        name = field.typeName;
    }
    return name;
}
