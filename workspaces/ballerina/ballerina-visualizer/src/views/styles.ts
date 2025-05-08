/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";

export const ViewWrapper = styled.div`
    padding: 16px;
`;

export const Text = styled.p`
    font-size: 14px;
    color: var(--vscode-sideBarTitle-foreground);
`;

export const BodyText = styled(Text)`
    color: var(--vscode-sideBarTitle-foreground);
    margin: 0 0 8px;
    opacity: 0.5;
`;

export const BodyTinyInfo = styled(Text)`
    color: var(--vscode-sideBarTitle-foreground);
    margin: 0 0 8px;
    opacity: 0.5;
    font-weight: normal;
    font-size: 12px;
    letter-spacing: 0.39px;
`;

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    flex-direction: column;
`;

export const LoadingOverlayContainer = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-color: var(--vscode-editor-background);
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
