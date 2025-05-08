'use strict';
/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RelativePattern, TestController, TestItem, TestItemCollection, TestRunRequest, workspace } from "vscode";
import { createTests } from "./activator";

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

/**
 * Search for bal files in workspace.
 * 
 */
export function startWatchingWorkspace(controller: TestController) {
    if (!workspace.workspaceFolders) {
        return [];
    }

    return workspace.workspaceFolders.map(workspaceFolder => {
        const pattern = new RelativePattern(workspaceFolder, '**/*.bal');
        const watcher = workspace.createFileSystemWatcher(pattern);

        watcher.onDidCreate(uri => createTests(uri));
        watcher.onDidChange(async uri => {
            await createTests(uri);
        });
        watcher.onDidDelete(uri => controller.items.delete(uri.toString()));

        workspace.findFiles(pattern).then(async files => {
            for (const fileX of files) {
                await createTests(fileX);
            }
        });

        return watcher;
    });
}
