/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from "react";

export const SHOW_FUNCTION_SVG_WIDTH_WITH_SHADOW = 20;
export const SHOW_FUNCTION_SVG_HEIGHT_WITH_SHADOW = 20;

export function HideFunctionSVG(props: {
  x: number;
  y: number;
  ref?: any;
}) {
  const { ...xyProps } = props;
  const center = SHOW_FUNCTION_SVG_WIDTH_WITH_SHADOW / 2;
  return (
    <svg
      {...xyProps}
      width={SHOW_FUNCTION_SVG_WIDTH_WITH_SHADOW}
      height={SHOW_FUNCTION_SVG_HEIGHT_WITH_SHADOW}
    >
      <g id="Expand-Button" className="expand-close-circle expand-click">
        <circle
          cx={center}
          cy={center}
          r="6.5"
        />
        <path
          transform="rotate(-90, 10.3125, 10)"
          d="m8.05499,8.53068c0.1195,-0.13327 0.30648,-0.14538 0.43826,-0.03635l0.03775,0.03635l1.78151,1.98668l1.78151,-1.98668c0.1195,-0.13327 0.30648,-0.14538 0.43826,-0.03635l0.03775,0.03635c0.1195,0.13327 0.13036,0.34181 0.03259,0.48876l-0.03259,0.04211l-2.25751,2.51772l-2.25751,-2.51772c-0.13144,-0.14659 -0.13144,-0.38428 0,-0.53087z"
          className="expand-icon"
          id="Icon-Path"
        />
      </g>
    </svg>
  );
}
