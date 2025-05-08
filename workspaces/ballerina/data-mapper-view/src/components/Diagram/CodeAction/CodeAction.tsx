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

import { CodeAction } from "vscode-languageserver-types";

import { IDataMapperContext } from "../../../utils/DataMapperContext/DataMapperContext";

import { CodeActionTooltip } from "./CodeActionTooltip/CodeActionTooltip";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";

export interface CustomAction {
    title: string;
    onClick: () => void;
}

export interface CodeActionWidgetProps {
    codeActions?: CodeAction[];
    context: IDataMapperContext;
    additionalActions?: CustomAction[];
    isConfiguration?: boolean;
    btnSx?: React.CSSProperties;
}

export function CodeActionWidget(props: CodeActionWidgetProps) {
    const { codeActions, context, additionalActions, isConfiguration, btnSx } = props;

    return (
        <CodeActionTooltip codeActions={codeActions} context={context} additionalActions={additionalActions}>
            <Button
                appearance="icon"
                data-testid={`expression-label-code-action`}
                sx={{ ...btnSx, userSelect: "none", pointerEvents: "auto" }}
            >
                <Codicon
                    name={isConfiguration ? "settings-gear" : "lightbulb"}
                    sx={{ height: "18px", width: "18px" }}
                    iconSx={{ fontSize: "17px", color: "var(--vscode-input-placeholderForeground)" }}
                />
            </Button>
        </CodeActionTooltip>
    );
}
