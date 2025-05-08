/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { expect, test } from '@playwright/test';
import * as path from 'path';
import { Form } from './components/Form';
import { AddArtifact } from './components/AddArtifact';
import { closeNotification, createProject, initVSCode, newProjectPath, page, resourcesFolder, vscode } from './Utils';
import { InboundEPForm } from './components/InboundEp';
import { Diagram } from './components/Diagram';
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

test.skip('Create new HTTPS inbound endpoint', async () => {
    // Create HTTPS inbound endpoint with automatically generated sequences
    const addArtifactPage = new AddArtifact(page.page);
    await addArtifactPage.init();
    await addArtifactPage.add('Listener');

    const inboundEPSelector = new InboundEPForm(page.page);
    await inboundEPSelector.init();
    await inboundEPSelector.selectType('HTTPS');

    const inboundEPForm = new Form(page.page, 'Inbound EP Form');
    await inboundEPForm.switchToFormView();
    await inboundEPForm.fill({
        values: {
            'Inbound Endpoint Name*': {
                type: 'input',
                value: 'HTTPS_inboundEP',
            },
            'Port*': {
                type: 'input',
                value: '8080',
            }
        }
    });
    await closeNotification(page);
    await inboundEPForm.submit('Create');

    const diagram = new Diagram(page.page, 'Inbound EP');
    await diagram.init();
    await diagram.addMediator('Log');
    const diagramTitle = diagram.getDiagramTitle();

    expect(await diagramTitle).toBe('Inbound Endpoint: HTTPS_inboundEP');
});

test.skip('Edit Inbound Endpoint', async () => {
    // Edit Inbound Endpoint

    const diagram = new Diagram(page.page, 'Inbound EP');
    await diagram.init();
    await diagram.edit();

    const inboundEPForm = new Form(page.page, 'Inbound EP Form');
    await inboundEPForm.switchToFormView();
    await inboundEPForm.fill({
        values: {
            'Inbound Endpoint Name*': {
                type: 'input',
                value: 'HTTPS_inboundEP2',
            },
            'Port*': {
                type: 'input',
                value: '9090',
            }
        }
    });

    await inboundEPForm.submit('Update');

    await diagram.init();
    const diagramTitle = diagram.getDiagramTitle();
    expect(await diagramTitle).toBe('Inbound Endpoint: HTTPS_inboundEP2');
});



test.afterAll(async () => {
    await vscode?.close();

    const videoTitle = new Date().toLocaleString().replace(/,|:|\/| /g, '_');
    const video = page.page.video()
    const videoDir = path.resolve(resourcesFolder, 'videos')
    const videoPath = await video?.path()

    if (video && videoPath) {
        await fs.renameSync(videoPath, `${videoDir}/${videoTitle}.webm`)
    }
});
