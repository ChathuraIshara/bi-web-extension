/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 *
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import React from "react";
import styled from "@emotion/styled";

const Bubbles = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & > span {
        width: 6px;
        height: 6px;
        margin: 4px 2px;
        border-radius: 50%;
        background-color: var(--vscode-editor-foreground);
        display: inline-block;
        animation: bubble 1s infinite alternate;
    }

    & > span:nth-of-type(2) {
        animation-delay: 0.2s;
    }

    & > span:nth-of-type(3) {
        animation-delay: 0.4s;
    }

    @keyframes bubble {
        0% {
            transform: translateY(3px);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-3px);
            opacity: 1;
        }
    }
`;

const LoadingIndicator: React.FC = () => {
    return (
        <Bubbles>
            <span />
            <span />
            <span />
        </Bubbles>
    );
};

export default LoadingIndicator;
