/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 *
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import styled from "@emotion/styled";
import { AttachmentStatus } from "@wso2-enterprise/ballerina-core";
import { Codicon } from "@wso2-enterprise/ui-toolkit";

export const AttachmentsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 8px 0;
`;

const Attachment = styled.div<{ status: AttachmentStatus }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px
        ${({ status }: { status: AttachmentStatus }) => (status === AttachmentStatus.Success ? "solid" : "dashed")}
        var(--vscode-disabledForeground);
    background-color: transparent;
    border-radius: 4px;
    font-size: 12px;
    height: calc(1em + 8px);
`;

const IconWrapper = styled.div`
    margin-left: 4px;
    margin-right: 4px;
    display: flex;
    align-items: center;
`;

const Filename = styled.span<{ status: AttachmentStatus }>`
    margin-right: 8px;
    font-size: 12px;
    font-style: ${({ status }: { status: AttachmentStatus }) =>
        status === AttachmentStatus.Success ? "normal" : "italic"};
    text-decoration: ${({ status }: { status: AttachmentStatus }) =>
        status === AttachmentStatus.Success ? "none" : "line-through"};
    color: ${({ status }: { status: AttachmentStatus }) =>
        status === AttachmentStatus.Success ? "var(--vscode-inputForeground)" : "var(--vscode-disabledForeground)"};
`;

const ErrorMessage = styled.span`
    margin-right: 8px;
    font-size: 10px;
    color: var(--vscode-badge-background);
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: var(--vscode-disabledForeground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 4px;
    padding-left: 0;
`;

interface AttachmentBoxProps {
    status: AttachmentStatus;
    fileName: string;
    index: number;
    removeAttachment: (index: number) => void;
    readOnly?: boolean;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
        case "json":
        case "xml":
        case "yaml":
            return (
                <span
                    className={`codicon codicon-file-code`}
                    style={{
                        height: "12px",
                        width: "12px",
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                ></span>
            );
        default:
            return (
                <span
                    className={`codicon codicon-file`}
                    style={{
                        height: "12px",
                        width: "12px",
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                ></span>
            );
    }
};

const AttachmentBox: React.FC<AttachmentBoxProps> = ({
    status,
    fileName,
    index,
    removeAttachment,
    readOnly = false,
}) => {
    return (
        <Attachment status={status}>
            <IconWrapper>{getFileIcon(fileName)}</IconWrapper>
            <Filename status={status}>{fileName}</Filename>
            {status !== AttachmentStatus.Success && (
                <ErrorMessage>
                    {status === AttachmentStatus.FileSizeExceeded && "Too Large"}
                    {status === AttachmentStatus.UnsupportedFileFormat && "Invalid Type"}
                    {status === AttachmentStatus.UnknownError && "Unknown"}
                </ErrorMessage>
            )}
            {!readOnly && (
                <CloseButton onClick={() => removeAttachment(index)}>
                    <Codicon name="close" />
                </CloseButton>
            )}
        </Attachment>
    );
};

export default AttachmentBox;
