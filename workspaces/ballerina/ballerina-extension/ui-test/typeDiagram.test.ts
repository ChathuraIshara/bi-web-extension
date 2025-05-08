/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { before, describe, it } from 'mocha';
import { join } from 'path';
import { EditorView, VSBrowser, Workbench } from 'vscode-extension-tester';


import { ExtendedTypeDiagram } from './utils/ExtendedTypeDiagram';

describe('VSCode type diagram Webview UI Tests', () => {
    const TEST_PROJECT = join(__dirname, '..', '..', 'ui-test', 'data', "typeDiagram", "greeter");
    const WORSPACE_FILE = join(TEST_PROJECT, "greeter.code-workspace");
    const SERVICE_FILE = join(TEST_PROJECT, "service.bal");
    let editor: EditorView;
    let browser: VSBrowser;
    let workbench: Workbench;
    let typeDiagram: ExtendedTypeDiagram;
    let typeEditorView: EditorView;


    before(async () => {
        workbench = new Workbench();
        browser = VSBrowser.instance;
        await browser.openResources(WORSPACE_FILE, SERVICE_FILE);
        await browser.waitForWorkbench();
        typeEditorView = new EditorView();
        typeDiagram = new ExtendedTypeDiagram(typeEditorView);
    });

    it('Open the type diagram', async () => {
        await typeDiagram.openDigaram(workbench, browser);
        await typeDiagram.clickItem("type-switcher", 20000);
        await typeDiagram.clickItem("Types");
    });

    it('Check for rendered components', async () => {
        await typeDiagram.getItems("entity-head-Order");
        await typeDiagram.getItems("entity-head-Customer");
        await typeDiagram.getItems("entity-head-LineItemOrder");

        await typeDiagram.getItems("entity-link-Order-Customer");
        await typeDiagram.getItems("entity-link-Order-LineItemOrder");
    });
});
