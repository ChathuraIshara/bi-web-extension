/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactNode } from 'react';

import Typography from '@material-ui/core/Typography';
import { Warning } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import clsx from 'clsx';

import { useStyles } from './style';

export interface WarningBannerProps {
    message: ReactNode | string;
    testId?: string;
    className?: string;
}

export const WarningBanner = (props: WarningBannerProps) => {
    const classes = useStyles();
    const { message, testId, className } = props;

    return (
        <div className={clsx([classes.warningContainer, className])} data-testid="warning-banner">
            <div className={classes.warningIcon}>
                <Warning/>
            </div>
            <div data-test-id={testId} >
                {(typeof message === 'string' ? <Typography variant="body1">{message}</Typography> : (message))}
            </div>
        </div>
    );
};
