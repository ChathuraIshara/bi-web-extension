/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { waitUntil } from "../util";
import { By, TreeItem } from "vscode-extension-tester";

export class ExtendedCustomViewItem {
    treeItem: TreeItem;

    constructor(treeItem: TreeItem) {
        this.treeItem = treeItem;
    }

    async getActionButton(title: string) {
        const element = By.xpath("//li[@title='" + title + "']");
        await waitUntil(element);
        return await this.treeItem.findElement(element);
    }
}
