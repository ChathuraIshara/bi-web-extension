/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { waitUntil } from "../util";
import { By, WebView } from "vscode-extension-tester";

export class GraphqlTryItView {
    graphqlView: WebView;

    constructor(treeItem: WebView) {
        this.graphqlView = treeItem;
    }

    async clickExplorer() {
        const explorerSelector = By.xpath("//button[@title='Toggle Explorer']");
        const explorerBtn = await waitUntil(explorerSelector, 10000);
        await explorerBtn.click();
    }

    async selectQueryVariable() {
        const allBtnSelector = By.className("graphiql-explorer-field-view");
        const allBtn = await waitUntil(allBtnSelector);
        await allBtn.click();

        const querySelector = By.xpath("//div[@class='graphiql-explorer-node graphiql-explorer-active']//span");
        const queryBtn = await waitUntil(querySelector, 10000);
        await queryBtn.click();
    }

    async verifyQueryGeneration() {
        await waitUntil(By.xpath("//section[@class='query-editor']//span[@class='cm-property']"), 10000);
    }

    async execute() {
        const executeBtnSelector = By.xpath("//button[@class='execute-button']");
        const executeBtn = await waitUntil(executeBtnSelector, 10000);
        await executeBtn.click();
    }

    async getResponse() {
        const activeSelector = By.xpath("//span[@class='cm-number']");
        const activeResponse = await waitUntil(activeSelector, 10000);
        const response = await activeResponse.getText();
        return response;
    }
}
