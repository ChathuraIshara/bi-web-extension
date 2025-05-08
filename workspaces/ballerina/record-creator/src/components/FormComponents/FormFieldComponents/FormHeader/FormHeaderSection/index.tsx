/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable:jsx-no-multiline-js
import React from "react";
import { useStyles } from "./style";
import { Button, Codicon, Typography } from "@wso2-enterprise/ui-toolkit";
import { FormattedMessage } from "react-intl";

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
    const { onCancel, onBack, formTitle, formTitleSecond, defaultMessage, defaultMessageSecond } = props;
    const formClasses = useStyles();

    return (
        <div className={formClasses.formHeaderTitleWrapper}>
            {onBack && (
                <Button appearance="icon" onClick={onBack}>
                    <Codicon name="arrow-small-left" />
                </Button>
            )}
            <Typography variant="h4" sx={{ paddingTop: "19px", paddingBottom: "16px" }}>
                <FormattedMessage id={formTitle} defaultMessage={defaultMessage} />
            </Typography>
            {formTitleSecond && (
                <div className={formClasses.secondTitle}>
                    <Codicon name="chevron-right" />{" "}
                    <Typography variant="h4" sx={{ paddingTop: "19px", paddingBottom: "16px" }}>
                        <FormattedMessage id={formTitleSecond} defaultMessage={defaultMessageSecond} />
                    </Typography>{" "}
                </div>
            )}
            {onCancel && (
                <Button appearance="icon" onClick={onCancel}>
                    <Codicon name="close" />
                </Button>
            )}
        </div>
    );
}
