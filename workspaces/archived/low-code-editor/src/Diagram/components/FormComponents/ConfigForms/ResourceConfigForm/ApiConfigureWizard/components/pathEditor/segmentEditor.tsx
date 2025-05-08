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
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import CheckBoxGroup from "../../../../../FormFieldComponents/CheckBox";
import { FormTextInput } from "../../../../../FormFieldComponents/TextField/FormTextInput";
import { VariableTypeInput, VariableTypeInputProps } from "../../../../Components/VariableTypeInput";
import { PathSegment } from "../../types";

import { useStyles } from './style';

interface PathSegmentEditorProps {
    id?: number;
    segment?: PathSegment,
    onSave?: (segment: PathSegment) => void;
    onUpdate?: (segment: PathSegment) => void;
    onCancel?: () => void;
    model?: STNode;
    targetPosition?: NodePosition;
}

export function PathSegmentEditor(props: PathSegmentEditorProps) {
    const { segment, onSave, id, onCancel, onUpdate, targetPosition } = props;
    const classes = useStyles();
    let segmentValue = segment;
    if (segmentValue) {
        segmentValue = {
            ...segmentValue,
            type: "string"
        }
    }
    const initValue: PathSegment = segmentValue ? { ...segmentValue } : {
        id: id ? id : 0,
        name: "",
        isParam: false,
        type: "string"
    };

    const [segmentState, setSegmentState] = useState<PathSegment>(initValue);
    const [pathError, setPathError] = useState<string>("");
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

    const onParamCheckChange = (text: string[]) => {
        if (text) {
            setSegmentState({
                ...segmentState,
                isParam: text.length > 1
            });
        }
    };

    const validatePath = (text: string): string => {
        const pathRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9]*$");
        if (!pathRegex.test(text)) {
            return "Invalid path value";
        } else {
            return "";
        }
    };

    const validateNameValue = (value: string) => {
        if (value) {
            const pathResponse = validatePath(value);
            setPathError(pathResponse);
            return !pathResponse;
        }
        setPathError("");
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
        displayName: 'Select type',
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
        <div className={classes.segmentEditorWrap}>
            <div>
                <Grid container={true} spacing={1}>
                    <div className={classes.segmentNameContainer}>
                        <FormTextInput
                            customProps={{ validate: validateNameValue }}
                            onChange={onChangeSegmentName}
                            defaultValue={segmentState?.name}
                            label="Name"
                            placeholder={"Name"}
                            errorMessage={pathError}
                            dataTestId="api-path-segment"
                        />
                    </div>
                    <Grid container={true} item={true} spacing={2}>
                        <Grid item={true} xs={7}>
                            <CheckBoxGroup testId={"is-param-btn"} values={["Is Parameter"]} defaultValues={[segmentState.isParam ? "Is Parameter" : ""]} onChange={onParamCheckChange} />
                        </Grid>
                        <Grid item={true} xs={5}>
                            <div className={classes.segmentTypeEditor}>
                                {segmentState?.isParam && variableTypeInput}
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container={true} item={true} spacing={2}>
                        <Grid item={true} xs={12}>
                            <div className={classes.btnContainer}>
                                <SecondaryButton
                                    text="Cancel"
                                    fullWidth={false}
                                    onClick={onCancel}
                                    className={classes.actionBtn}
                                />
                                <PrimaryButton
                                    dataTestId={"path-segment-add-btn"}
                                    text={onUpdate ? "Update" : " Add"}
                                    disabled={!segmentState.name || segmentState.name === "" || (segmentState.isParam && (!segmentState.type || segmentState.type === "" || !validSelectedType)) || pathError !== ""}
                                    fullWidth={false}
                                    onClick={onUpdate ? handleOnUpdate : handleOnSave}
                                    className={classes.actionBtn}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
