/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { css } from "@emotion/css";

export const useStyles = () => ({
    pre: css({
        margin: 0,
        width: "300px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
    }),
    code: css({
        borderRadius: 0,
        backgroundColor: "var(--vscode-sideBar-background)",
        fontSize: "13px",
        padding: "4px 2px",
        "& span": {
            color: "var(--vscode-inputOption-activeForeground)"
        }
    }),
    diagnosticWrapper: css({
        fontSize: '12px',
        letterSpacing: '0',
        color: "var(--vscode-errorForeground)"
    }),
    source: css({
        display: "flex",
        flexDirection: "column"
    }),
    tooltip: css({
        verticalAlign: "middle"
    }),
    editButton: css({
        marginTop: "10px",
        color: "var(--vscode-input-placeholderForeground)",
        width: "100% !important"
    }),
    editButtonText: css({
        width: "fit-content",
        textWrap: "nowrap",
        fontSize: "13px"
    })
});
