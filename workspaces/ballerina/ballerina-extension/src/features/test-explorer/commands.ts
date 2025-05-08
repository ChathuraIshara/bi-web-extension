'use strict';
/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { commands, TestItem } from "vscode";
import { openView, StateMachine, history } from "../../stateMachine";
import { BI_COMMANDS, EVENT_TYPE, MACHINE_VIEW } from "@wso2-enterprise/ballerina-core";
import { isTestFunctionItem } from "./discover";
import path from "path";
import { promises as fs } from 'fs';

export function activateEditBiTest() {
    // register run project tests handler
    commands.registerCommand(BI_COMMANDS.BI_EDIT_TEST_FUNCTION, async (entry: TestItem) => {
        if (!isTestFunctionItem(entry)) {
            return;
        }

        const fileName = entry.id.split(":")[1];
        const fileUri = path.resolve(StateMachine.context().projectUri, `tests`, fileName);
        if (fileUri) {
            const range = entry.range;
            openView(EVENT_TYPE.OPEN_VIEW, { documentUri: fileUri, 
                position: { startLine: range.start.line, startColumn: range.start.character, 
                    endLine: range.end.line, endColumn: range.end.character } });
            history.clear();
        }        
    });

    commands.registerCommand(BI_COMMANDS.BI_ADD_TEST_FUNCTION, () => {
        const fileUri = path.resolve(StateMachine.context().projectUri, `tests`, `tests.bal`);
        ensureFileExists(fileUri);
        openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.BITestFunctionForm, 
            documentUri: fileUri, identifier: '', serviceType: 'ADD_NEW_TEST' });
    });

    commands.registerCommand(BI_COMMANDS.BI_EDIT_TEST_FUNCTION_DEF, (entry: TestItem) => {
        if (!isTestFunctionItem(entry)) {
            return;
        }

        const fileName = entry.id.split(":")[1];
        const fileUri = path.resolve(StateMachine.context().projectUri, `tests`, fileName);
        if (fileUri) {
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.BITestFunctionForm, 
                documentUri: fileUri, identifier: entry.label, serviceType: 'UPDATE_TEST' });
        }
    });
}

async function ensureFileExists(filePath: string) {
  try {
    await fs.access(filePath);
  } catch {
    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(filePath, '', 'utf8');
    console.log('File created:', filePath);
  }
}
