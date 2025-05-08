/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

interface HeaderWrapperProps {
    children?: JSX.Element[] | JSX.Element;
    className: string;
    onClick: () => void;
}

export function HeaderWrapper(props: HeaderWrapperProps) {
    const { className, onClick } = props;

    const handleOnClick = (evt: React.MouseEvent) => {
        if (!evt.isPropagationStopped()) {
            onClick();
        }
    }

    return (
        <div className={className} onClick={handleOnClick}>
            {props.children}
        </div>
    );
}
