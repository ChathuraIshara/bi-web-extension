/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { FormField, FormImports, FormValues } from "@wso2-enterprise/ballerina-side-panel";
import { FormGeneratorNew } from "../Forms/FormGeneratorNew";
import { getImportsForProperty } from "../../../utils/bi";
import { LineRange } from "@wso2-enterprise/ballerina-core";

const Container = styled.div`
    max-width: 600px;
    height: 100%;
    > div:last-child {
        > div:last-child {
            justify-content: flex-start;
        }
    }
`;

const FormContainer = styled.div`
    > div:first-child {
        padding: 0;
    }
`;

interface ConfigProps {
    formFields: FormField[];
    targetLineRange: LineRange;
    disableSaveButton?: boolean;
    onSubmit: (data: FormField[], rawData: FormValues) => void;
    onBack?: () => void;
}

export function ConfigForm(props: ConfigProps) {
    const { formFields, targetLineRange, disableSaveButton, onSubmit, onBack } = props;
    console.log(">>> ConfigForm props", props);

    const handleSubmit = async (data: FormValues, formImports: FormImports) => {
        formFields.forEach((val) => {
            if (val.type === "DROPDOWN_CHOICE") {
                val.dynamicFormFields[data[val.key]].forEach((dynamicField) => {
                    if (data[dynamicField.key]) {
                        dynamicField.value = data[dynamicField.key];
                    }
                });
                val.value = data[val.key];
            } else if (data[val.key]) {
                val.value = data[val.key];
            }
            val.imports = getImportsForProperty(val.key, formImports);
        });
        onSubmit(formFields, data);
    };

    // type field hide
    const typeField = formFields.find((field) => field.key === "type");
    if (typeField) {
        typeField.enabled = false;
    }

    return (
        <Container>
            {formFields && formFields.length > 0 && (
                <FormContainer>
                    {targetLineRange && (
                        <FormGeneratorNew
                            fileName={targetLineRange.fileName}
                            targetLineRange={targetLineRange}
                            fields={formFields}
                            onBack={onBack}
                            onSubmit={handleSubmit}
                            compact={true}
                            disableSaveButton={disableSaveButton}
                            helperPaneSide="left"
                        />
                    )}
                </FormContainer>
            )}
        </Container>
    );
}

export default ConfigForm;
