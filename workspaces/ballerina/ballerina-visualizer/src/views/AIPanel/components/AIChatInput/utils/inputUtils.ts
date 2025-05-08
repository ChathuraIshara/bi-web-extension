/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Command, TemplateId } from "@wso2-enterprise/ballerina-core";
import { CommandTemplates } from "../../../commandTemplates/data/commandTemplates.const";
import { getTemplateDefinitionsByCommand } from "../../../commandTemplates/utils/utils";
import { ChatBadgeType } from "../../ChatBadge";
import { SYSTEM_BADGE_SECRET } from "../constants";
import { matchCommandTemplate } from "./utils";

// ==================================
// Represents AIChatInput's General Contents (Badges + Text)
// ==================================
export type Input = TextInput | BadgeInput;

interface TextInput {
    content: string;
}

interface BaseBadgeInput {
    badgeType: ChatBadgeType;
    display: string;
    rawValue?: string;
}

interface CommandBadgeInput extends BaseBadgeInput {
    badgeType: ChatBadgeType.Command;
    command: Command;
}

interface TagBadgeInput extends BaseBadgeInput {
    badgeType: ChatBadgeType.Tag;
}

type BadgeInput = CommandBadgeInput | TagBadgeInput;

// ==================================
// Input Parsing Utils
// ==================================
export interface InputPlainTextResult {
    text: string;
}

export interface InputCommandTemplateResult {
    command: Command;
    templateId: string;
    placeholderValues?: Record<string, string>;
    text?: string;
}

export interface InputParseErrorResult {
    type: 'error';
    message: string;
}

export type InputParseResult =
    | InputPlainTextResult
    | InputCommandTemplateResult
    | InputParseErrorResult;

export function parseInput(inputs: Input[], commandTemplates: CommandTemplates): InputParseResult {
    let command: Command | undefined = undefined;
    let textInput: string = "";

    const [first, ...rest] = inputs;

    if (isCommandBadge(first)) {
        command = first.command;
        textInput = stringifyInputArray(rest);

        if (rest.some(isCommandBadge)) {
            return {
                type: 'error',
                message: "Multiple command badges found. Only one is allowed.",
            };
        }
    } else {
        textInput = stringifyInputArray(inputs);

        return {
            text: textInput,
        };
    }

    // Templates for command
    const templateDefinitions = getTemplateDefinitionsByCommand(commandTemplates, command);
    const isWildcardTemplate = templateDefinitions.some(t => t.id === TemplateId.Wildcard);
    const textInputLeadingTrimmed = textInput.replace(/^\s+/, '');
    const matches = matchCommandTemplate(textInputLeadingTrimmed, templateDefinitions);

    if (!matches) {
        if (isWildcardTemplate) {
            return {
                command,
                templateId: TemplateId.Wildcard,
                text: textInputLeadingTrimmed,
            };
        }

        return {
            type: 'error',
            message: `Input doesn't match any known template for command "${command}".`,
        };
    }

    const { template, match } = matches;
    const expectedPlaceholders = template.placeholders?.map(p => p.id) ?? [];
    const allPresent = expectedPlaceholders.every(id => match[id]?.trim());

    if (!allPresent) {
        return {
            type: 'error',
            message: `Missing required input params: ${expectedPlaceholders
                .filter(id => !match[id]?.trim())
                .join(', ')}`,
        };
    }

    const placeholderValues: Record<string, string> = {};
    for (const id of expectedPlaceholders) {
        placeholderValues[id] = match[id];
    }

    return {
        command,
        templateId: template.id,
        placeholderValues,
    };
}

export const stringifyInputArrayWithBadges = (inputs: Input[]): string => {
    return inputs
        .map((input) => {
            if ('content' in input) {
                return input.content;
            }

            // Common attributes for all system badges
            const baseAttrs = `data-system="true" data-auth="${SYSTEM_BADGE_SECRET}"`;

            if (input.badgeType === ChatBadgeType.Command) {
                return `<badge ${baseAttrs} data-type="command" data-command="${input.command}">${input.display}</badge>`;
            } else if (input.badgeType === ChatBadgeType.Tag) {
                return `<badge ${baseAttrs} data-type="tag">${input.display}</badge>`;
            }

            return '';
        })
        .join('');
};

const isCommandBadge = (input: Input): input is CommandBadgeInput => {
    return (
        'badgeType' in input &&
        input.badgeType === ChatBadgeType.Command &&
        'command' in input
    );
}

const stringifyInputArray = (inputs: Input[]): string => {
    return inputs
        .map(input => {
            if ('content' in input) {
                return input.content;
            } else if (input.badgeType === ChatBadgeType.Tag) {
                return input.rawValue ?? input.display;
            }
            return '';
        })
        .join('');
};
