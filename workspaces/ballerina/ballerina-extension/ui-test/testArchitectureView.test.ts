/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs';
import { before, describe, it } from 'mocha';
import { join } from 'path';
import { EditorView, VSBrowser, Workbench } from 'vscode-extension-tester';


import { wait } from './util';
import { ExtendedAcrchitectureDiagram } from './utils/ExtendedArchitectureDiagram';

describe('VSCode architecture diagram Webview UI Tests', () => {
    const SAMPLE_PROJECT = join(__dirname, '..', '..', 'ui-test', 'data', "achitectureDiagram", "SampleProject");
    const TEMP_DIR = join(__dirname, '..', '..', 'ui-test', 'data', "achitectureDiagram", "SampleProjectTemp");
    const WORSPACE_FILE = join(TEMP_DIR, "SampleProject.code-workspace");
    const SERVICE_FILE = join(TEMP_DIR, "HTTPService", "service.bal");
    let browser: VSBrowser;
    let workbench: Workbench;
    let arcDiagram: ExtendedAcrchitectureDiagram;
    let arcEditorView: EditorView;

    before(async () => {
        workbench = new Workbench();
        browser = VSBrowser.instance;
        try {
            rmSync(TEMP_DIR, { recursive: true, force: true });
            copyFolderSync(SAMPLE_PROJECT, TEMP_DIR);
            await browser.driver.sleep(5000);
        }  catch (error) {
            console.error('Copy Error:', error);
        }
        await browser.openResources(WORSPACE_FILE, SERVICE_FILE);
        await browser.waitForWorkbench();
        arcEditorView = new EditorView();
    });

    it('Open the architecture diagram and Check for rendered diagram', async () => {
        arcDiagram = new ExtendedAcrchitectureDiagram(arcEditorView);
        await arcDiagram.openDigaram(workbench, browser);
        await arcDiagram.getItem("service-head-HTTPService Component", 100000);
        await arcDiagram.getItem("service-link-HTTPService Component-GraphQlService");
        await arcDiagram.getItem("service-head-GraphQlService");
    });

    it('Add GraphQl Service', async () => {
        await arcDiagram.clickItemById("add-component-btn");
        await arcDiagram.typeTest("component-name-input", "GQL");
        await arcDiagram.selectDropdownItem("component-type-select", browser, "GraphQL");
        await arcDiagram.clickCreateBtn("component-create-button");
        await arcDiagram.getItem("service-head-GQL", 100000);
    });

    it('Add Main component', async () => {
        await arcDiagram.clickItemById("add-component-btn");
        await arcDiagram.typeTest("component-name-input", "MainComp");
        await arcDiagram.selectDropdownItem("component-type-select", browser, "Main");
        await arcDiagram.clickCreateBtn("component-create-button");
        await arcDiagram.getItem("entry-node-Maincomp", 100000);
    });

    it('Add HTTP component', async () => {
        await arcDiagram.clickItemById("add-component-btn");
        await arcDiagram.typeTest("component-name-input", "HTTPComp");
        await arcDiagram.selectDropdownItem("component-type-select", browser, "HTTP");
        await arcDiagram.clickCreateBtn("component-create-button");
        await arcDiagram.getItem("service-head-HTTPComp", 100000);
    });
});

function copyFolderSync(sourceDir, targetDir) {
    // Create the target directory if it doesn't exist
    if (!existsSync(targetDir)) {
        mkdirSync(targetDir);
    }

    // Read the contents of the source directory
    const files = readdirSync(sourceDir);

    // Copy each file and subdirectory
    files.forEach(file => {
        const sourceFilePath = join(sourceDir, file);
        const targetFilePath = join(targetDir, file);

        // Check if the file is a directory
        if (statSync(sourceFilePath).isDirectory()) {
            copyFolderSync(sourceFilePath, targetFilePath);
        } else {
            copyFileSync(sourceFilePath, targetFilePath);
        }
    });
}
