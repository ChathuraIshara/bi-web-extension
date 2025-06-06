/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

import { ComponentCollapseIcon, ComponentExpandIcon } from '@wso2-enterprise/ballerina-core';

import './style.scss';

export interface ComponentExpandButtonProps {
    onClick: () => void;
    isExpanded: boolean;
}

export function ComponentExpandButton(props: ComponentExpandButtonProps) {
    const { onClick, isExpanded } = props;

    return (
        <div className={'component-expand-icon-container'} onClick={onClick} >
            {isExpanded ? <ComponentExpandIcon /> : <ComponentCollapseIcon />}
        </div>
    );
}
