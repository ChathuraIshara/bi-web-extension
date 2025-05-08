import React from 'react';

import Tooltip from "../../components/TooltipV2";

export default function InactiveArray(props: any) {
    const { onClick, toolTipTitle, toolTipContent, ...restProps } = props;

    const toolTip = {
        heading: toolTipTitle,
        content: toolTipContent
    };

    const handleOnClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        if (props && onClick) {
            onClick();
        }
    }

    return (
        <Tooltip type={"heading-content"} text={toolTip} placement="top" arrow={true}>
            <svg width="14px" height="12px" viewBox="0 0 14 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" onClick={handleOnClick} {...restProps}>
                <g id="inactive-array-icon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="inactive-array-VSC-icons" transform="translate(-101.000000, -454.000000)" fill="#C5C5C5">
                        <g id="inactive-array" transform="translate(101.000000, 454.000000)">
                            <path id="inactive-array-path" d="M0.5,0 L0,0.5 L0,11.5 L0.5,12 L3,12 L3,11 L1,11 L1,1 L3,1 L3,0 L0.5,0 Z M13.5,12 L14,11.5 L14,0.5 L13.5,0 L11,0 L11,1 L13,1 L13,11 L11,11 L11,12 L13.5,12 Z"/>
                        </g>
                    </g>
                </g>
            </svg>
        </Tooltip>
    )
}
