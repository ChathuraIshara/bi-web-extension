/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable:jsx-no-multiline-js
import React from "react";

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getConstructIcon } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { BackButton } from "./BackButton";
import { CloseButton } from "./CloseButton";
import { FormTitle } from "./FormTitle";
import { useStyles } from "./style";

interface FormHeaderSectionProps {
    formTitle: string;
    defaultMessage: string;
    formTitleSecond?: string;
    defaultMessageSecond?: string;
    formType?: string;
    onCancel?: () => void;
    onBack?: () => void;
}

export function FormHeaderSection(props: FormHeaderSectionProps) {
    const { onCancel, onBack, formTitle, formTitleSecond, defaultMessage, defaultMessageSecond, formType } = props;
    const formClasses = useStyles();
    // TODO need to move the assests folder to commens module
    const icon = (formType && formType.length > 0) ? getConstructIcon(formType) : null;

    return (
        <div className={formClasses.formHeaderTitleWrapper}>
            {formType ? <div className={formClasses.titleIcon}>{icon}</div> : null}
            {onBack && <BackButton onBack={onBack} />}
            <FormTitle formTitle={formTitle} defaultMessage={defaultMessage} />
            {formTitleSecond && <div className={formClasses.secondTitle}><NavigateNextIcon fontSize="small" /> <FormTitle formTitle={formTitleSecond} defaultMessage={defaultMessageSecond} /> </div>}
            {onCancel && <CloseButton onCancel={onCancel} />}
        </div>
    );
}
