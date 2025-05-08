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

export function UnionIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3490_20679)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.5H13.5C14.0523 1.5 14.5 1.94772 14.5 2.5V9.5C14.5 10.0523 14.0523 10.5 13.5 10.5H11.75V7C11.75 5.48122 10.5188 4.25 9 4.25L5.5 4.25V2.5C5.5 1.94772 5.94772 1.5 6.5 1.5ZM5.75 5.75V9C5.75 9.69036 6.30964 10.25 7 10.25H10.25V7C10.25 6.30964 9.69036 5.75 9 5.75L5.75 5.75ZM4.5 4.5V2.5C4.5 1.39543 5.39543 0.5 6.5 0.5H13.5C14.6046 0.5 15.5 1.39543 15.5 2.5V9.5C15.5 10.6046 14.6046 11.5 13.5 11.5H11.5V13.5C11.5 14.6046 10.6046 15.5 9.5 15.5H2.5C1.39543 15.5 0.5 14.6046 0.5 13.5V6.5C0.5 5.39543 1.39543 4.5 2.5 4.5H4.5ZM4.25 9V5.5H2.5C1.94772 5.5 1.5 5.94772 1.5 6.5V13.5C1.5 14.0523 1.94772 14.5 2.5 14.5H9.5C10.0523 14.5 10.5 14.0523 10.5 13.5V11.75H7C5.48122 11.75 4.25 10.5188 4.25 9Z" fill={ThemeColors.PRIMARY}/>
            </g>
            <defs>
                <clipPath id="clip0_3490_20679">
                    <rect width="16" height="16" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}
