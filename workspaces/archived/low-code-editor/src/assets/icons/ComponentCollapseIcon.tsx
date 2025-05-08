/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

export interface ConstantCollapseProps {
    color?: string
}

export default function ComponentCollapseIcon(props: ConstantCollapseProps) {
    return (
        <svg className={'component-collapse-icon'} width="7px" height="12px" viewBox="0 0 7 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="edit-http-" transform="translate(-1373.000000, -562.000000)" fill="#8D91A3" fill-rule="nonzero">
                    <g id="Icon/Hide" transform="translate(1376.155330, 568.000000) rotate(-90.000000) translate(-1376.155330, -568.000000) translate(1370.905330, 564.844670)">
                        <path d="M0.219669914,0.219669914 C0.485936477,-0.0465966484 0.902600159,-0.0708026996 1.19621165,0.147051761 L1.28033009,0.219669914 L5.25,4.189 L9.21966991,0.219669914 C9.48593648,-0.0465966484 9.90260016,-0.0708026996 10.1962117,0.147051761 L10.2803301,0.219669914 C10.5465966,0.485936477 10.5708027,0.902600159 10.3529482,1.19621165 L10.2803301,1.28033009 L5.25,6.31066017 L0.219669914,1.28033009 C-0.0732233047,0.987436867 -0.0732233047,0.512563133 0.219669914,0.219669914 Z" id="Path-16" />
                    </g>
                </g>
            </g>
        </svg>
    )
}
