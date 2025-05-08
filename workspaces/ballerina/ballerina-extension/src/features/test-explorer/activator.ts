'use strict';
/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { tests, workspace,  TestRunProfileKind, TestController } from "vscode";
import { BallerinaExtension } from "../../core";
import { runHandler } from "./runner";
import { activateEditBiTest } from "./commands";
import { discoverTestFunctionsInProject, handleFileChange as handleTestFileUpdate, handleFileDelete as handleTestFileDelete } from "./discover";

export let testController: TestController;

export async function activate(ballerinaExtInstance: BallerinaExtension) {
    testController = tests.createTestController('ballerina-integrator-tests', 'Ballerina Integrator Tests');

    // Create test profiles to display.
    testController.createRunProfile('Run Tests', TestRunProfileKind.Run, runHandler, true);
    testController.createRunProfile('Debug Tests', TestRunProfileKind.Debug, runHandler, true);

    // Register a file watcher for test files
    const fileWatcher = workspace.createFileSystemWatcher('**/tests/**/*.bal');

    // Handle file creation, modification, and deletion
    fileWatcher.onDidCreate(async (uri) => await handleTestFileUpdate(ballerinaExtInstance, uri, testController));
    fileWatcher.onDidChange(async (uri) => await handleTestFileUpdate(ballerinaExtInstance, uri, testController));
    fileWatcher.onDidDelete((uri) => handleTestFileDelete(uri, testController));

    // Initial test discovery
    discoverTestFunctionsInProject(ballerinaExtInstance, testController);

    // Register the test controller and file watcher with the extension context
    ballerinaExtInstance.context?.subscriptions.push(testController, fileWatcher);

    activateEditBiTest();
}


