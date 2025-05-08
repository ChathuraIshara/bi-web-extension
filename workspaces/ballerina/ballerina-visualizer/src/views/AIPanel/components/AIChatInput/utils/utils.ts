/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PlaceholderDefinition } from "../../../commandTemplates/models/placeholder.model";
import { TemplateDefinition } from "../../../commandTemplates/models/template.model";

export const decodeHTML = (str: string): string => {
    const element = document.createElement("div");
    element.innerHTML = str;
    return element.innerText;
};

type TemplateMatchResult = {
    template: TemplateDefinition;
    match: Record<string, string>;
};

export const generateRegexFromTemplateText = (
    templateText: string,
    placeholders: PlaceholderDefinition[] = []
): RegExp => {
    let pattern = templateText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    for (const { id, text, multiline } of placeholders) {
        const escapedName = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const namedGroup = multiline
            ? `(?<${id}>[\\s\\S]+)`
            : `(?<${id}>[^\\n]+?)`;

        pattern = pattern.replace(escapedName, namedGroup);
    }

    return new RegExp(`^${pattern}$`);
}

export const matchCommandTemplate = (
    input: string,
    templates: TemplateDefinition[]
): TemplateMatchResult | undefined => {
    for (const template of templates) {
        const regex = generateRegexFromTemplateText(template.text, template.placeholders);
        const match = input.match(regex);

        if (match) {
            return {
                template,
                match: match.groups ?? {}
            };
        }
    }

    return undefined;
}

export const getFirstOccurringPlaceholder = (
    text: string,
    placeholderDefs: PlaceholderDefinition[]
): PlaceholderDefinition | null => {
    let firstIndex = Infinity;
    let firstMatch: PlaceholderDefinition | null = null;

    for (const placeholderDef of placeholderDefs) {
        const index = text.indexOf(placeholderDef.text);
        if (index !== -1 && index < firstIndex) {
            firstIndex = index;
            firstMatch = placeholderDef;
        }
    }

    return firstMatch;
};
