/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React from "react";

import { Button, Codicon, Divider, Icon, Tooltip } from "@wso2-enterprise/ui-toolkit";
import { Diagnostic } from "vscode-languageserver-types";

import { useStyles } from "../style";

interface Props {
    placement: "top" | "bottom" | "left" | "right";
    children: React.ReactNode;
    diagnostic: Diagnostic
    value?: string
    onClick?: () => void;
}

export const DiagnosticTooltipID = "data-mapper-diagnostic-tooltip";

export function DiagnosticTooltip(props: Partial<Props>) {
    const { diagnostic, value, children, onClick } = props;
    const classes = useStyles();
    const source = diagnostic.source || value

    const Code = () => (
        <>
            <Divider />
            <div className={classes.source}>
                <code
                    data-lang="ballerina"
                    className={classes.code}
                >
                    {source.trim()}
                </code>
                <Button
                    appearance="icon"
                    className={classes.editButton}
                    aria-label="edit"
                    onClick={onClick}
                >
                    <Codicon name="tools" sx={{ marginRight: "8px" }} />
                    <span className={classes.editButtonText}>Fix by editing expression</span>
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
            <div className={classes.diagnosticWrapper}>{diagnostic.message}</div>
        </>

    );

    const tooltipTitleComponent = (
        <pre className={classes.pre}>
            {diagnostic.message && <DiagnosticC />}
            {source && <Code />}
        </pre>
    );

    return (
        <Tooltip
            id={DiagnosticTooltipID}
            content={tooltipTitleComponent}
            position="bottom"
        >
            {children}
        </Tooltip>
    )

}
