/**
 * Copyright (c) 2025, WSO2 LLC.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AttachmentHandler } from "./attachmentHandler";
import { Attachment, AttachmentStatus } from "@wso2-enterprise/ballerina-core";
import { readFileAsText, validateFileSize, validateFileType } from "./attachmentUtils";

/**
 * Abstract base class that provides common file-attachment handling logic.
 * Concrete classes can override readFileContent if needed (e.g. for base64).
 */
export abstract class BaseAttachment implements AttachmentHandler {
    constructor(protected validFileTypes: string[]) { }

    /**
     * Main method to handle the file input event. It iterates over
     * all files, validates them, reads them, and returns the results.
     */
    public async handleFileAttach(
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<Attachment[]> {
        const files = e.target.files;
        const results: Attachment[] = [];

        if (!files) {
            return results;
        }

        for (const file of Array.from(files)) {
            if (!validateFileSize(file)) {
                results.push({
                    name: file.name,
                    status: AttachmentStatus.FileSizeExceeded,
                });
                continue;
            }

            if (!validateFileType(file, this.validFileTypes)) {
                results.push({
                    name: file.name,
                    status: AttachmentStatus.UnsupportedFileFormat,
                });
                continue;
            }

            try {
                const content = await this.readFileContent(file);
                results.push({
                    name: file.name,
                    content,
                    status: AttachmentStatus.Success,
                });
            } catch {
                results.push({
                    name: file.name,
                    status: AttachmentStatus.UnknownError,
                });
            }
        }

        // Clear the input
        e.target.value = "";
        return results;
    }

    /**
     * Default method to read file content as text.
     * Subclasses can override this to do something else (e.g., read as Base64).
     */
    protected readFileContent(file: File): Promise<string> {
        return readFileAsText(file);
    }
}
