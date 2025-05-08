/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

interface CtrlClickWrapperProps {
    onClick: () => void;
}

// Wrapper to capture ctrl click action of children and run an action that's passed through props
export const CtrlClickWrapper = (props: React.PropsWithChildren<CtrlClickWrapperProps>) => {
    const { children, onClick } = props;
    const handleClick = (e: any) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        }
    };

    const mappedChildren = React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {
            onClick: handleClick
        });
    });

    return (
        <>
            {mappedChildren}
        </>
    );
}
