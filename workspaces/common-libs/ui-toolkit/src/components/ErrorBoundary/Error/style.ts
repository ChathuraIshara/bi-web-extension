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
    root: css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: '25vh 0'
    }),
    errorContainer: css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }),
    errorTitle: css({
        color: "var(--vscode-editor-foreground)"
    }),
    errorMsg: css({
        paddingTop: "16px",
        color: "var(--vscode-editor-foreground)"
    }),
    errorImg: css({
        paddingTop: "80px",
        paddingBottom: "40px",
        display: "block"
    }),
    gridContainer: css({
        height: "100%"
    }),
    link: css({
        color: "var(--vscode-editor-selectionBackground)",
        textDecoration: "underline",
        "&:hover, &:focus, &:active": {
            color: "var(--vscode-editor-selectionBackground)",
            textDecoration: "underline",
        }
    }),
    iconContainer: css({
        display: "flex",
        flexDirection: "row"
    }),
});
