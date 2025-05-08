/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { waitUntilElementIsEnabled } from "../util";
import { By, WebDriver } from "vscode-extension-tester";

export class ProjectOverview {

    static async selectElement(title: string) {
        const overviewElement = await waitUntilElementIsEnabled(By.xpath(`//div[@title='${title}']`));
        await overviewElement.click();
    }

}
