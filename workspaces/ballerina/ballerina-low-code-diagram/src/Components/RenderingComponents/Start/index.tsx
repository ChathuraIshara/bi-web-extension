/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import {
    FunctionBodyBlock,
    FunctionDefinition,
    ModulePart,
    ObjectMethodDefinition,
    ResourceAccessorDefinition,
    STKindChecker,
} from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Context/diagram";
import { PlusButton } from "../../PlusButtons/Plus";

import {
    StartSVG,
    START_SVG_HEIGHT,
    START_SVG_WIDTH,
} from "./StartSVG";
import "./style.scss";

export interface StartButtonProps {
    model: FunctionDefinition | ModulePart | ObjectMethodDefinition | ResourceAccessorDefinition;
}

export function StartButton(props: StartButtonProps) {
    const diagramContext = useContext(Context);
    const { isReadOnly } = diagramContext.props;

    const { model } = props;

    const isFunctionKind = model && (STKindChecker.isResourceAccessorDefinition(model)
        || STKindChecker.isObjectMethodDefinition(model)
        || STKindChecker.isFunctionDefinition(model));

    const viewState = model.viewState;
    const cx = viewState.trigger.cx;
    const cy = viewState.trigger.cy;
    const plusView = viewState.initPlus;
    const initPlusAvailable = viewState.initPlus !== undefined;

    let block: FunctionBodyBlock;
    if (model && isFunctionKind) {
        block = model.functionBody as FunctionBodyBlock;
    }
    return (
        // hide edit button for triggers and expression bodied functions
        <g className="start-wrapper">
            <StartSVG
                x={cx - (START_SVG_WIDTH / 2)}
                y={cy - (START_SVG_HEIGHT / 2)}
                text="START"
            />
            {block && initPlusAvailable && !isReadOnly && <PlusButton viewState={plusView} model={block} initPlus={true} />}
        </g>
    );
}
