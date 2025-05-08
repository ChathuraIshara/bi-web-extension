/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { FormElementProps, FormField} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { getFormElement } from "../../../Portals/utils";
import { useStyles } from "../../DynamicConnectorForm/style";
import FormAccordion from "../../FormAccordion";
import { ExpressionInjectablesProps } from "../../FormGenerator";
import { FormFieldChecks } from "../../Types";
import { isAllEmpty, isAllFieldsValid } from "../../Utils";

interface RecordProps {
    validate?: (field: string, isInvalid: boolean, isEmpty: boolean, canIgnore?: boolean) => void;
    expressionInjectables?: ExpressionInjectablesProps;
    editPosition?: NodePosition;
}

export function Record(props: FormElementProps<RecordProps>) {
    const { model, customProps } = props;
    const { validate, expressionInjectables, editPosition } = customProps;
    const classes = useStyles();
    const allFieldChecks = React.useRef(new Map<string, FormFieldChecks>());

    const recordFields: React.ReactNode[] = [];
    const optionalRecordFields: React.ReactNode[] = [];

    const validateField = (field: string, isInvalid: boolean, isEmpty: boolean, canIgnore?: boolean) => {
        allFieldChecks.current.set(field, {
            name: field,
            isValid: !isInvalid,
            isEmpty,
            canIgnore,
        });
        validate(
            model.name,
            !isAllFieldsValid(allFieldChecks.current, model, false),
            isAllEmpty(allFieldChecks.current),
            (model.optional || model.defaultable)
        );
    };

    model.fields?.map((field: FormField, index: any) => {
        const elementProps: FormElementProps = {
            model: field,
            index,
            customProps: {
                validate: validateField,
                tooltipTitle: field?.documentation || field.tooltip,
                expressionInjectables,
                editPosition,
                initialDiagnostics: field.initialDiagnostics,
            }
        };

        const element = getFormElement(elementProps, field.typeName);
        if (element) {
            (field.defaultable || field.optional) ? optionalRecordFields.push(element) : recordFields.push(element);
        }
    });

    return (
        <div className={classes.marginTB}>
            <FormAccordion
                title={model.displayAnnotation?.label || model.name}
                depth={2}
                mandatoryFields={recordFields}
                optionalFields={optionalRecordFields}
                isMandatory={!(model.defaultable || model.optional)}
            />
        </div>
    );
}
