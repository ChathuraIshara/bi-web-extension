/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import styled from "@emotion/styled";
import AIChatInput, { AIChatInputRef, TagOptions } from "../../AIChatInput";
import { Input } from "../../AIChatInput/utils/inputUtils";
import { AIPanelPrompt, Attachment, TemplateId } from "@wso2-enterprise/ballerina-core";
import { commandTemplates, suggestedCommandTemplates } from "../../../commandTemplates/data/commandTemplates.const";
import { AttachmentOptions } from "../../AIChatInput/hooks/useAttachments";
import { getTemplateTextById } from "../../../commandTemplates/utils/utils";

export const FooterContainer = styled.footer({
    padding: "20px",
});

const SuggestedCommandsWrapper = styled.div({
    marginTop: "16px",
    marginBottom: "6px",
    marginLeft: "2px",
    color: "var(--vscode-descriptionForeground)",
});

const renderPrompt = (item: AIPanelPrompt, index: number, aiChatInputRef: React.RefObject<AIChatInputRef>) => {
    if (!item) return null;
    let text = "";

    switch (item.type) {
        case "command-template":
            text = `${item.command} ${
                item.templateId === TemplateId.Wildcard
                    ? item.text
                    : getTemplateTextById(commandTemplates, item.command, item.templateId)
            }`;
            break;
        case "text":
            text = item.text;
            break;
    }

    return (
        <div key={index} style={{ marginBottom: "2px" }}>
            <a
                href="#"
                style={{ textDecoration: "none", cursor: "pointer", outline: "none", boxShadow: "none" }}
                onClick={(e) => {
                    e.preventDefault();
                    aiChatInputRef.current?.setInputContent(item);
                }}
            >
                {text}
            </a>
        </div>
    );
};

type FooterProps = {
    aiChatInputRef: React.RefObject<AIChatInputRef>;
    tagOptions: TagOptions;
    attachmentOptions: AttachmentOptions;
    inputPlaceholder: string;
    onSend: (content: { input: Input[]; attachments: Attachment[] }) => Promise<void>;
    onStop: () => void;
    isLoading: boolean;
    showSuggestedCommands: boolean;
};

const Footer: React.FC<FooterProps> = ({
    aiChatInputRef,
    tagOptions,
    attachmentOptions,
    inputPlaceholder,
    onSend,
    onStop,
    isLoading,
    showSuggestedCommands,
}) => {
    return (
        <FooterContainer>
            {showSuggestedCommands && (
                <SuggestedCommandsWrapper>
                    {suggestedCommandTemplates.map((item, index) => renderPrompt(item, index, aiChatInputRef))}
                </SuggestedCommandsWrapper>
            )}
            <AIChatInput
                ref={aiChatInputRef}
                initialCommandTemplate={commandTemplates}
                tagOptions={tagOptions}
                attachmentOptions={attachmentOptions}
                placeholder={inputPlaceholder}
                onSend={onSend}
                onStop={onStop}
                isLoading={isLoading}
            />
        </FooterContainer>
    );
};

export default Footer;
