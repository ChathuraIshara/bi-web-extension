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
import { PropertyModel } from "@wso2-enterprise/ballerina-core";
import { EditorFactory } from "./EditorFactory";
import Form from "../Form";

interface DropdownChoiceFormProps {
    field: FormField;
}

const FormContainer = styled.div`
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

export function DropdownChoiceForm(props: DropdownChoiceFormProps) {
    const { field } = props;
    const { form } = useFormContext();
    const { setValue, register } = form;

    const [selectedOption, setSelectedOption] = useState<string>("");

    const [dynamicFields, setDynamicFields] = useState<FormField[]>([]);


    // Add useEffect to set initial values
    useEffect(() => {
        if (field.dynamicFormFields[selectedOption]) {
            const fields = field.dynamicFormFields[selectedOption];
            setDynamicFields(fields);
        } else {
            setDynamicFields([]);
        }
        setValue(field.key, selectedOption);
    }, [selectedOption]);

    return (
        <FormContainer>
            <ChoiceSection>
                <Dropdown
                    id={field.key}
                    {...register(field.key, { required: !field.optional, value: getValueForDropdown(field) })}
                    label={capitalize(field.label)}
                    description={field.documentation}
                    items={field.itemOptions ? field.itemOptions : field.items?.map((item) => ({ id: item, content: item, value: item }))}
                    required={!field.optional}
                    disabled={!field.editable}
                    sx={{ width: "100%" }}
                    containerSx={{ width: "100%" }}
                    onChange={(e) => {
                        setSelectedOption(e.target.value);
                        setValue(field.key, e.target.value);
                    }}
                />
            </ChoiceSection>
            <FormSection>
                {dynamicFields.map((dfield) => {
                    if (!dfield.advanced && !dfield.optional) {
                        return (
                            <EditorFactory
                                key={dfield.key}
                                field={dfield}
                            />
                        );
                    }
                })}
            </FormSection>
        </FormContainer>
    );
}


