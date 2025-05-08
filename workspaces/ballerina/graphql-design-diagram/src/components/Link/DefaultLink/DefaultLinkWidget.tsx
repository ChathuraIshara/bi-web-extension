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

import { DefaultLinkModel } from "./DefaultLinkModel";


interface WidgetProps {
    engine: DiagramEngine,
    link: DefaultLinkModel
}

export function DefaultLinkWidget(props: WidgetProps) {
    const { link, engine } = props;

    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        link.initLinks(engine);

        link.registerListener({
            'SELECT': selectPath,
            'UNSELECT': unselectPath
        });

    }, [link]);

    const onMouseOver = (event: React.MouseEvent<SVGPathElement | HTMLDivElement>) => {
        selectPath();
    };

    const onMouseLeave = () => {
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
                onMouseOver={onMouseOver}
                stroke={isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}
                strokeWidth={1}
            />
        </g>
    );
}
