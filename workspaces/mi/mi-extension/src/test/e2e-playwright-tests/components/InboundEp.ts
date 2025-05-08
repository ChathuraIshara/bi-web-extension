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

export class InboundEPForm {
    private webView!: Frame;

    constructor(private _page: Page) {
    }

    public async init() {
        const webview = await switchToIFrame(`Inbound EP Form`, this._page)
        if (!webview) {
            throw new Error("Failed to switch to Inbound EP iframe");
        }
        this.webView = webview;
    }

    public async selectType(type: string) {
        const inboundEPSection = await this.webView.waitForSelector(`h2:text("Create new Listener") >> ../..`);
        const inboundTypeBtn = await inboundEPSection.waitForSelector(`div:text("${type}") >> ../../../..`);
        await inboundTypeBtn.click();
        await this.webView.waitForSelector(`span:text("Type:") >> ../../..`);
        await this.webView.waitForSelector(`div:text("${type} Inbound Endpoint") >> ../../..`);
    }

}
