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
import { FormattedMessage, useIntl } from "react-intl";

// import { Box, Typography } from "@material-ui/core";

import { useStyles } from "../style";

interface FormTitleProps {
    formTitle: string;
    defaultMessage: string;
}

export function FormTitle(props: FormTitleProps) {
    const { formTitle, defaultMessage } = props;
    const formClasses = useStyles();
    const intl = useIntl();

    return (
        <div className={formClasses.formTitleWrapper}>
            <div className={formClasses.mainTitleWrapper}>
                <h4>
                    <div>
                        {defaultMessage}
                    </div>
                </h4>
            </div>
        </div>
    );
}
