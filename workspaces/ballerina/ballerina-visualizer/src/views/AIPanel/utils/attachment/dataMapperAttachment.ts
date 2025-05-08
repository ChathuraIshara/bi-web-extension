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
 * DataMapperAttachment overrides how the file is read. Instead of plain text,
 * it reads the file as a Data URL, extracts the Base64 portion, and returns it.
 */
export class DataMapperAttachment extends BaseAttachment {
    constructor(private command: Command) {
        super(getFileTypesForCommand(command));
    }

    protected readFileContent(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                if (reader.result) {
                    const base64String = reader.result.toString().split(",")[1];
                    if (base64String) {
                        resolve(base64String);
                    } else {
                        reject(new Error("Failed to extract Base64 content."));
                    }
                } else {
                    reject(new Error("FileReader result is null or undefined."));
                }
            };

            reader.onerror = () => {
                reject(new Error("Error reading the file."));
            };

            reader.readAsDataURL(file);
        });
    }
}
