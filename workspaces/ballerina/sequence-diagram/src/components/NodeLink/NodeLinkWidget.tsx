/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/** @jsxImportSource @emotion/react */
import React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { NodeLinkModel } from "./NodeLinkModel";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";
interface NodeLinkWidgetProps {
    link: NodeLinkModel;
    engine: DiagramEngine;
}

export const NodeLinkWidget: React.FC<NodeLinkWidgetProps> = ({ link, engine }) => {
    const start = link.getFirstPoint();
    const end = link.getLastPoint();
    const angle = (Math.atan2(end.getY() - start.getY(), end.getX() - start.getX()) * 180) / Math.PI;
    const upsideDown = angle > 90 || angle < -90;

    const linkColor = link.variant ? ThemeColors.PRIMARY : ThemeColors.PRIMARY;

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
                stroke={linkColor}
                strokeWidth={1.5}
                markerEnd={link.showArrowToNode() ? `url(#${link.getID()}-arrow-head)` : ""}
            />
            <defs>
                <marker
                    markerWidth="5"
                    markerHeight="5"
                    refX="7"  // Adjusted offset in x axis
                    refY="1.5"
                    viewBox="0 0 3 3"
                    orient="auto"
                    id={`${link.getID()}-arrow-head`}
                >
                    <polygon points="0,3 0,0 3,1.5" fill={linkColor}></polygon>
                </marker>
            </defs>
            <text
                fill={linkColor}
                textAnchor="middle"
                dy={-8}
                transform={upsideDown ? "scale(1, -1)" : ""}
                fontFamily="monospace"
            >
                <textPath href={`#${link.getID()}`} startOffset="50%">
                    {link.label}
                </textPath>
            </text>
        </g>
    );
};
