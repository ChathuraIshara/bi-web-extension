/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import { useStyles } from "./style";
import { Typography } from "../../Typography/Typography";
import { Codicon } from "../../Codicon/Codicon";
import { useErrorBoundary } from "react-error-boundary";
import { Button } from "../../Button/Button";
import { Icon } from "../../Icon/Icon";

export interface ErrorProps {
    errorMsg?: string;
    issueUrl?: string;
    goHome?: () => void;
}

export function ErrorScreen(props: ErrorProps) {
    const classes = useStyles();
    const { resetBoundary } = useErrorBoundary();
    const issueUrl = props.issueUrl || "https://github.com/wso2/ballerina-plugin-vscode/issues";

    return (
        <div className={classes.root}>
            <Codicon name="error" sx={{ height: "100px", width: "100px" }} iconSx={{ fontSize: 100, color: "var(--vscode-errorForeground)" }} />
            <Typography variant="h4" className={classes.errorTitle}>
                {props.errorMsg ? props.errorMsg : "A problem occurred."}
            </Typography>
            <div className={classes.iconContainer}>
                <Button appearance="icon" onClick={resetBoundary}>
                    <Icon name="refresh" isCodicon sx={{ width: 24, height: 24 }} iconSx={{ fontSize: 24 }} />
                </Button>
                {props.goHome && (
                    <Button appearance="icon" onClick={() => props.goHome() }>
                        <Icon name="home" isCodicon sx={{ width: 24, height: 24 }} iconSx={{ fontSize: 24 }} />
                    </Button>
                )}
            </div>
            <Typography variant="body2" className={classes.errorMsg}>
                Please raise an issue in our <a href={issueUrl}>issue tracker</a>
            </Typography>
        </div>
    );
}
