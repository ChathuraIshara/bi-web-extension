/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import Lottie from 'react-lottie';

import cn from "classnames";

import animationData from './data.json';
import './styles.scss'

export interface TextPreloaderVerticalProps {
    position: "relative" | "absolute" | "fixedMargin";
}

export function TextPreloaderVertical(props: TextPreloaderVerticalProps) {
    const { position } = props;

    let loaderPosition = (position === "relative") ?
        cn("TextVerticalPreloader-wrapper-relative") : cn("TextVerticalPreloader-wrapper-absolute");
    switch (position) {
        case "absolute":
            loaderPosition = "TextVerticalPreloader-wrapper-absolute";
            break;
        case "relative":
            loaderPosition = "TextVerticalPreloader-wrapper-absolute";
            break;
        case "fixedMargin":
            loaderPosition = "TextVerticalPreloader-wrapper-fixed-margin";
            break;
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className={loaderPosition}>
            <Lottie options={defaultOptions} height={`100%`} width={`100%`} />
        </div>
    );
}
