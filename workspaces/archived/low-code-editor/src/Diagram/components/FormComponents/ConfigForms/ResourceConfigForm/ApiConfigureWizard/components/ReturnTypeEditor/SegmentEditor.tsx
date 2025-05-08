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

import CheckBoxGroup from "../../../../../FormFieldComponents/CheckBox";
import { SelectDropdownWithButton } from "../../../../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { ReturnType } from "../../types";
import { returnTypes } from "../../util";

import { useStyles } from './style';

interface ReturnTypeSegmentEditorProps {
    id?: number;
    showDefaultError?: boolean;
    segment?: ReturnType,
    onSave?: (segment: ReturnType) => void;
    onCancel?: () => void;
    returnTypesValues?: string[];
}

export function ReturnTypeSegmentEditor(props: ReturnTypeSegmentEditorProps) {
    const { segment, showDefaultError, onSave, id, onCancel, returnTypesValues = returnTypes } = props;
    const classes = useStyles();

    const initValue: ReturnType = segment ? { ...segment } : {
        id: id ? id : 0,
        type: showDefaultError ? "error" : "",
        isOptional: false
    };
    const [segmentState, setSegmentState] = useState<ReturnType>(initValue);

    const onChangeSegmentType = (text: any) => {
        setSegmentState({
            ...segmentState,
            type: text
        });
    };

    const onChangeSegmentOptional = (text: any) => {
        let isOptional = false
        if (text.find((item: string) => item === "Is Optional")) {
            isOptional = true;
        }
        setSegmentState({
            ...segmentState,
            isOptional
        });
    };

    const handleOnSave = () => {
        onSave(segmentState);
    };

    return (
        <div className={classes.returnTypeEditorWrap}>
            <div>
                <Grid container={true} spacing={1}>
                    <Grid item={true} xs={5}>
                        <div className={classes.labelOfInputs}>
                            Type
                        </div>
                    </Grid>
                </Grid>
                <Grid container={true} item={true} spacing={2}>
                    <Grid item={true} xs={6}>
                        <SelectDropdownWithButton
                            dataTestId="api-return-type"
                            defaultValue={segmentState?.type}
                            customProps={{values: returnTypesValues, disableCreateNew: true}}
                            onChange={onChangeSegmentType}
                        />
                    </Grid>
                    <Grid item={true} xs={6}>
                        <CheckBoxGroup className={classes.checkBoxLabel} values={["Is Optional"]} defaultValues={[segmentState.isOptional ? "Is Optional" : ""]} onChange={onChangeSegmentOptional} />
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
                                dataTestId={"api-return-save-btn"}
                                text={"Add"}
                                disabled={!segmentState.type}
                                fullWidth={false}
                                onClick={handleOnSave}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
