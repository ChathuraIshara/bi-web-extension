/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { render } from "react-dom";
import { UPDATE_EVENT, VariableValue, VariableView } from "./variable-view/VariableView";

let container: HTMLElement;

export function renderVariableView(target: HTMLElement, getVariableValues: () => Promise<VariableValue[]>) {
    container = target;
    render(
        <VariableView
            getVariableValues={getVariableValues}
            container={target}
        />,
        target
    );
}

export function updateVariableValues() {
    if (container) {
        container.dispatchEvent(new Event(UPDATE_EVENT));
    }
}
