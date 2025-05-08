/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { css } from "@emotion/css";

export const tooltipBaseStyles = {
    tooltip: {
        color: "#8d91a3",
        backgroundColor: "#fdfdfd",
        border: "1px solid #e6e7ec",
        borderRadius: 6,
        padding: "1rem"
    },
    arrow: {
        color: "#fdfdfd"
    }
};

export const useStyles = () => ({
    element: css({
        backgroundColor: "var(--vscode-input-background)",
        padding: "10px",
        cursor: "pointer",
        transitionDuration: "0.2s",
        userSelect: "none",
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            filter: "brightness(0.95)",
        }
    }),
    iconWrapper: css({
        height: "22px",
        width: "22px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }),
    divider: css({
        margin: '5px 0px'
    }),
    editorLink: css({
        color: "var(--vscode-editorInfo-foreground)",
        fontSize: 12,
        marginTop: 10,
        cursor: 'pointer',
        transition: "all 0.2s",
        '&:hover': {
            color: "var(--vscode-editorInfo-foreground)",
        },
    }),
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
    editText: css({
        textTransform: "none",
        justifyContent: "left",
        fontSize: "13px"
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