/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { wait } from "../util";
import { By, WebElement, WebView } from "vscode-extension-tester";
import { DEFAULT_UI_LOAD_TIME } from "../constants";

let webview: WebView;
let currentElement: WebElement;

export class Service {
    constructor(element) {
        webview = element;
    }

    async getHeader() {
        await wait(DEFAULT_UI_LOAD_TIME);
        currentElement = await webview.findWebElement(By.className("service-header"));
        return this;
    }

    async getServiceOptions() {
        await wait(DEFAULT_UI_LOAD_TIME);
        currentElement = (await currentElement.findElements(By.className("amendment-option")))[0];
        return this;
    }

    async getRun() {
        await wait(DEFAULT_UI_LOAD_TIME);
        currentElement = await webview.findWebElement(By.id("run-button"));
        return this;
    }

    async getTryIt() {
        await wait(DEFAULT_UI_LOAD_TIME);
        currentElement = await webview.findWebElement(By.id("try-button"));
        return this;
    }

    async click() {
        await currentElement.click();
        return this;
    }
}
