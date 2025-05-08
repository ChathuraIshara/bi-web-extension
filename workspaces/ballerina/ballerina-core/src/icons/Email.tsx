/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

export default function EmailIcon(props: any) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" {...props}>
            <g fill="none" fillRule="evenodd">
                <path fill="#5668D5" d="M0 4.756L8 10.7l8-5.945v6.577C16 12.806 14.806 14 13.333 14H2.667C1.194 14 0 12.806 0 11.333V4.756z" opacity=".3" />
                <path fill="#5567D5" d="M1.156 2h13.688C15.483 2 16 2.517 16 3.156L8.004 9.022 0 3.156C0 2.517.517 2 1.156 2z" />
            </g>
        </svg>
    )
}
