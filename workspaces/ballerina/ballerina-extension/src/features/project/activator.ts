/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { activateTestRunner } from "./cmds/test";
import { activateBuildCommand } from "./cmds/build";
import { activateCloudCommand } from "./cmds/cloud";
import { activateRunCmdCommand } from "./cmds/run";
import { activateDocCommand } from "./cmds/doc";
import { activateAddCommand } from "./cmds/add";
import { activatePasteJsonAsRecord } from "./cmds/json-to-record";
import { activatePasteXMLAsRecord } from "./cmds/xml-to-record";
import { activatePackCommand } from "./cmds/pack";
import { activateRenameCommand } from "./cmds/rename";
import { activateExtractCommand } from "./cmds/extract";
import { activateConfigRunCommand } from "./cmds/configRun";
import { activateTryItCommand } from "../tryit/activator";

export * from "./cmds/cmd-runner";

export function activate() {
    // activate ballerina test command
    activateTestRunner();
    
    // activate ballerina build command
    activateBuildCommand();

    // activate ballerina pack command
    activatePackCommand();

    // activate ballerina run command in config
    activateConfigRunCommand();

    // activate ballerina run command
    activateRunCmdCommand();

    // activate ballerina doc command
    activateDocCommand();

    // activate the create Cloud.toml command
    activateCloudCommand();

    // activate the add module command
    activateAddCommand();

    // activate the pasteJsonAsRecord command
    activatePasteJsonAsRecord();

    // activate the pasteXMLAsRecord command
    activatePasteXMLAsRecord();

    // activate the rename command
    activateRenameCommand();

    // activate the extract command
    activateExtractCommand();
}
