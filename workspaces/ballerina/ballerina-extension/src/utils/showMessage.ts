/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { window } from "vscode";

export enum MESSAGE_TYPE {
    ERROR,
    WARNING,
    INFO,
    CLICKABLE_INFO,
    IGNORE
}

const DONT_SHOW = "Don't show again!";
const AVOIDED: string[] = [];

/**
 * Show vs code message popup.
 * @param message Message to display
 * @param type Message type
 * @param isIgnorable Is ignorable message
 */
export function showMessage(message: string, type: MESSAGE_TYPE, isIgnorable: boolean, filePath?: string, fileContent?: string, callBack?: (filePath: string, fileContent: string) => void) {
    if (AVOIDED.includes(message) || message === 'IGNORE') {
        return;
    }

    const button: string[] = isIgnorable ? [DONT_SHOW] : [];
    switch (type) {
        case MESSAGE_TYPE.ERROR: {
            window.showErrorMessage(message, ...button).then((response) => {
                addToAvoidList(response, message);
            });
            break;
        }
        case MESSAGE_TYPE.WARNING: {
            window.showWarningMessage(message, ...button).then((response) => {
                addToAvoidList(response, message);
            });
            break;
        }
        case MESSAGE_TYPE.INFO: {
            window.showInformationMessage(message, ...button).then((response) => {
                addToAvoidList(response, message);
            });
            break;
        }
        case MESSAGE_TYPE.CLICKABLE_INFO: {
            window.showInformationMessage(message, 'Resolve').then((response) => {
                if (response === "Resolve" && callBack && filePath && fileContent) {
                    callBack(filePath, fileContent);
                }
            });
            break;
        }
        case MESSAGE_TYPE.IGNORE: {
            break;
        }
    }
}

function addToAvoidList(response, message) {

    if (response === DONT_SHOW) {

        AVOIDED.push(message);
    }
}
