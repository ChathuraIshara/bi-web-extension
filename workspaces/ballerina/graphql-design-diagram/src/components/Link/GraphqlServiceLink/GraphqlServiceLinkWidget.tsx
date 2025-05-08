/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React, { useEffect, useState } from "react";

import { DiagramEngine } from "@projectstorm/react-diagrams";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";


import { GRAPHQL_SERVICE_NODE } from "../../Nodes/GraphqlServiceNode/GraphqlServiceNodeModel";
import { RemoteFunction, ResourceFunction } from "../../resources/model";

import { GraphqlServiceLinkModel } from "./GraphqlServiceLinkModel";
import { findCallingFunction } from "./link-utils";

interface WidgetProps {
    engine: DiagramEngine,
    link: GraphqlServiceLinkModel
}

export function GraphqlServiceLinkWidget(props: WidgetProps) {
    const { link, engine } = props;

    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [anchorElement, setAnchorElement] = useState<SVGPathElement | HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: undefined, y: undefined });
    const [callingFunction, setCallingFunction] = useState<ResourceFunction | RemoteFunction>(undefined);


    useEffect(() => {
        link.initLinks(engine);

        link.registerListener({
            'SELECT': selectPath,
            'UNSELECT': unselectPath
        });

        if (link.getTargetPort().getNode().getType() === GRAPHQL_SERVICE_NODE) {
            setCallingFunction(findCallingFunction(link.getTargetPort()));
        }
    }, [link]);

    const onMouseOver = (event: React.MouseEvent<SVGPathElement | HTMLDivElement>) => {
        if (callingFunction) {
            setAnchorElement(event.currentTarget);
        }
        selectPath();
    };

    const onMouseLeave = () => {
        if (callingFunction) {
            setAnchorElement(null);
        }
        unselectPath();
    };

    const selectPath = () => {
        link.selectLinkedNodes();
        setIsSelected(true);
    };

    const unselectPath = () => {
        link.resetLinkedNodes();
        setIsSelected(false);
    };


    return (
        <g>
            <polygon
                points={link.getArrowHeadPoints()}
                fill={isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}
            />

            <path
                data-testid={link.getSourcePort().getName() + "-" + link.getTargetPort().getName()}
                id={link.getID()}
                cursor={'pointer'}
                d={link.getCurvePath()}
                fill="none"
                pointerEvents="all"
                onMouseLeave={onMouseLeave}
                onMouseMove={e => callingFunction ? setPosition({ x: e.pageX, y: e.pageY }) : {}}
                onMouseOver={onMouseOver}
                stroke={isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}
                strokeWidth={1}
            />
        </g>
    );
}
