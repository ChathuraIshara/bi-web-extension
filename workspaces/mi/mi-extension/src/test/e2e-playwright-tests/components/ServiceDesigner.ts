/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Frame, Locator, Page, expect } from "@playwright/test";
import { switchToIFrame } from "@wso2-enterprise/playwright-vscode-tester";

export class ServiceDesigner {
    private webView!: Frame;

    constructor(private _page: Page) {
    }

    public async init() {
        const webview = await switchToIFrame("Service Designer", this._page)
        if (!webview) {
            throw new Error("Failed to switch to Service Designer iframe");
        }
        this.webView = webview;
    }

    public async resource(type: string, path: string) {
        const resourceList = this.webView.getByTestId("service-design-view-resource");
        await resourceList.waitFor();
        const resource = resourceList.filter({ hasText: type }).filter({ hasText: path });
        expect(resource).not.toBeNull();

        return new Resource(resource, this.webView);
    }
}

class Resource {
    constructor(private resource: Locator, private webView: Frame) {
    }

    public async click() {
        await this.resource.click();

    }

    public async goToSource() {
        const contextMenu = await this.getContextMenu();
        await contextMenu.getByTestId("context-menu-go-to-source").click();
    };
    public async edit() {
        const contextMenu = await this.getContextMenu();
        await contextMenu.getByTestId("context-menu-edit").click();
    };
    public async delete() {
        const contextMenu = await this.getContextMenu();
        await contextMenu.getByTestId("context-menu-delete").click();
    };

    private async getContextMenu() {
        const menuBtn = this.resource.locator("#component-list-menu-btn");
        await menuBtn.waitFor();
        await menuBtn.click();
        const contextMenu = this.webView.getByLabel("Context Menu");
        await contextMenu.waitFor();
        return contextMenu;
    }
}
