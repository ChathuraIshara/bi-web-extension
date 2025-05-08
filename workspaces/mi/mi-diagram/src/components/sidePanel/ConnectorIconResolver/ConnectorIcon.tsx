/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { CSSProperties } from "react";

export function ConnectorIcon(props: { styles?: CSSProperties }) {
    return (
        <svg width="12" height="12" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="var(--vscode-editor-foreground)"/>
            <path d="M21.6846 24.1719H28.9127C29.7283 24.1719 30.4033 23.4406 30.4033 22.5125C30.4033 21.6125 29.7283 20.8531 28.9127 20.8531H21.6846V15.3406L28.9127 15.3406C29.7283 15.3406 30.4033 14.6094 30.4033 13.6813C30.4033 12.7813 29.7283 12.0219 28.9127 12.0219L21.6846 12.0219V8H18.6471C14.3158 8 10.8564 11.4031 9.87207 15.9313L9.81582 16.2969L0.000195742 16.2969L0.000195742 20.3188L9.84395 20.3188V20.4313C10.7439 25.0719 14.2033 28.6156 18.6189 28.6156L21.6846 28.6156V24.1719Z" fill="var(--vscode-editor-background)"/>
        </svg>
    );
}
