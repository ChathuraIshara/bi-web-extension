/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

export interface DataMapperProps {
    className?: string
}

export default function DataMapperIcon(props: DataMapperProps) {
    return (
        <svg width="16px" height="14px" viewBox="0 0 16 14" version="1.1" className={props?.className ? props.className : "sub-menu-dark-fill"}>
            <g id="Home" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="choose-service" transform="translate(-136.000000, -306.000000)" className="svg-sub-menu-plus-option-icon" fillRule="nonzero">
                    <g id="Icon/Fx-Copy" transform="translate(136.000000, 306.000000)">
                        <path id="Combined_Shape" d="M4.8,11.2H0V9.6H4.8v-8H.8V0h9.6V1.6h-4V4.8h4V6.4h-4v4.8Z" transform="translate(2.4 2.4)" />
                        <path id="Combined_Shape-2" d="M12,11.2a1.6,1.6,0,1,1,1.6,1.6A1.6,1.6,0,0,1,12,11.2Zm-12,0a1.6,1.6,0,1,1,1.6,1.6A1.6,1.6,0,0,1,0,11.2ZM12,6.4A1.6,1.6,0,1,1,13.6,8,1.6,1.6,0,0,1,12,6.4ZM0,6.4A1.6,1.6,0,1,1,1.6,8,1.6,1.6,0,0,1,0,6.4ZM12,1.6a1.6,1.6,0,1,1,1.6,1.6A1.6,1.6,0,0,1,12,1.6ZM0,1.6A1.6,1.6,0,1,1,1.6,3.2,1.6,1.6,0,0,1,0,1.6Z" transform="translate(0.4 1.6)"/>
                    </g>
                </g>
            </g>
        </svg>
    )
}
