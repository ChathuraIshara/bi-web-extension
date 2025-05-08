/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { waitUntil, waitUntilElementIsEnabled } from "../util";
import { By, VSBrowser, until } from "vscode-extension-tester";

export class ServiceDesigner {

    static async waitForServiceDesigner() {
        const serviceDesignView = By.xpath("//*[@data-testid='service-design-view']");
        await waitUntil(serviceDesignView, 30000);
    }

    static async clickAddResource(webview) {
        const driver = VSBrowser.instance.driver;
        // Click on add new resource button
        const addResourceBtn = await webview.findWebElement(By.xpath("//*[@data-testid='add-resource-btn']"));
        await addResourceBtn.click();

        // Wait for resource form
        const resourceForm = By.xpath("//*[@data-testid='resource-form']");
        await waitUntil(resourceForm, 30000);

        const resourceSaveBtn = By.xpath("//*[@data-testid='save-btn']");
        waitUntilElementIsEnabled(resourceSaveBtn);

    }

}
