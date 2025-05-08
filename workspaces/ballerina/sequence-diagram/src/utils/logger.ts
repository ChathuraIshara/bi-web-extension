/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum ConsoleColor {
    RED = "red",
    BLUE = "blue",
    GREEN = "green",
    YELLOW = "yellow",
    ORANGE = "orange",
    PURPLE = "purple",
    PINK = "pink",
    GRAY = "gray",
    AUTO = "auto",
}

export function logger(message: string, color?: ConsoleColor, ...params: any[]) {
    // return; // Comment this line to enable logging

    if (color === ConsoleColor.AUTO) {
        console.log(`>>> ${message}`, ...params);
        return;
    }

    const logStyle = color ? `color: ${color};` : "";
    console.log(`>>> %c${message}`, logStyle, ...params);
}
