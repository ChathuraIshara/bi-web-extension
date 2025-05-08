/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { commands, languages, Uri, window } from "vscode";
import { BALLERINA_COMMANDS, getRunCommand, PALETTE_COMMANDS, runCommand } from "./cmd-runner";
import { ballerinaExtInstance } from "../../../core";
import { prepareAndGenerateConfig } from "../../config-generator/configGenerator";
import { getConfigCompletions } from "../../config-generator/utils";


function activateConfigRunCommand() {
    // register the config view run command
    commands.registerCommand(PALETTE_COMMANDS.RUN_CONFIG, async (filePath: Uri) => {
        const currentProject = ballerinaExtInstance.getDocumentContext().getCurrentProject();
        if (currentProject) {
            runCommand(currentProject, ballerinaExtInstance.getBallerinaCmd(),
            getRunCommand(),
            currentProject.path!);
            return;
        }
    });

    commands.registerCommand(PALETTE_COMMANDS.CONFIG_CREATE_COMMAND, async () => {
        try {
            const currentProject = ballerinaExtInstance.getDocumentContext().getCurrentProject();
            const filePath = window.activeTextEditor.document;
            const path = filePath.uri.fsPath;
            prepareAndGenerateConfig(ballerinaExtInstance, currentProject ? currentProject.path! : path, true);
            return;
        } catch (error) {
            throw new Error("Unable to create Config.toml file. Try again with a valid Ballerina file open in the editor.");
        }
    });

    languages.registerCompletionItemProvider({ language: 'toml' }, {
        async provideCompletionItems(document, position, token, context) {
            const currentProject = ballerinaExtInstance.getDocumentContext().getCurrentProject();
            const filePath = window.activeTextEditor.document;
            const path = filePath.uri.fsPath;
            const suggestions = await getConfigCompletions(ballerinaExtInstance, currentProject ? currentProject.path! : path, document, position);
            return suggestions;
        }
    });
}

export { activateConfigRunCommand };
