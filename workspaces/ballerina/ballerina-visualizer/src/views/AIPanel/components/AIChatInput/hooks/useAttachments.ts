/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState, useRef, ChangeEvent } from "react";
import { Attachment, Command } from "@wso2-enterprise/ballerina-core";

export interface AttachmentOptions {
    multiple: boolean;
    acceptResolver: (command: Command | null) => string;
    handleAttachmentSelection: (e: ChangeEvent<HTMLInputElement>, command: Command | null) => Promise<Attachment[]>;
}

interface UseAttachmentsProps {
    attachmentOptions: AttachmentOptions;
    activeCommand: Command | null;
}

export function useAttachments({ attachmentOptions, activeCommand }: UseAttachmentsProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // open file input
    function handleAttachClick() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    // handle user file selection
    async function onAttachmentSelection(e: React.ChangeEvent<HTMLInputElement>) {
        const results = await attachmentOptions.handleAttachmentSelection(e, activeCommand);
        setAttachments((prev) => {
            const updated = [...prev];
            results.forEach((newFile) => {
                const existingIndex = updated.findIndex(
                    (existing) => existing.name === newFile.name && existing.content === newFile.content
                );
                if (existingIndex !== -1) {
                    updated.splice(existingIndex, 1);
                }
                updated.push(newFile);
            });
            return updated;
        });
    }

    // remove an attachment
    function removeAttachment(index: number) {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    }

    // remove all attachments
    function removeAllAttachments() {
        setAttachments([]);
    }

    return {
        attachments,
        fileInputRef,
        handleAttachClick,
        onAttachmentSelection,
        removeAttachment,
        removeAllAttachments,
    };
}
