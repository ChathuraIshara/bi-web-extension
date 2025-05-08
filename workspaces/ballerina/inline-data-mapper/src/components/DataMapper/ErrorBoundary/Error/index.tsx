/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import { useStyles } from "./style";
import { Button, Codicon, Typography } from "@wso2-enterprise/ui-toolkit";
import { ISSUES_URL } from "../../../../components/Diagram/utils/constants";

interface ErrorScreenProps {
    onClose: () => void;  
};

export default function ErrorScreen(props: ErrorScreenProps) {
    const classes = useStyles();

    return (
        <>
            <div className={classes.closeButtonContainer}>
                <Button appearance="icon" onClick={props.onClose}>
                    <Codicon name="close" />
                </Button>
            </div>
            <div className={classes.root}>
                <div className={classes.errorImg}>
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--vscode-editor-foreground)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <Typography variant="h4" className={classes.errorTitle}>
                    A problem occurred while rendering the Inline Data Mapper.
                </Typography>
                <Typography variant="body2" className={classes.errorMsg}>
                    Please raise an issue with the sample code in our <a href={ISSUES_URL}>issue tracker</a>
                </Typography>
            </div>
        </>
    );
}
