/**
 * Copyright (c) 2025, WSO2 LLC.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { BaseAttachment } from "./baseAttachment";
import { getFileTypesForCommand } from "./attachmentManager";
import { Command } from "@wso2-enterprise/ballerina-core";

/**
 * GeneralAttachment uses the default file reading strategy (plain text).
 */
export class GeneralAttachment extends BaseAttachment {
    constructor(private command: Command) {
        super(getFileTypesForCommand(command));
    }
}
