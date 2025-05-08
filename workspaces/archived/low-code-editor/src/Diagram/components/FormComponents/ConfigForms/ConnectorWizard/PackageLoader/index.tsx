/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React from "react";

import { Box, FormControl } from "@material-ui/core";
import { BallerinaConnectorInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { STNode } from "@wso2-enterprise/syntax-tree";

import { FormGeneratorProps } from "../../../FormGenerator";
import { wizardStyles as useFormStyles } from "../../style";
import useStyles from "../style";

import PullingModuleLoader from "./Loader";

export function PackageLoader(props: FormGeneratorProps) {
    const classes = useStyles();
    const formClasses = useFormStyles();

    return (
        <FormControl data-testid="endpoint-list-form" className={formClasses.wizardFormControlExtended}>
            <FormHeaderSection onCancel={props.onCancel} formTitle={"lowcode.develop.configForms.packageLoader.title"} defaultMessage={"Pulling packages"} />
            <div className={classes.loaderWrapper}>
                <PullingModuleLoader />
                <p className={classes.loaderTitle}>Pulling packages</p>
                <p className={classes.loaderSubtitle}>This might take some time</p>
            </div>
        </FormControl>
    );
}
