import React from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText } from "@material-ui/core";

import { TooltipIcon } from "../Tooltip";

import { useStyles as useTextInputStyles } from "./style";

export interface FieldEditorProps {
    optional: boolean;
    title: string;
    tooltipTitle?: string;
}

export function FieldTitle(props: FieldEditorProps) {
    const { optional, title, tooltipTitle } = props;

    const textFieldClasses = useTextInputStyles();

    const optionalUI = (
        <div className={textFieldClasses.inputWrapper}>
            <div className={textFieldClasses.inputWrapper}>
                <div className={textFieldClasses.labelWrapper}>
                    <FormHelperText className={textFieldClasses.inputLabelForRequired}>
                        {title}
                    </FormHelperText>
                    <FormHelperText className={textFieldClasses.optionalLabel}>
                        <FormattedMessage
                            id="lowcode.develop.elements.textField.formTextInput.optional.label"
                            defaultMessage="Optional"
                        />
                    </FormHelperText>
                </div>

            </div>
            {tooltipTitle && (<TooltipIcon title={tooltipTitle} arrow={true} />)}
        </div>
    );

    const requiredUI = (
        <div className={textFieldClasses.inputWrapper}>
            <div className={textFieldClasses.labelWrapper}>
                <FormHelperText className={textFieldClasses.inputLabelForRequired}>
                    {title}
                </FormHelperText>
                <FormHelperText className={textFieldClasses.starLabelForRequired}>*</FormHelperText>
            </div>
            {tooltipTitle && (<TooltipIcon title={tooltipTitle} arrow={true} />)}
        </div>
    );

    return (
        <>
            {(title !== "") ? (optional ? optionalUI : requiredUI) : null}
        </>
    );
}
