/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode, useContext, useEffect, useState } from "react";

import { STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Context/diagram";
import { ErrorSnippet } from "../../../Types/type";
import { DefaultTooltip } from "../DefaultTooltip";

interface ReturnRectSVGProps {
    type?: string,
    className?: string,
    onClick?: () => void,
    text?: { heading?: string, content?: string, example?: string, code?: string },
    diagnostic?: ErrorSnippet,
    icon?: ReactNode;
    model: STNode;
}


export function ReturnRectSVG(props: ReturnRectSVGProps) {
    const { type, onClick, diagnostic, text, model } = props;
    const diagnosticStyles = diagnostic?.severity === "ERROR" ? "return-comp-error" : "return-comp-warning";
    const returnRectStyles = diagnostic.diagnosticMsgs ? diagnosticStyles : "return-comp";
    const diagramContext = useContext(Context);
    const showTooltip = diagramContext?.api?.edit?.showTooltip;
    const [tooltipComp, setTooltipComp] = useState(undefined);
    let sourceSnippet;
    if (model) {
        sourceSnippet = model?.source?.trim();
    }

    const rectSVG = (
        <g className={returnRectStyles} transform="translate(8 6)">
            <g transform="matrix(1, 0, 0, 1, -14, -9)">
                <g id="Rectangle-2" transform="translate(7 6)">
                    <rect width="82" height="32" rx="16" stroke="none" />
                    <rect x="-0.5" y="-0.5" width="83" height="33" rx="16.5" fill="none" className="click-effect" />
                </g>
            </g>
            <g>
                <text transform="translate(26 17)" >
                    <tspan x="0" y="0">return</tspan>
                </text>
                <g id="returnIcon" transform="translate(17 10)" className="return-icon">
                    <path d="M-3.5,0-7,4H0Z" transform="translate(-11 -0.5) rotate(-90)" />
                    <path d="M-7,.5H0" transform="translate(0 3)" />
                </g>
            </g>
        </g>
    );

    const defaultTooltip = (
        <DefaultTooltip text={sourceSnippet}>{rectSVG}</DefaultTooltip>
    );

    useEffect(() => {
        if (model && showTooltip) {
            setTooltipComp(showTooltip(rectSVG, undefined, onClick, model));
        }
    }, [model]);

    return (
        <>
            {tooltipComp ? tooltipComp : defaultTooltip}
        </>
    );
}
