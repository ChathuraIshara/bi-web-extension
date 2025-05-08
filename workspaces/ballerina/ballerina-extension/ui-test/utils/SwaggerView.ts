/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { waitForMultipleElementsLocated, waitUntil, waitUntilTextContains } from "../util";
import { By, WebView, WebDriver } from "vscode-extension-tester";

export class SwaggerView {
    swaggerView: WebView;

    constructor(treeItem: WebView) {
        this.swaggerView = treeItem;
    }

    async expandGet() {
        await waitUntil(By.className("operation-tag-content"), 30000 );
        const operationTag = By.className("operation-tag-content");
        const getTab = await this.swaggerView.findWebElement(operationTag);
        await getTab.click();
    }

    async clickTryItOut(driver: WebDriver) {
        const tryItOutButton = By.className("try-out__btn");
        await waitForMultipleElementsLocated([tryItOutButton]);
        const tryIt = (await this.swaggerView.findWebElements(By.className("try-out__btn")))[0];
        await tryIt.click();
    }

    async clickExecute() {
        const execute = (await this.swaggerView.findWebElements(By.className("opblock-control__btn")))[0];
        await execute.click();
    }

    async getResponse() {
        await waitUntil(By.className("highlight-code"), 30000 );
        const codeBlock = await this.swaggerView.findWebElement(By.className("highlight-code"));
        const responseBox = await codeBlock.findElement(By.css("code"));
        const response = await responseBox.findElement(By.css("span"));
        return response.getText();
    }
}
