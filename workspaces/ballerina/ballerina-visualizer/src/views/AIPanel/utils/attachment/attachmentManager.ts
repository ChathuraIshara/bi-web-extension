/**
 * Copyright (c) 2025, WSO2 LLC.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ChangeEvent } from "react";
import { DataMapperAttachment } from "./dataMapperAttachment";
import { Attachment, Command } from "@wso2-enterprise/ballerina-core";
import { GeneralAttachment } from "./generalAttachment";

/**
 * Allowed file types for text-based commands.
 * Adjust these as needed for your application logic.
 */
const TEXT_BASED_TYPES = [
    "text/plain",
    "application/json",
    "application/x-yaml",
    "application/xml",
    "text/xml",
    ".sql",
    ".graphql",
    "",
];

/**
 * Allowed file types for commands expecting documents/images.
 */
const DOCUMENT_TYPES = [
    "text/plain",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
];

/**
 * Returns a list of valid file types for a given command.
 */
export const getFileTypesForCommand = (command: Command | null): string[] => {
    switch (command) {
        case Command.DataMap:
        case Command.TypeCreator:
            return DOCUMENT_TYPES;
        default:
            return TEXT_BASED_TYPES;
    }
};

/**
 * Utility to build the string for the 'accept' attribute of <input type="file" />.
 */
export const acceptResolver = (command: Command | null): string => {
    if (!command) {
        return TEXT_BASED_TYPES.join(",");
    }
    return getFileTypesForCommand(command).join(",");
};

/**
 * Dynamically selects an attachment handler based on the command,
 * then processes and returns the results of uploading the file(s).
 */
export const handleAttachmentSelection = async (
    e: ChangeEvent<HTMLInputElement>,
    command: Command | null
): Promise<Attachment[]> => {

    let attachmentHandler;

    switch (command) {
        case Command.DataMap:
        case Command.TypeCreator:
            attachmentHandler = new DataMapperAttachment(command);
            break;
        default:
            attachmentHandler = new GeneralAttachment(command);
    }

    const results = await attachmentHandler.handleFileAttach(e);
    return results;
};
