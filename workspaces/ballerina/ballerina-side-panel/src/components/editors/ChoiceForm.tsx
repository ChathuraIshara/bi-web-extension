/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";

import { Dropdown, LocationSelector, RadioButtonGroup } from "@wso2-enterprise/ui-toolkit";

import { FormField } from "../Form/types";
import { capitalize, getValueForDropdown } from "./utils";
import { useFormContext } from "../../context";
import styled from "@emotion/styled";
import { PropertyModel, RecordTypeField } from "@wso2-enterprise/ballerina-core";
import { EditorFactory } from "./EditorFactory";

interface ChoiceFormProps {
    field: FormField;
    recordTypeFields?: RecordTypeField[];
}

const Form = styled.div`
    display: grid;
    gap: 20px;
    width: 100%;
`;

const ChoiceSection = styled.div`
    display: grid;
    gap: 20px;
    width: 100%;
`;

const FormSection = styled.div`
    display: grid;
    gap: 20px;
    width: 100%;
`;

export function ChoiceForm(props: ChoiceFormProps) {
    const { field, recordTypeFields } = props;
    const { form } = useFormContext();
    const { setValue } = form;

    const [selectedOption, setSelectedOption] = useState<number>(1);

    const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);


    // Add useEffect to set initial values
    useEffect(() => {
        const realValue = selectedOption - 1;
        const property = field.choices[realValue];
        const choiceProperty = convertConfig(property);
        setDynamicFields(choiceProperty);
        if (choiceProperty.length > 0) {
            Object.entries(property.properties).forEach(([propKey, propValue]) => {
                if (propValue.value !== undefined) {
                    setValue(propKey, propValue.value);
                }
            });
        }
    }, [selectedOption]);

    const convertConfig = (model: PropertyModel): FormField[] => {
        const formFields: FormField[] = [];
        for (const key in model.properties) {
            const expression = model.properties[key];
            const formField: FormField = {
                key: key,
                label: expression?.metadata.label || key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase()),
                type: expression.valueType,
                documentation: expression?.metadata.description || "",
                valueType: expression.valueTypeConstraint,
                editable: expression.editable,
                enabled: expression?.enabled ?? true,
                optional: expression.optional,
                value: expression.value,
                valueTypeConstraint: expression.valueTypeConstraint,
                advanced: expression.advanced,
                diagnostics: [],
                items: expression.valueType === "SINGLE_SELECT" ? [""].concat(expression.items) : expression.items,
                choices: expression.choices,
                placeholder: expression.placeholder,
                defaultValue: expression.defaultValue as string
            }
            formFields.push(formField);
        }
        console.log("Dynamic Form Fields:", formFields)
        return formFields;
    }

    return (
        <Form>
            <ChoiceSection>
                <RadioButtonGroup
                    id="choice-options"
                    label={field.documentation}
                    defaultValue={1}
                    defaultChecked={true}
                    value={selectedOption}
                    options={field.choices.map((choice, index) => ({ id: index.toString(), value: index + 1, content: choice.metadata.label }))}
                    onChange={(e) => {
                        console.log("Choice Form Index:", Number(e.target.value))
                        const checkedValue = Number(e.target.value);
                        const realValue = checkedValue - 1;
                        setSelectedOption(checkedValue);
                        setValue(field.key, realValue);
                    }}
                />
            </ChoiceSection>

            <FormSection>
                {dynamicFields.map((dfield) => {
                    return (
                        <EditorFactory
                            key={dfield.key}
                            field={dfield}
                            recordTypeFields={recordTypeFields}
                        />
                    );
                })}
            </FormSection>

        </Form>

    );
}


