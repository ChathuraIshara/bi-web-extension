/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Frame, Page } from "@playwright/test";
import { switchToIFrame } from "@wso2-enterprise/playwright-vscode-tester";

export class ConnectorStore {
    private webView!: Frame;

    constructor(private _page: Page, private type: 'Connector Store Form' | 'Resource View') {
    }

    public async init() {
        const webview = await switchToIFrame(`${this.type}`, this._page)
        if (!webview) {
            throw new Error("Failed to switch to Connector Store iframe");
        }
        this.webView = webview;
    }

    public async add(artifactType: string) {
        const createIntegrationSection = await this.webView.waitForSelector(`h3:text("Create an Integration") >> ..`);
        const viewMoreBtn = await createIntegrationSection.waitForSelector(`p:text("View More") >> ..`);
        await viewMoreBtn.click();
        const btn = await createIntegrationSection.waitForSelector(`div:text("${artifactType}") >> ../../../..`);
        await btn.click();
    }

    public async search(str: string) {
        const searchInput = this.webView.locator("input");
        await searchInput.type(str);
    }

    public async selectConnector(connectorName: string) {
        const connectorSection = await this.webView.waitForSelector(`h2:text("Add New Connection") >> ../..`);
        const connectorBtn = await connectorSection.waitForSelector(`div:text("${connectorName}") >> ../../../..`);
        await connectorBtn.click();
        await this.webView.waitForSelector(`span:text("Connector:") >> ../../..`);
        await this.webView.waitForSelector(`div:text("${connectorName.toLowerCase()}") >> ../../..`);
    }

}
