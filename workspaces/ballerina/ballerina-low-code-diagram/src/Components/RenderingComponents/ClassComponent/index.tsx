/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";

import { ClassDefinition } from "@wso2-enterprise/syntax-tree";

import { ClassHeader } from "./ClassHeader";
import './style.scss'

export interface ClassComponentProps {
    model: ClassDefinition
}

export function ClassComponent(props: ClassComponentProps) {
    const { model } = props;
    const [isExpanded, setIsExpanded] = useState(false);

    const onExpandClick = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className={'class-component'}>
            <ClassHeader model={model} onExpandClick={onExpandClick} isExpanded={isExpanded} />
        </div>
    );
}
