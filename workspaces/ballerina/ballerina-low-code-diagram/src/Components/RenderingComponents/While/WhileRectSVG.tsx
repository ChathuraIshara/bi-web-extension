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
interface WhileRectSVGProps {
    type?: string,
    className?: string,
    onClick?: () => void,
    text?: { heading?: string, content?: string, example?: string, code?: string },
    diagnostic?: ErrorSnippet,
    icon?: ReactNode;
    model: STNode
}

export function WhileRectSVG(props: WhileRectSVGProps) {
    const { onClick, diagnostic, model } = props;
    const diagnosticStyles = diagnostic?.severity === "ERROR" ? "while-block-error" : "while-block-warning";
    const whileRectStyles = diagnostic?.diagnosticMsgs ? diagnosticStyles : "while-block";
    const diagramContext = useContext(Context);
    const showTooltip = diagramContext?.api?.edit?.showTooltip;
    const [tooltipComp, setTooltipComp] = useState(undefined);
    let sourceSnippet;
    if (model) {
        sourceSnippet = model?.source?.trim().split('{')[0];
    }

    const rectSVG = (
        <g id="While" className={whileRectStyles} transform="translate(7 6)">
            <g transform="matrix(1, 0, 0, 1, -7, -6)">
                <g className="while-polygon" id="WhilePolygon" transform="translate(33.5, 3) rotate(45)">
                    <rect width="40.903" className="while-rect" height="40.903" rx="6" stroke="none" />
                    <rect x="0.5" y="0.5" className="while-rect click-effect" width="39.903" height="39.903" rx="5.5" fill="none" />
                </g>
            </g>
            <g id="while_icon" className="while-icon" transform="translate(16.5, 18)">
                <path
                    className="while-rect-icon-path"
                    d="M19,12 C19.5522847,12 20,12.4477153 20,13 C20,13.5128358 19.6139598,13.9355072 19.1166211,13.9932723 L19,14 L11,14 C10.4477153,14 10,13.5522847 10,13 C10,12.4871642 10.3860402,12.0644928 10.8833789,12.0067277 L11,12 L19,12 Z"
                    id="Path-23"
                />
                <path
                    className="while-rect-icon-combined-shape"
                    d="M8,-2.38742359e-12 C12.418278,-2.38661197e-12 16,3.581722 16,8 L15.994,8.09 L18.2928932,5.79289322 C18.6834175,5.40236893 19.3165825,5.40236893 19.7071068,5.79289322 C20.0675907,6.15337718 20.0953203,6.72060824 19.7902954,7.11289944 L19.7071068,7.20710678 L15.0006268,11.9135867 L10.2935206,7.2148224 C9.90265013,6.82464462 9.90208859,6.19147989 10.2922664,5.8006094 C10.6524305,5.43980587 11.2196367,5.41157328 11.6121983,5.71625013 L11.7064794,5.79935516 L14.0044334,8.0947841 C14.0015,8.0635841 14,8.03196722 14,8 C14,4.6862915 11.3137085,2 8,2 C4.6862915,2 2,4.6862915 2,8 C2,11.3137085 4.6862915,14 8,14 C8.55228475,14 9,14.4477153 9,15 C9,15.5522847 8.55228475,16 8,16 C3.581722,16 -3.55271368e-15,12.418278 0,8 C0,3.581722 3.581722,-2.38823522e-12 8,-2.38742359e-12 Z"
                    id="Combined-Shape"
                />
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
