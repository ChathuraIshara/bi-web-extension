/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { Button, Codicon, Divider, Icon, Tooltip } from "@wso2-enterprise/ui-toolkit";

import { useStyles } from "./style";

interface Props {
    placement: "top" | "bottom" | "left" | "right";
    children: React.ReactNode;
    diagnostic: string;
    value?: string
    onClick?: () => void;
}

export const DiagnosticTooltipID = "data-mapper-diagnostic-tooltip";

export function DiagnosticTooltip(props: Partial<Props>) {
    const { diagnostic, value, children, onClick } = props;
    const classes = useStyles();

    const Code = () => (
        <>
            <Divider />
            <div className={classes.source}>
                <code
                    data-lang="typescript"
                    className={classes.code}
                >
                    {value.trim()}
                </code>
                <Button
                    appearance="icon"
                    className={classes.editButton}
                    aria-label="edit"
                    onClick={onClick}
                >
                    <Codicon name="tools" sx={{ marginRight: "8px" }} />
                    <span className={classes.editButtonText}>Fix by editing source</span>
                </Button>
            </div>
        </>

    );

    const DiagnosticC = () => (
        <>
            <Button
                appearance="icon"
                className={classes.editButton}
                aria-label="edit"
                onClick={onClick}
            >
                <Icon name="error-icon" iconSx={{ color: "var(--vscode-errorForeground)" }} />
            </Button>
            <div className={classes.diagnosticWrapper}>{diagnostic}</div>
        </>

    );

    const tooltipTitleComponent = (
        <pre className={classes.pre}>
            {diagnostic && <DiagnosticC />}
            {value && <Code />}
        </pre>
    );

    return (
        <Tooltip
            id={DiagnosticTooltipID}
            content={tooltipTitleComponent}
            position="bottom"
            className={classes.tooltip}
        >
            {children}
        </Tooltip>
    )
}
