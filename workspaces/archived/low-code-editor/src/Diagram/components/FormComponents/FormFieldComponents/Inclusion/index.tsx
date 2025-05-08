/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { getFormElement } from "../../../Portals/utils";
import { useStyles } from "../../DynamicConnectorForm/style";
import { ExpressionInjectablesProps } from "../../FormGenerator";
import { FormFieldChecks } from "../../Types";
import { isAllEmpty, isAllFieldsValid } from "../../Utils";

interface InclusionProps {
    validate?: (field: string, isInvalid: boolean, isEmpty: boolean, canIgnore?: boolean) => void;
    expressionInjectables?: ExpressionInjectablesProps;
    editPosition?: NodePosition;
}

export function Inclusion(props: FormElementProps<InclusionProps>) {
    const { model, customProps } = props;
    const { validate, expressionInjectables, editPosition } = customProps;
    const classes = useStyles();
    const allFieldChecks = React.useRef(new Map<string, FormFieldChecks>());
    const includedField = model.inclusionType;

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

    const elementProps: FormElementProps = {
        model: includedField,
        customProps: {
            validate: validateField,
            expressionInjectables,
            editPosition,
            initialDiagnostics: includedField.initialDiagnostics,
        }
    };

    return (
        <div className={classes.marginTB}>
            {getFormElement(elementProps, includedField.typeName)}
        </div>
    );
}
