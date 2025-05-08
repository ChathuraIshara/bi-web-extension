/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { ArrowLinkModel } from "./ArrowLinkModel";

interface ArrowLinkWidgetProps {
    link: ArrowLinkModel;
}
  
export function ArrowLinkWidget(props: ArrowLinkWidgetProps) {
    const { link } = props;

    return (
        <g pointerEvents={"all"}>
            <path
                id={link.getID() + "-bg"}
                d={link.getSVGPath()}
                fill={"none"}
                stroke={"transparent"}
                strokeWidth={16}
            />
            <path
                id={link.getID()}
                d={link.getSVGPath()}
                fill={"none"}
                stroke={"var(--vscode-editorBracketMatch-border)"}
                strokeWidth={2}
                strokeDasharray={"0"}
                markerEnd="url(#arrowhead)"
            />
            <defs>
                <marker
                    markerWidth="4"
                    markerHeight="4"
                    refX="3"
                    refY="2"
                    viewBox="0 0 4 4"
                    orient="auto"
                    id="arrowhead"
                >
                    <polygon
                        points="0,4 0,0 4,2"
                        fill={"var(--vscode-editorBracketMatch-border)"}
                    ></polygon>
                </marker>
            </defs>
        </g>
    );
};
