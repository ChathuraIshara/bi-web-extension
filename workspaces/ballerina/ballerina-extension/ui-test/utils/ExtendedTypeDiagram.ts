/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { switchToIFrame, waitUntil } from "../util";
import { By, EditorView, VSBrowser, Workbench } from "vscode-extension-tester";
import { ExtendedEditorView } from "./ExtendedEditorView";

export class ExtendedTypeDiagram {
    editorView: EditorView;

    constructor(treeItem: EditorView) {
        this.editorView = treeItem;
    }

    async getItems(testId: string, timeout: number = 15000) {
        const employeePath = By.xpath(`//*[@data-testid="${testId}"]`);
        return await waitUntil(employeePath, timeout);
    }

    async openDigaram(workbench: Workbench, browser: VSBrowser) {
        await browser.waitForWorkbench();
        const extdEditor = new ExtendedEditorView(this.editorView);
        await extdEditor.getCodeLens('Visualize');
        await workbench.executeCommand("Ballerina: Architecture View");
        await switchToIFrame('Architecture View', browser.driver);
    }

    async clickItem(testId: string, timeout: number = 15000) {
        const item = await this.getItems(testId, timeout);
        await item.click();
    }
}
