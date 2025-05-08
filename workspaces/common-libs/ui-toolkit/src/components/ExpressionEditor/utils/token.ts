/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { MutableRefObject } from 'react';

import {
    HELPER_PANE_WITH_EDITOR_HEIGHT,
    HELPER_PANE_WITH_EDITOR_WIDTH,
    ARROW_HEIGHT,
    ARROW_OFFSET
} from '../constants';
import { HelperPaneOrigin, HelperPanePosition } from '../types';

const EXPRESSION_REGEX = /\$\{([^}]+)\}/g;
const EXPRESSION_TOKEN_REGEX = /<div[^>]*>\s*<span[^>]*>\s*([^<]+?)\s*<\/span>\s*.+\s*<\/div>/g;

const wrapTextInDiv = (text: string): string => {
    return `<div class="expression-token" contenteditable="false">
    <span class="expression-token-text">${text}</span>
    <span class="expression-token-close">×</span>
</div>`;
};

export const transformExpressions = (content: string): string => {
    return content.replace(EXPRESSION_REGEX, (_, expression) => {
        // Replace div tags within expressions
        const updatedExpression = expression.replace(/<div>|<\/div>/g, '');

        return wrapTextInDiv(updatedExpression.trim());
    });
};

export const setValue = (element: HTMLDivElement, value: string) => {
    element.innerHTML = transformExpressions(value);
}

export const extractExpressions = (content: string): string => {
    let updatedContent;

    // Replace the expression tokens with the actual value
    updatedContent = content.replace(EXPRESSION_TOKEN_REGEX, (_, expression) => {
        return `\${${expression.trim()}}`;
    });

    // Remove div tags
    updatedContent = updatedContent.replace(/<div>|<\/div>/g, '');

    return updatedContent;
}

export const getHelperPaneWithEditorPosition = (
    expressionEditorRef: MutableRefObject<HTMLDivElement>,
    helperPaneOrigin: HelperPaneOrigin
): HelperPanePosition => {
    const expressionEditor = expressionEditorRef.current!;
    const rect = expressionEditor.getBoundingClientRect();
    if (helperPaneOrigin === 'bottom') {
        return { top: rect.top + rect.height, left: rect.left };
    }

    const position: HelperPanePosition = { top: 0, left: 0 };
    /* In the best case scenario, the helper pane should be poping up on the right of left side
    of the expression editor, aligning to the center of the editor. In case, the viewport is
    not large enough to position the editor in such a way, the position will be updated to keep
    the helper pane within the viewport. */
    position.top = rect.top - (HELPER_PANE_WITH_EDITOR_HEIGHT / 2);
    if (helperPaneOrigin === 'right') {
        position.left = rect.left + rect.width + ARROW_HEIGHT;
    } else if (helperPaneOrigin === 'left') {
        position.left = rect.left - (HELPER_PANE_WITH_EDITOR_WIDTH + ARROW_HEIGHT);
    }

    if (rect.top < HELPER_PANE_WITH_EDITOR_HEIGHT / 2) {
        position.top = 0;
    }
    if (window.innerHeight - rect.top < HELPER_PANE_WITH_EDITOR_HEIGHT / 2) {
        position.top = window.innerHeight - HELPER_PANE_WITH_EDITOR_HEIGHT;
    }

    return position;
};

export const getHelperPaneWithEditorArrowPosition = (
    expressionEditorRef: MutableRefObject<HTMLDivElement>,
    helperPaneOrigin: HelperPaneOrigin,
    helperPanePosition: HelperPanePosition
): HelperPanePosition | undefined => {
    if (helperPaneOrigin === 'bottom' || !helperPanePosition) {
        return undefined;
    }

    const position: HelperPanePosition = { top: 0, left: 0 };
    const expressionEditor = expressionEditorRef.current!;
    const rect = expressionEditor.getBoundingClientRect();

    position.top = rect.top - helperPanePosition.top + ARROW_OFFSET;
    if (helperPaneOrigin === 'left') {
        position.left = HELPER_PANE_WITH_EDITOR_WIDTH;
    } else {
        position.left = -ARROW_HEIGHT;
    }

    return position;
}
