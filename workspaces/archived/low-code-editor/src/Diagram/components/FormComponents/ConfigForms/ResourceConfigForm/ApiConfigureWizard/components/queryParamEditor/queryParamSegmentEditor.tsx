/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext, useState } from "react";

import { Grid } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../../../Contexts/Diagram";
import { checkVariableName } from "../../../../../../Portals/utils";
import { SelectDropdownWithButton } from "../../../../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { FormTextInput } from "../../../../../FormFieldComponents/TextField/FormTextInput";
import { VariableTypeInput, VariableTypeInputProps } from "../../../../Components/VariableTypeInput";
import { QueryParam } from "../../types";
import { queryParamTypes } from "../../util";

import { useStyles } from './style';

interface QueryParamSegmentEditorProps {
    id?: number;
    queryParam?: QueryParam,
    onSave?: (segment: QueryParam) => void;
    onUpdate?: (segment: QueryParam) => void;
    onCancel?: () => void;
    types?: string[];
    validateParams?: (paramName: string) => { error: boolean, message: string };
    targetPosition?: NodePosition;
}

export function QueryParamSegmentEditor(props: QueryParamSegmentEditorProps) {
    const { queryParam, onSave, id, onCancel, onUpdate, types, validateParams, targetPosition } = props;
    const classes = useStyles();
    const { props: { stSymbolInfo } } = useContext(Context);
    let queryParamValue = queryParam;
    if (queryParamValue) {
        queryParamValue = {
            ...queryParamValue,
        }
    }
    const initValue: QueryParam = queryParamValue ? { ...queryParamValue } : {
        id: id ? id : 0,
        name: "",
        type: "string",
    };

    const [segmentState, setSegmentState] = useState<QueryParam>(initValue);
    const [pramError, setParamError] = useState<string>("");
    const [validSelectedType, setValidSelectedType] = useState(false);

    const onChangeSegmentName = (text: string) => {
        setSegmentState({
            ...segmentState,
            name: text
        });
    };

    const onChangeSegmentType = (text: string) => {
        setSegmentState({
            ...segmentState,
            type: text
        });
    };

    const validateNameValue = (value: string) => {
        if (value) {
            const varValidationResponse = validateParams
                ? validateParams(value)
                : checkVariableName("query param name", value, "", stSymbolInfo);
            if (varValidationResponse?.error) {
                setParamError(varValidationResponse.message);
                return false;
            }
        }
        setParamError("");
        return true;
    };

    const handleOnSave = () => {
        onSave(segmentState);
    };

    const handleOnUpdate = () => {
        onUpdate(segmentState);
    };

    const validateVarType = (fieldName: string, isInvalid: boolean) => {
        setValidSelectedType(!isInvalid);
    };

    const variableTypeConfig: VariableTypeInputProps = {
        displayName: 'Type',
        value: segmentState?.type,
        onValueChange: onChangeSegmentType,
        validateExpression: validateVarType,
        position: targetPosition
    }

    const variableTypeInput = (
        <div className="exp-wrapper">
            <VariableTypeInput {...variableTypeConfig} />
        </div>
    );

    return (
        <div className={classes.queryParamEditorWrap}>
            <div>
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={5} />
                    <Grid item={true} xs={7}>
                        <div className={classes.labelOfInputs}>
                            Name
                        </div>
                    </Grid>
                </Grid>
                <Grid container={true} item={true} spacing={2}>
                    <Grid item={true} xs={5}>
                        <div className={classes.segmentTypeEditor}>
                            {variableTypeInput}
                        </div>
                    </Grid>
                    <Grid item={true} xs={7}>
                        <FormTextInput
                            dataTestId="api-query-param-name"
                            defaultValue={segmentState?.name}
                            customProps={{validate: validateNameValue}}
                            onChange={onChangeSegmentName}
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
                                dataTestId={"query-param-add-btn"}
                                text={onUpdate ? "Update" : " Add"}
                                disabled={!segmentState.name || !segmentState.type || segmentState?.name === "" || segmentState?.type === "" || pramError !== "" || !validSelectedType}
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
