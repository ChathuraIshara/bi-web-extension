/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

export function QueryIcon(props: any) {
    const { onClick, ...restProps } = props;

    const handleOnClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        if (props && onClick) {
            onClick();
        }
    }

    return (
        <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" onClick={handleOnClick}>
            <g id="VSC" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="VSC-icons" transform="translate(-101.000000, -614.000000)" fill="#000000" fillRule="nonzero">
                    <path d="M115,614 L115,626 L110,626 L108,628 L106,626 L101,626 L101,614 L115,614 Z M114,615 L102,615 L102,625 L106.414214,625 L108,626.585 L109.585786,625 L114,625 L114,615 Z M108.5,623 L108.5,624 L107.5,624 L107.5,623 L108.5,623 Z M111.5,616.5 L111.5,620.36038 L108.5,621.36 L108.5,622 L107.5,622 L107.5,620.63962 L110.5,619.639 L110.5,617.5 L105.5,617.5 L105.5,619 L104.5,619 L104.5,616.5 L111.5,616.5 Z" id="query-icon"/>
                </g>
            </g>
        </svg>
    )
}
