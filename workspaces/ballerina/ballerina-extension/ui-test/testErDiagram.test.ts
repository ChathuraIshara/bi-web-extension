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


import { switchToIFrame, wait } from './util';
import { ExtendedEditorView } from './utils/ExtendedEditorView';
import { ExtendedERView } from './utils/ExtendedERView';

describe('VSCode er diagram Webview UI Tests', () => {
    const TEST_PROJECT = join(__dirname, '..', '..', 'ui-test', 'data', "erDiagram", "greeter", "persist");
    const WORSPACE_FILE = join(TEST_PROJECT, "model.bal");
    let browser: VSBrowser;
    let workbench: Workbench;
    let editor: EditorView;
    let erEditor: ExtendedERView;

    before(async () => {
        workbench = new Workbench();
        browser = VSBrowser.instance;
        await browser.openResources(TEST_PROJECT, WORSPACE_FILE);
        await browser.waitForWorkbench();
        editor = new EditorView();
    });

    it('Open the er diagram', async () => {
        erEditor = new ExtendedERView(editor);
        await erEditor.waitForDiagram(workbench, browser);
    });

    it('Check for rendered components', async () => {
        // Check nodes
        await erEditor.getNodes("entity-head-Employee", 50000);
        await erEditor.getNodes("entity-head-Employee2");
        await erEditor.getNodes("entity-head-Workspace");
        await erEditor.getNodes("entity-head-Building");
        await erEditor.getNodes("entity-head-Building2");
        await erEditor.getNodes("entity-head-Department");
        await erEditor.getNodes("entity-head-Department2");
        await erEditor.getNodes("entity-head-Team");
        await erEditor.getNodes("entity-head-Team2");

        // Check links
        await erEditor.getLinks("right-$anon/.:0.0.0:Workspace/location2::left-$anon/.:0.0.0:Building2");
        await erEditor.getLinks("right-$anon/.:0.0.0:Workspace/location::left-$anon/.:0.0.0:Building");
        await erEditor.getLinks("right-$anon/.:0.0.0:Employee2/team::left-$anon/.:0.0.0:Team");
        await erEditor.getLinks("right-$anon/.:0.0.0:Employee2/department::left-$anon/.:0.0.0:Department");
    });

});
