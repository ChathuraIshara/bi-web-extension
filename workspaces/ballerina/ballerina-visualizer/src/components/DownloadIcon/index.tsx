/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

interface DownloadIconProps {
    color?: string;
}

export const DownloadIcon = ({ color = "#000" }: DownloadIconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke={color} stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path stroke-dasharray="2 4" stroke-dashoffset="6" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9">
                    <animate attributeName="stroke-dashoffset" dur="0.96s" repeatCount="indefinite" values="6;0" />
                </path>
                <path
                    stroke-dasharray="32"
                    stroke-dashoffset="32"
                    d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
                >
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.16s" dur="0.64s" values="32;0" />
                </path>
                <path stroke-dasharray="10" stroke-dashoffset="10" d="M12 8v7.5">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.32s" values="10;0" />
                </path>
                <path stroke-dasharray="6" stroke-dashoffset="6" d="M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5">
                    <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.12s" dur="0.32s" values="6;0" />
                </path>
            </g>
        </svg>
    );
};
