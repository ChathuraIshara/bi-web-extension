/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactElement, useEffect, useState } from "react";

import { filterComments } from "../../../Utils";
import { DefaultConfig } from "../../../Visitors/default";
import { DefaultTooltip } from "../DefaultTooltip";

import "./style.scss";

export let STATEMENT_TYPE_WIDTH = 125;
export const ICON_SVG_WRAPPER_WIDTH = 25;

export function StatementTypes(props: { x: number, y: number, key_id: number, statementType: string }) {
    const { key_id, statementType, ...xyProps } = props;
    const [statementTextWidth, setStatementTextWidth] = useState(STATEMENT_TYPE_WIDTH);

    useEffect(() => {
        setStatementTextWidth(document.getElementById("statementLegnth_" + key_id).getBoundingClientRect().width);
    }, []);

    const statementText = filterComments(statementType);
    const statementTypeMaxWidth = 132;
    const statementWidth = statementTextWidth;
    const statmentTypeX = statementTypeMaxWidth - statementWidth;

    const statementRectPadding = 25;
    const statementTextPadding = DefaultConfig.dotGap;
    const statementRectwidth = statementWidth + statementRectPadding;
    const statementRectX = statementTypeMaxWidth - (statementWidth + (statementRectPadding / 4));

    const maxStatementRectX = statementRectwidth + statementTextPadding;

    const statmentTypeMaxWidth = statementText && statementText.length >= 12;
    const statementReactX = statmentTypeMaxWidth ?
        (statementRectX - statementTextPadding) : (statementRectX - statementTextPadding / 2);

    const statementTruncate = statmentTypeMaxWidth && statementText && statementText.slice(0, 10);

    const statementRect: ReactElement = (
        <g className="statement-text-wrapper">
            <rect
                width={statmentTypeMaxWidth ? maxStatementRectX : statementRectwidth}
                height="14"
                rx="4"
                stroke="none"
            />
            <rect
                x={statementReactX - 2}
                y="0"
                width={statmentTypeMaxWidth ? maxStatementRectX : statementRectwidth}
                height="13.25"
                rx="3.625"
                fill="none"
            />
        </g>
    );
    const statementTruncateText: ReactElement = (
        <>
            {statementTruncate}
            <tspan x={statementTruncate + statementTextPadding} y="10" className="dottedText">
                ...
            </tspan>
        </>
    )

    const statementTypeTextGroup: ReactElement = (
        <g>
            <text className="statement-name">

                <tspan
                    x={statmentTypeMaxWidth ? (statmentTypeX - statementTextPadding - 2) : statmentTypeX}
                    id={"statementLegnth_" + key_id}
                    y="10"
                >
                    {statmentTypeMaxWidth ? statementTruncateText : statementText}
                </tspan>
            </text>
            {statementText && statementText.length > 0 && statementRect}
        </g>
    );

    return (
        <svg {...xyProps} width="150" height="24" className="statement-wrapper">
            <DefaultTooltip text={{ heading: statementText }}>{statementTypeTextGroup}</DefaultTooltip>
        </svg>
    );
}
