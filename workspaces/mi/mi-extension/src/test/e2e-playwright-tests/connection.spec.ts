/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { test, expect } from '@playwright/test';
import * as path from 'path';
import { Form } from './components/Form';
import { AddArtifact } from './components/AddArtifact';
import { ConnectorStore } from './components/ConnectorStore';
import { closeNotification, createProject, initVSCode, newProjectPath, page, resourcesFolder } from './Utils';
import { Overview } from './components/Overview';
const fs = require('fs');

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    console.log('Starting connection tests')
    // delete and recreate folder
    if (fs.existsSync(newProjectPath)) {
        fs.rmSync(newProjectPath, { recursive: true });
    }
    fs.mkdirSync(newProjectPath, { recursive: true });
    await initVSCode();
});

test.skip('Create new project', async () => {
    await createProject(page);
});

test.skip('Create new Connection', async () => {
    // Create connection
    const addArtifactPage = new AddArtifact(page.page);
    await addArtifactPage.init();
    await addArtifactPage.add('Connection');

    const connectorStore = new ConnectorStore(page.page, "Connector Store Form");
    await connectorStore.init();
    await connectorStore.search('Email');
    await connectorStore.selectConnector('Email');

    const connectionForm = new Form(page.page, 'Connector Store Form');
    await connectionForm.switchToFormView();
    await connectionForm.fill({
        values: {
            'Connection Name*': {
                type: 'input',
                value: 'email_connection',
            },
            'Connection Type': {
                type: 'combo',
                value: 'IMAPS'
            },
            'Host*': {
                type: 'expression',
                value: 'example.com',
            },
            'Port*': {
                type: 'expression',
                value: '80',
            },
            'Username': {
                type: 'expression',
                value: 'exampleusername'
            }
        }
    });
    await closeNotification(page);
    await connectionForm.submit('Add');

    const overviewPage = new Overview(page.page);
    await overviewPage.init();
    expect(await overviewPage.checkForArtifact('Connections', 'email_connection')).toBeTruthy();
});

test.skip('Edit Connection', async () => {
    // Edit connection
    const overviewPage = new Overview(page.page);
    await overviewPage.init();
    await overviewPage.selectArtifact('Connections', 'email_connection');

    const connectionForm = new Form(page.page, 'Connection Creation Form');
    await connectionForm.switchToFormView();
    const connectionName = await connectionForm.getInputValue('Connection Name*');
    expect(connectionName).toBe('email_connection');
    await connectionForm.fill({
        values: {
            'Host*': {
                type: 'expression',
                value: 'example2.com',
            },
            'Port*': {
                type: 'expression',
                value: '8080',
            }
        }
    });
    await connectionForm.submit('Update');
    expect(await overviewPage.checkForArtifact('Connections', 'email_connection')).toBeTruthy();
});

test.afterAll(async () => {
    const videoTitle = `connection_test_suite_${new Date().toLocaleString().replace(/,|:|\/| /g, '_')}`;
    const video = page.page.video()
    const videoDir = path.resolve(resourcesFolder, 'videos')
    const videoPath = await video?.path()
    
    if (video && videoPath) {
        video?.saveAs(path.resolve(videoDir, `${videoTitle}.webm`));
    }

    // cleanup
    if (fs.existsSync(newProjectPath)) {
        fs.rmSync(newProjectPath, { recursive: true });
    }

    console.log('Connection tests completed');
});
