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
import { PersistERModel } from "../../interfaces/extended-lang-client";
import { RequestType, NotificationType } from "vscode-messenger-common";

const _preFix = "persist-diagram";
export const getPersistERModel: RequestType<void, PersistERModel> = { method: `${_preFix}/getPersistERModel` };
export const showProblemPanel: NotificationType<void> = { method: `${_preFix}/showProblemPanel` };
