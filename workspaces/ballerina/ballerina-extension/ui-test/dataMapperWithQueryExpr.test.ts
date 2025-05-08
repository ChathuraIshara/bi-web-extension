/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: no-unused-expression
import { before, describe, it } from 'mocha';
import { join } from 'path';
import { By, VSBrowser, WebView, EditorView, TextEditor, WebDriver, TerminalView } from 'vscode-extension-tester';
import { clickOnActivity,switchToIFrame, wait } from './util';
import { EXPLORER_ACTIVITY } from "./constants";
import { ExtendedEditorView } from "./utils/ExtendedEditorView";
import { expect } from "chai";
import { DataMapper } from "./utils/DataMapper";
import { ProjectOverview } from "./utils/ProjectOverview";

describe('VSCode Data mapper Webview UI Tests', () => {
    const PROJECT_ROOT = join(__dirname, '..', '..', 'ui-test', 'data');
    const FILE_NAME = 'data_mapper.bal';
    let ORIGINAL_CONTENT = '';
    let webview: WebView;
    let browser: VSBrowser;
    let driver: WebDriver;
    const EXPECTED_TRANSFORM_FUNCTION = `function transform2(Input input) returns Output => {
        Assets: from var AssetsItem in input.Assets
            select {
                Type: AssetsItem.Type + AssetsItem.Id,
                Id: ,
                Confirmed:
            }
    };
    `;

    before(async () => {
        const editorView = new EditorView();
        await editorView.closeAllEditors();
        const terminalView = new TerminalView();
        await terminalView.killTerminal();

        browser = VSBrowser.instance;
        driver = browser.driver;
        await browser.openResources(PROJECT_ROOT, `${PROJECT_ROOT}/${FILE_NAME}`);
        await clickOnActivity(EXPLORER_ACTIVITY);

        ORIGINAL_CONTENT = await new TextEditor().getText();
    });

    it('Open data mapper using project overview', async () => {
        // Click on show diagram button
        const extendedEditorView = new ExtendedEditorView(new EditorView());
        expect(await extendedEditorView.getAction("Show Diagram")).is.not.undefined;
        const showDiagram = await extendedEditorView.getAction("Show Diagram");
        await showDiagram!.click();

        // Wait for the data mapper to load
        await switchToIFrame('Overview Diagram', driver);

        await ProjectOverview.selectElement('transform2');

        await DataMapper.waitTillLinkRender('input.Assets', 'Output.Assets');
        await DataMapper.fitToScreen();
    });

    it('Create mapping using query expression', async () => {
        await DataMapper.clickOnConvertToQuery('input.Assets', 'Output.Assets');
    });

    it('Navigate into query expression', async () => {
        await DataMapper.navigateIntoQueryExpr('Output.Assets');
        await DataMapper.waitTillInputsAndOutputRender(['expandedQueryExpr.source.AssetsItem'], 'mappingConstructor');
    });

    it('Create mapping within query expression', async () => {
        // Create mapping between input field and output field
        webview = new WebView();
        await DataMapper.createMappingUsingPorts(webview, 'expandedQueryExpr.source.AssetsItem.Type', 'Type');

        // This wait is required to enable clicking on another field for creating another mapping
        await wait(1000);

        // Create another mapping to the same output field
        await DataMapper.createMappingUsingFields(webview, 'expandedQueryExpr.source.AssetsItem.Id', 'Type');

        // Wait for the mapping change to take place
        await DataMapper.shouldVisibleLinkConnector(['AssetsItem.Type', 'AssetsItem.Id']);
    });

    it('Verify data mapper generated code is correct', async () => {
        await webview.switchBack();

        await new EditorView().openEditor(FILE_NAME);

        // Check if generated code equals expected code
        const text = await new TextEditor().getText();
        expect(text.replace(/\s/g, '')).to.include(EXPECTED_TRANSFORM_FUNCTION.replace(/\s/g, ''));
    });

    after(async () => {
        await webview.switchBack();

        await new EditorView().openEditor(FILE_NAME);

        // Revert content back to the original state
        const textEditor = new TextEditor();

        await textEditor.setText(ORIGINAL_CONTENT);
        await textEditor.save();
    });
});
