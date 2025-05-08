/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React from "react";

import { STNode } from "@wso2-enterprise/syntax-tree";
import cn from "classnames";

import { EndpointViewState, StatementViewState } from "../../../../ViewState";

import {
    CLIENT_RADIUS,
    CLIENT_SHADOW_OFFSET,
    CLIENT_SVG_WIDTH_WITH_SHADOW,
    ConnectorSVG
} from "./ConnectorClientSVG";
import { ModuleIcon } from "./ModuleIcon";
import "./style.scss";

export interface ConnectorClientProps {
    model: STNode;
}

export function ConnectorHeaderC(props: ConnectorClientProps) {
    const { model } = props
    const connectorClientViewState: StatementViewState = model.viewState as StatementViewState;
    const epViewState: EndpointViewState = connectorClientViewState.endpoint as EndpointViewState;

    const x = connectorClientViewState.endpoint.lifeLine.cx - CLIENT_SVG_WIDTH_WITH_SHADOW / 2;
    const y = epViewState.isExternal
        ? connectorClientViewState.endpoint.lifeLine.cy - CLIENT_RADIUS * 2 - CLIENT_SHADOW_OFFSET / 2
        : connectorClientViewState.bBox.cy - CLIENT_SHADOW_OFFSET / 2;

    const connectorWrapper = cn("main-connector-wrapper connector-client");
    const iconWidth = 24;
    const iconProps = {
        x: connectorClientViewState.endpoint.lifeLine.cx - iconWidth / 2,
        y: (epViewState.isExternal
                ? connectorClientViewState.endpoint.lifeLine.cy - CLIENT_RADIUS
                : connectorClientViewState.endpoint.lifeLine.cy + CLIENT_RADIUS) -
            iconWidth / 2,
    };

    return (
            <g>
                <g className={connectorWrapper}>
                    <ConnectorSVG
                        x={x}
                        y={y}
                    />
                    <ModuleIcon node={model} width={iconWidth} cx={iconProps.x} cy={iconProps.y} scale={0.5}/>
                </g>
            </g>

    );
}

export const ConnectorHeader = ConnectorHeaderC;
