/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { css } from "@emotion/css";

export const useStyles = () => ({
    warningContainer: css({
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: 'var(--vscode-editorWidget-background)',
        color: 'var(--vscode-sideBarSectionHeader-foreground)',
        padding: 10,
        minWidth: 120,
        width: 'fit-content',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'row',
        height: 'fit-content',
    }),
    warningIcon: css({
        display: 'flex',
        alignItems: 'center',
        color: 'var(--vscode-editorWarning-foreground)',
    }),
    warningBody: css({
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 1.5,
        fontWeight: 300,
        opacity: 0.8
    })
});
