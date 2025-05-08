/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

export default function ExpandButton(props: any) {
  const { onClick, ...restProps } = props;

  const handleOnClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    if (props && onClick) {
      onClick();
    }
  };

  return (
    <svg
      id="expand-button"
      width="13"
      height="13"
      onClick={handleOnClick}
      {...restProps}
    >
      <g>
      <polygon id="svg_2" points="5.347127824185009,6.920349611245911 1.1123937246215974,11.155083922494669 1.1123937246215974,8.827177343628136 0,8.827177343628136 0,13.054086635478598 4.226910703086105,13.054086635478598 4.226910703086105,11.941694251530862 1.898930316595397,11.941694251530862 6.133702025588718,7.706922683661105 "/>
   <polygon id="svg_3" points="8.827177343628136,0 8.827177343628136,1.1123937246215974 11.155083922494669,1.1123937246215974 6.920311790130654,5.347201772932749 7.706885427040106,6.13373871771546 11.941694251530862,1.8989672909692672 11.941694251530862,4.226910703086105 13.054086635478598,4.226910703086105 13.054086635478598,0 "/>
      </g>
    </svg>
  );
}
