/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { NodeLinkModel } from "./NodeLinkModel";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
interface NodeLinkWidgetProps {
    link: NodeLinkModel;
    engine: DiagramEngine;
}

export const NodeLinkWidget: React.FC<NodeLinkWidgetProps> = ({ link, engine }) => {
    const [isHovered, setIsHovered] = useState(false);

    const linkColor = link.visible ? (isHovered ? ThemeColors.PRIMARY : ThemeColors.ON_SURFACE) : "transparent";

    return (
        <g pointerEvents={"all"} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <path
                id={link.getID() + "-bg"}
                d={link.getSVGPath()}
                fill={"none"}
                stroke={"transparent"}
                strokeWidth={16}
            />
            <path id={link.getID()} d={link.getSVGPath()} fill={"none"} stroke={linkColor} strokeWidth={1.5} />

            <defs>
                <marker
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    viewBox="0 0 8 8"
                    orient="auto"
                    id={`${link.getID()}-arrow-head-old`}
                >
                    <polygon points="0,8 0,0 6,4" fill={linkColor}></polygon>
                </marker>
            </defs>
            <defs>
                <marker
                    markerWidth="10"
                    markerHeight="10"
                    refX="5"
                    refY="5"
                    viewBox="0 0 10 10"
                    orient="auto"
                    id={`${link.getID()}-arrow-head`}
                >
                    <polyline
                        points="0,5 5,2.5 2,0"
                        fill="none"
                        strokeWidth="1.5"
                        stroke={linkColor}
                        strokeLinecap="round"
                        transform="matrix(1,0,0,1,1.5,2.5)"
                        strokeLinejoin="round"
                    ></polyline>
                </marker>
            </defs>
        </g>
    );
};
