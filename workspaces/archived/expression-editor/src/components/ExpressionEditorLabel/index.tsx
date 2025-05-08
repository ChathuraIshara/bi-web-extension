/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-empty jsx-curly-spacing
import React from "react";

import { FormHelperText } from "@material-ui/core";
import { FormElementProps, useStyles as useTextInputStyles } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { TooltipCodeSnippet, TooltipIcon } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import * as MonacoEditor from 'monaco-editor';

import { useStyles as useFormStyles } from "../../themes";
import { ExpressionEditorProps } from "../ExpressionEditor";
import { transformFormFieldTypeToString } from "../ExpressionEditor/utils";

import { getExampleForType, truncateText, variableNameMaxLength } from "./utils";

export function ExpressionEditorLabel(props: FormElementProps<ExpressionEditorProps>) {
    const { model, customProps, hideLabelTooltips } = props;

    const formClasses = useFormStyles();
    const textFieldClasses = useTextInputStyles();

    const textLabel = model.label || model.displayName || model.name;
    const formFieldTypeString: string = transformFormFieldTypeToString(model, true);
    const typeString: string = formFieldTypeString ? (formFieldTypeString + (model.optional ? "?" : "")) : formFieldTypeString;

    const codeRef = (ref: HTMLPreElement) => {
        if (ref) {
            MonacoEditor.editor.colorizeElement(ref, { theme: 'choreoLightTheme' });
        }
    }
    const EditorType = () => (
        <code
            ref={codeRef}
            data-lang="ballerina"
            className={textFieldClasses.code}
        >
            {truncateText(typeString)}
        </code>
    );

    return (
        <>
            {!hideLabelTooltips && !customProps?.hideTextLabel && textLabel && model && (
                <div className={textFieldClasses.inputWrapper}>
                    <div className={textFieldClasses.labelWrapper}>
                        <FormHelperText className={formClasses.inputLabelForRequired}>{textLabel}</FormHelperText>
                        {!(model.defaultable || model.optional) && (
                            <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                        )}
                    </div>
                    {(customProps?.tooltipTitle || model?.tooltip) && (
                        <TooltipIcon
                            title={customProps?.tooltipTitle || model?.tooltip}
                            interactive={customProps?.interactive || true}
                            actionText={customProps?.tooltipActionText || model?.tooltipActionText}
                            actionLink={customProps?.tooltipActionLink || model?.tooltipActionLink}
                            arrow={true}
                            typeExamples={getExampleForType(model)}
                        />
                    )}
                </div>
            )}
            {typeString && !customProps.hideTypeLabel && (
                <TooltipCodeSnippet
                    disabled={typeString?.length <= variableNameMaxLength}
                    content={typeString}
                    placement="right"
                    arrow={true}
                >
                    <div className={textFieldClasses.codeWrapper}>
                        <EditorType />
                    </div>
                </TooltipCodeSnippet>
            )}
        </>
    );
}
