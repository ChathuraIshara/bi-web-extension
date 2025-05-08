/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RelativePattern, TestItem, TestItemCollection, TestRunRequest, workspace } from "vscode";
import { createTests, testController } from "./activator";

export const testFileMatchPattern = '**/src/test/**/*.xml';

/**
 * Add test items to an queue to run.
 * 
 * @param request test run request
 * @param tests test tree items
 * @param queue queue to add tests
 */
export async function discoverTests(request: TestRunRequest, tests: Iterable<TestItem>, queue: { test: TestItem; data: any }[]) {
    for (const test of tests) {
        if (request.exclude && request.exclude.includes(test)) {
            continue;
        }

        if (test.canResolveChildren) {
            await discoverTests(request, gatherTestItems(test.children), queue);
        } else {
            queue.push({ test: test, data: null });
        }
    }
}

/**
 * Get test items from test collection.
 * 
 * @param collection test item collection
 * @returns test items array
 */
export function gatherTestItems(collection: TestItemCollection) {
    const items: TestItem[] = [];
    collection.forEach(item => items.push(item));
    return items;
}

export function createTestsForAllFiles() {
    if (!workspace.workspaceFolders) {
        return;
    }

    // clear current test items
    testController.items.forEach(item => {
        testController.items.delete(item.id);
    });

    workspace.workspaceFolders.forEach(workspaceFolder => {
        const pattern = new RelativePattern(workspaceFolder, testFileMatchPattern);
        workspace.findFiles(pattern, '**/resources/**').then(async files => {
            for (const fileX of files) {
                await createTests(fileX);
            }
        });
    });
}
