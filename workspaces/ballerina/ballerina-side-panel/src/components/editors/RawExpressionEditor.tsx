/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { forwardRef } from "react";
import { FormExpressionEditorRef } from "@wso2-enterprise/ui-toolkit";
import { useFormContext } from "../../context";
import { ContextAwareExpressionEditorProps, ExpressionEditor } from "./ExpressionEditor";

export const ContextAwareRawExpressionEditor = forwardRef<FormExpressionEditorRef, ContextAwareExpressionEditorProps>(
    (props, ref) => {
        const { form, expressionEditor, targetLineRange, fileName } = useFormContext();

        return (
            <ExpressionEditor
                ref={ref}
                fileName={fileName}
                {...targetLineRange}
                {...props}
                {...form}
                {...expressionEditor}
                rawExpression={getRawExp}
                sanitizedExpression={getSanitizedExp}
            />
        );
    }
);

const getSanitizedExp = (value: string) => {
    if (value) {
        return value.replace(/`/g, "");
    }
    return value;
};

const getRawExp = (value: string) => {
    if (value && !value.startsWith("`") && !value.endsWith("`")) {
        return `\`${value}\``;
    }
    return value;
};
