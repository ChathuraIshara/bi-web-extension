/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    ICPEnabledResponse, ICPEnabledRequest,
    addICP, disableICP, isIcpEnabled, ICPServiceAPI
} from "@wso2-enterprise/ballerina-core";
import { HOST_EXTENSION } from "vscode-messenger-common";
import { Messenger } from "vscode-messenger-webview";

export class ICPServiceRpcClient implements ICPServiceAPI {
    private _messenger: Messenger;

    constructor(messenger: Messenger) {
        this._messenger = messenger;
    }
    isIcpEnabled(params: ICPEnabledRequest): Promise<ICPEnabledResponse> {
        return this._messenger.sendRequest(isIcpEnabled, HOST_EXTENSION, params);
    }

    addICP(params: ICPEnabledRequest): Promise<ICPEnabledResponse> {
        return this._messenger.sendRequest(addICP, HOST_EXTENSION, params);
    }

    disableICP(params: ICPEnabledRequest): Promise<ICPEnabledResponse> {
        return this._messenger.sendRequest(disableICP, HOST_EXTENSION, params);
    }
}
