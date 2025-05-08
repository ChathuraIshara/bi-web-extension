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

export interface TextPreLoaderProps {
    position: "relative" | "absolute";
    text?: string;
};

export function TextPreLoader(props: TextPreLoaderProps) {
    const { position, text = 'Loading...' } = props;

    const loaderPosition = (position === "relative") ? cn("preloader-wrapper-relative") : cn("preloader-wrapper-absolute");

    return (
        <div data-testid={"diagram-loader"} className={loaderPosition}>
            <div className="loader-container">
                <div className="loader-circle"/>
                <div className="loader-text">{text}</div>
            </div>
        </div>
    );
}
