/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";

import { Grid } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { FormTextInput } from "../../../FormFieldComponents/TextField/FormTextInput";
import { VariableTypeInput, VariableTypeInputProps } from "../../Components/VariableTypeInput";
import { FunctionParam } from "../types";

import { useStyles } from './style';

interface FunctionParamSegmentEditorProps {
    id?: number;
    segment?: FunctionParam,
    onSave?: (segment: FunctionParam) => void;
    onUpdate?: (segment: FunctionParam) => void;
    onCancel?: () => void;
    validateParams?: (paramName: string) => { error: boolean, message: string };
    position?: NodePosition;
    isEdit?: boolean;
    paramCount?: number;
}

export function FunctionParamSegmentEditor(props: FunctionParamSegmentEditorProps) {
    const { segment, onSave, onUpdate, id, onCancel, validateParams, position, isEdit, paramCount } = props;
    const classes = useStyles();
    const initValue: FunctionParam = segment ? { ...segment } : {
        id: id ? id : 0,
        name: "",
        type: "",
    };

    const [segmentType, setSegmentType] = useState<string>(segment?.type || "");
    const [segmentName, setSegmentName] = useState<string>(segment?.name || "");
    const [pramError, setParamError] = useState<string>("");
    const [isValidParam, setIsValidParam] = useState(false);

    const validateNameValue = (value: string) => {
        if (value) {
            const varValidationResponse = validateParams(value);
            if (varValidationResponse?.error && (segment?.name !== value)) {
                setParamError(varValidationResponse.message);
                return false;
            }
        }
        setParamError("");
        return true;
    };

    const handleOnSave = () => {
        onSave({
            ...initValue,
            name: segmentName,
            type: segmentType,
        });
    };

    const handleOnUpdate = () => {
        onUpdate({
            ...initValue,
            name: segmentName,
            type: segmentType,
        });
    };

    const validateParamType = (fieldName: string, isInvalid: boolean) => {
        setIsValidParam(!isInvalid);
    };

    const returnTypeConfig: VariableTypeInputProps = {
        displayName: 'Param Type',
        hideLabel: true,
        value: segmentType,
        onValueChange: setSegmentType,
        validateExpression: validateParamType,
        position,
        overrideTemplate: isEdit ? {
            // add comma if params already exists during the edit flow
            defaultCodeSnippet: `( temp_param1 ${paramCount > 0 ? ',' : ''}`,
            targetColumn: 2
        } : {
            defaultCodeSnippet: 'function temp_function( temp_param1){}',
            targetColumn: 24
        }
    }

    return (
        <div className={classes.functionParamEditorWrap}>
            <div>
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={5}>
                        <div className={classes.labelOfInputs}>
                            Type
                        </div>
                    </Grid>
                    <Grid item={true} xs={7}>
                        <div className={classes.labelOfInputs}>
                            Name
                        </div>
                    </Grid>
                </Grid>
                <Grid container={true} item={true} spacing={2}>
                    <Grid item={true} xs={5}>
                        <VariableTypeInput {...returnTypeConfig} />
                    </Grid>
                    <Grid item={true} xs={7}>
                        <FormTextInput
                            dataTestId="api-function-param-name"
                            defaultValue={segmentName}
                            customProps={{validate: validateNameValue}}
                            onChange={setSegmentName}
                            errorMessage={pramError}
                        />
                    </Grid>

                </Grid>
                <Grid container={true} item={true} spacing={2}>
                    <Grid item={true} xs={12}>
                        <div className={classes.btnContainer}>
                            <SecondaryButton
                                text="Cancel"
                                fullWidth={false}
                                onClick={onCancel}
                            />
                            <PrimaryButton
                                dataTestId={"custom-expression-save-btn"}
                                text={onUpdate ? "Update" : " Add"}
                                disabled={!segmentName || !segmentType || pramError !== "" || !isValidParam}
                                fullWidth={false}
                                onClick={onUpdate ? handleOnUpdate : handleOnSave}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
