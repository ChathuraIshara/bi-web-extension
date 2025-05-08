/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

export const HorizontalGrid = styled(VSCodeDataGrid)`
    flex-direction: row;
`;

export const LeftAllignGridRow = styled(VSCodeDataGridRow)`
    width: auto;
`;

export const TruncatedGridTitleCell = styled(VSCodeDataGridCell)`
    padding-left: 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    opacity: 0.7;
    color: var(--foreground); // Override the default color to match the theme
`;

export const TruncatedGridCell = styled(VSCodeDataGridCell)`
    padding-left: 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--foreground); // Override the default color to match the theme
`;
