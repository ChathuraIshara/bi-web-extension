/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

import { Button, Typography } from '@wso2-enterprise/ui-toolkit';
import { css } from '@emotion/css';
import { ISSUES_URL } from '../utils';

const useStyles = (() => ({
    errorContainer: css({
        display: 'flex',
        flexDirection: 'column'
    }),
    closeButton: css({
        marginTop: '20px',
        textTransform: 'none',
        alignSelf: 'flex-end',
        justifySelf: 'flex-start',
    })
}))

export interface AutoMapError {
    code: number;
    onClose: () => void;
    message?: string;
}

export function AutoMapError(props: AutoMapError) {
    const { code, onClose, message } = props;
    const classes = useStyles();

    let errorMessage = "Request timeout exceeded. Please try again.";

    if (message) {
        errorMessage = message;
    }

    function shouldRenderGithubRepo(errorCode: number): boolean {
        switch (errorCode) {
            case 3:
            case 4:
            case 5:
                return true;
            default:
                return false;
        }
    }

    return (
        <div className={classes.errorContainer}>
            <Typography variant="body2">
                {errorMessage}
            </Typography>
            {shouldRenderGithubRepo(code) && (
                <Typography >
                    Please raise an issue with a sample code in our <a href={ISSUES_URL}>issue tracker.</a>
                </Typography>
            )}
            <Button
                onClick={onClose}
                className={classes.closeButton}
            >
                {'Close'}
            </Button>
        </div>
    )
}
