/**
 * Copyright (c) 2025, WSO2 LLC.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Attachment } from "@wso2-enterprise/ballerina-core";

/**
 * The AttachmentHandler interface defines the contract for handling
 * file attachments of a given command/context. Implementations can
 * override how the file content is read/processed.
 */
export interface AttachmentHandler {
    handleFileAttach(
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<Attachment[]>;
}
