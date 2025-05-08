/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { ThemeColors } from "@wso2-enterprise/ui-toolkit";

export function ServiceClassIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_614_6173)">
                <path d="M13.6216 0H2.37838C1.06484 0 0 1.06484 0 2.37838V13.6216C0 14.9352 1.06484 16 2.37838 16H13.6216C14.9352 16 16 14.9352 16 13.6216V2.37838C16 1.06484 14.9352 0 13.6216 0ZM2.37838 1.2973H13.6216C14.2187 1.2973 14.7027 1.78131 14.7027 2.37838V13.6216C14.7027 14.2187 14.2187 14.7027 13.6216 14.7027H2.37838C1.78131 14.7027 1.2973 14.2187 1.2973 13.6216V2.37838C1.2973 1.78131 1.78131 1.2973 2.37838 1.2973Z" fill={ThemeColors.PRIMARY}/>
            </g>
            <defs>
                <clipPath id="clip0_614_6173">
                    <rect width="16" height="16" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}
