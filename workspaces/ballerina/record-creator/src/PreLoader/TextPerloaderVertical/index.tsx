/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import Lottie from "react-lottie";

import animationData from "./data.json";
import { useStyles } from "./style";

export interface TextPreloaderVerticalProps {
    position: "relative" | "absolute";
}

export function TextPreloaderVertical(props: TextPreloaderVerticalProps) {
    const { position } = props;
    const classes = useStyles();

    const loaderPosition =
        position === "relative"
            ? classes.textVerticalPreloaderWrapperRelative
            : classes.textVerticalPreloaderWrapperAbsolute;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className={loaderPosition} data-testid={"test-preloader-vertical"}>
            <Lottie options={defaultOptions} height={`100%`} width={`100%`} />
        </div>
    );
}
