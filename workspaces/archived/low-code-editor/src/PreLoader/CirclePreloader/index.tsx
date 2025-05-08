/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export interface CirclePreloaderProps {
    position: "relative" | "absolute";
};

export function CirclePreloader(props: CirclePreloaderProps) {
    const { position } = props;

    const loaderPosition = (position === "relative") ?  cn("preloader-circle-relative") : cn("preloader-circle-absolute");

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
            <Lottie options={defaultOptions} height={`32px`} width={`32px`} />
        </div>
    );
}
