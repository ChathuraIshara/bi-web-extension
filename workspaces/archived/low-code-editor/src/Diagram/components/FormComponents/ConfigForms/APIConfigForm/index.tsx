/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { Box, FormControl, FormHelperText, InputAdornment, TextField, Typography } from "@material-ui/core";
import { FormHeaderSection, PrimaryButton, SecondaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { Context } from "../../../../../Contexts/Diagram";
import { ServiceMethodType, SERVICE_METHODS } from "../../../../models";
import CheckBoxGroup from "../../FormFieldComponents/CheckBox";
import { useStyles as useTextFieldStyles } from "../../FormFieldComponents/TextField/style";
import { wizardStyles as useFormStyles } from "../style";

export interface APIConfigFormProps {
    onClose: () => void;
    onComplete: (method: ServiceMethodType[], path: string) => void;
    methods?: ServiceMethodType[],
    path?: string,
}

export function APIConfigForm(props: APIConfigFormProps) {
    const { props: { isMutationProgress: isMutationInProgress } } = useContext(Context);

    const { onComplete, onClose, methods: currentMethod = ["GET"] } = props;
    let { path: currentPath = "" } = props;
    // remove leading / from path
    if (currentPath && currentPath.charAt(0) === '/') {
        currentPath = currentPath.substr(1);
    }

    const formClasses = useFormStyles();
    const textFieldClasses = useTextFieldStyles();

    const [methods, setMethods] = React.useState<ServiceMethodType[]>(currentMethod);
    const [path, setPath] = React.useState(currentPath);

    const isValidPath = !path || ((!/^\d/.test(path)) && /^[a-zA-Z0-9_/\[ \]...]+$/g.test(path));
    const pathErrorText = !isValidPath ? "cannot start with a number & only [a-zA-Z0-9_/\[\]...] chars allowed" : "";

    const handlePathChange = (event: any) => setPath(event.target.value);
    const onSave = () => onComplete(methods, path);
    const handleMethodsChange = (values: string[]) => setMethods(values as ServiceMethodType[]);

    return (
        <FormControl className={formClasses.wizardFormControl}>
            <FormHeaderSection
                onCancel={onClose}
                formTitle={"lowcode.develop.configForms.apiConfig.title"}
                defaultMessage={"API Configuration"}
            />
            <CheckBoxGroup className={formClasses.groupedForm} values={SERVICE_METHODS} defaultValues={methods} onChange={handleMethodsChange} label="HTTP Method" />
            <div className={formClasses.labelWrapper}>
                <FormHelperText className={formClasses.inputLabelForRequired}>Path</FormHelperText>
                <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
            </div>
            <TextField
                error={!isValidPath}
                key={"resourcePath"}
                className={formClasses.inputLabelWrapper}
                InputProps={{
                    disableUnderline: true,
                    classes: {
                        root: textFieldClasses.textFeild,
                        error: textFieldClasses.errorField,
                    },
                    startAdornment: <InputAdornment position="start">/</InputAdornment>
                }}
                placeholder={"Relative path from host"}
                fullWidth={true}
                size='medium'
                margin="normal"
                InputLabelProps={{ shrink: true }}
                onChange={handlePathChange}
                defaultValue={path}
                helperText={pathErrorText}
            />
            <div className={formClasses.wizardBtnHolder}>
                <SecondaryButton text="Cancel" fullWidth={false} onClick={onClose} />
                <PrimaryButton
                    text="Save"
                    disabled={!isValidPath || isMutationInProgress || methods.length === 0}
                    fullWidth={false}
                    onClick={onSave}
                />
            </div>
            <div className={formClasses.formCreate} />
        </FormControl>
    );
}
