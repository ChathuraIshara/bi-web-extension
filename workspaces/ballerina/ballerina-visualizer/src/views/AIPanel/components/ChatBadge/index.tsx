/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

export enum ChatBadgeType {
    Command = "command",
    Tag = "tag",
}

interface ChatBadgeProps {
    children: React.ReactNode;
    rawValue?: string;
    badgeType: ChatBadgeType;
}

const ChatBadge: React.FC<ChatBadgeProps> = ({ children, rawValue, badgeType }) => {
    return (
        <div
            contentEditable={false}
            style={{
                backgroundColor: "var(--vscode-toolbar-hoverBackground)",
                color: "var(--vscode-icon-foreground)",
                padding: "4px 0",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                lineHeight: 1,
                fontFamily: "'Source Code Pro', monospace",
                marginRight: "2px",
            }}
            data-raw-value={rawValue ?? children}
            data-badge-type={badgeType}
        >
            {children}
        </div>
    );
};

export default ChatBadge;
