/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { css } from "@emotion/css";

export const useStyles = () => ({
    root: css({
        flexGrow: 1,
        margin: '25vh auto',
        width: 'fit-content'
    }),
    errorContainer: css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" 
    }),
    errorTitle: css({
        color: "var(--vscode-badge-background)",
        textAlign: "center"
    }),
    errorMsg: css({
        paddingTop: "16px",
        color: "var(--vscode-checkbox-border)",
        textAlign: "center"
    }),
    errorImg: css({
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
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
    })
});
