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
    PersistDiagramAPI,
    PersistERModel,
    getPersistERModel,
    showProblemPanel
} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class PersistDiagramRpcClient implements PersistDiagramAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }

    getPersistERModel(): Promise<PersistERModel> {
        return this._messenger.sendRequest(getPersistERModel, HOST_EXTENSION);
    }

    showProblemPanel(): void {
        return this._messenger.sendNotification(showProblemPanel, HOST_EXTENSION);
    }
}
