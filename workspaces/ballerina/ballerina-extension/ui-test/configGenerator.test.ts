/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { expect } from 'chai';
import { existsSync, readFileSync, unlinkSync, writeFile } from 'fs';
import { before, describe, it } from 'mocha';
import { join } from 'path';
import {
    By,
    EditorView,
    TerminalView,
    until,
    VSBrowser,
    WebDriver,
    Workbench
} from 'vscode-extension-tester';
import { areVariablesIncludedInString, waitForBallerina, waitUntil } from './util';
import { ExtendedEditorView } from './utils/ExtendedEditorView';
import { DEFAULT_TIME_OUT } from './constants';


const expectedConfigs = [
    'foo',
    'bar',
    'isAdmin',
    'age',
    'port',
    'height',
    'salary',
    'name',
    'book',
    'switches',
    'ports',
    'rates',
    'colors',
    'person',
    'people',
    'personx',
    'input',
    'peopex',
    'users',
    'userTeams',
    'country',
    'code',
    'data',
    'url',
    'authConfig'
];

describe('VSCode Config Generation UI Tests', () => {
    const PROJECT_ROOT = join(__dirname, '..', '..', 'ui-test', 'data', 'configServicePackage');
    let browser: VSBrowser;
    let driver: WebDriver;
    let workbench: Workbench;

    const configFilePath = `${PROJECT_ROOT}/Config.toml`;
    const gitIgnoreFile = `${PROJECT_ROOT}/.gitignore`;

    before(async () => {
        // Check if the file exists
        if (existsSync(configFilePath)) {
            // If the file exists, delete it
            unlinkSync(configFilePath);
        }

        browser = VSBrowser.instance;
        driver = browser.driver;
        // Close all open tabs
        workbench = new Workbench();
        await new EditorView().closeAllEditors();
        await browser.openResources(PROJECT_ROOT, `${PROJECT_ROOT}/service.bal`);
        await browser.waitForWorkbench();

        await waitForBallerina();
    });

    it('Click on run anyway button to just ignore the config generation', async () => {
        // Open the popup message
        const editorView = new ExtendedEditorView(new EditorView());
        const runBtn = await editorView.getAction("Run");
        await runBtn.click();

        const infoNotification = await waitUntil(By.linkText('Run Anyway'));
        await infoNotification.click();

        // Check if the terminal is open
        await driver.wait(until.elementIsVisible(new TerminalView()), DEFAULT_TIME_OUT);
        const terminal = await browser.driver.findElement(By.className('xterm'));
        expect(await terminal.isDisplayed()).to.be.true;

    });

    it('Click on run button to generate the config file', async () => {
        const editorView = new ExtendedEditorView(new EditorView());
        expect(await editorView.getAction("Run")).is.not.undefined;
        (await editorView.getAction("Run"))!.click();

        const infoNotification = await waitUntil(By.linkText('Create Config.toml'));
        await infoNotification.click();

        await waitUntil(By.xpath("//*[contains(text(), 'Successfully updated')]"));

        // Check if the config file has been generated
        expect(existsSync(configFilePath)).to.be.true;

        // Read the generated config file and expected config file
        const generatedConfigContent = readFileSync(configFilePath, 'utf8').replace(/\s/g, '');

        // Compare the generated config file with the expected config file
        expect(areVariablesIncludedInString(expectedConfigs, generatedConfigContent)).to.true;

    });

    after(async () => {
        // Check if the file exists
        if (existsSync(configFilePath)) {
            // If the file exists, delete it
            unlinkSync(configFilePath);
        }

        const gitIgnoreContent = `target/\n.vscode/\n`;
        writeFile(gitIgnoreFile, gitIgnoreContent, (err) => {
            if (err) {
                console.error('Error updating gitIgnore file:', err);
            } else {
                console.log('gitIgnore file updated successfully!');
            }
        });
    });
});
