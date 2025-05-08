/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    PersistERModel,
    PersistDiagramAPI,
} from "@wso2-enterprise/ballerina-core";
import { commands } from "vscode";
import { StateMachine } from "../../stateMachine";

export class PersistDiagramRpcManager implements PersistDiagramAPI {

    async getPersistERModel(): Promise<PersistERModel> {
        return new Promise(async (resolve) => {
            const currentDoc = StateMachine.context().documentUri;
            const res = await StateMachine.langClient().getPersistERModel({ documentUri: currentDoc});
            resolve(res);
        });
    }

    async showProblemPanel(): Promise<void> {
        return await commands.executeCommand('workbench.action.problems.focus');
    }
}
