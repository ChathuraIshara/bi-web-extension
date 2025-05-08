/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode } from "react";

import { FormElementProps, FormField } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { getFormElement } from "../../Portals/utils";
import FormAccordion from "../FormAccordion";
import { ExpressionInjectablesProps } from "../FormGenerator";
import { FormFieldChecks } from "../Types";
import { isAllDefaultableFields, isAllFieldsValid } from "../Utils";

import { useStyles } from "./styles";
export interface FormProps {
    fields: FormField[];
    onValidate?: (isRequiredFieldsFilled: boolean) => void;
    size?: "small" | "medium",
    expressionInjectables?: ExpressionInjectablesProps;
    editPosition?: NodePosition;
    expandOptionals?: boolean;
}

export function Form(props: FormProps) {
    const { fields, onValidate, expressionInjectables, editPosition, expandOptionals} = props;

    const classes = useStyles();
    const requiredElements: ReactNode[] = [];
    const optionalElements: ReactNode[] = [];
    const allFieldChecks = React.useRef(new Map<string, FormFieldChecks>());

    React.useEffect(() => {
        // Set form as valid if there aren't any mandatory fields
        if (fields && isAllDefaultableFields(fields)){
            onValidate(true);
        }
        if (fields.length === 0){
            // No fields to validate
            onValidate(true);
        }
    }, []);

    const validateField = (field: string, isInvalid: boolean, isEmpty: boolean, canIgnore?: boolean) => {
        allFieldChecks.current.set(field, {
            name: field,
            isValid: !isInvalid,
            isEmpty,
            canIgnore,
        });
        onValidate(isAllFieldsValid(allFieldChecks.current, fields, true));
    };

    fields?.map((field, index) => {
        const elementProps: FormElementProps = {
            model: field,
            index,
            customProps: {
                validate: validateField,
                tooltipTitle: field?.documentation || field.tooltip,
                expressionInjectables,
                editPosition,
                initialDiagnostics: field.initialDiagnostics,
            },
        };

        if (field.typeName === "inclusion"){
            field.defaultable = isAllDefaultableFields(field.inclusionType?.fields);
        }

        const element = getFormElement(elementProps, field.typeName);
        if (element) {
            field.defaultable || field.optional ? optionalElements.push(element) : requiredElements.push(element);
        }
    });

    return (
        <form className={classes.fullWidth} noValidate={true} autoComplete="off">
            <FormAccordion
                depth={1}
                mandatoryFields={requiredElements}
                optionalFields={optionalElements}
                isMandatory={false}
                expandOptionals={expandOptionals}
            />
        </form>
    );
}
