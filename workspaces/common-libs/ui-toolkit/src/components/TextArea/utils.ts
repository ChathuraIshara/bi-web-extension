/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Get the numerical line height from the computed style
 *
 * @param lineHeight - The line height from the computed style
 * @returns The numerical line height
 */
const getNumericalLineHeight = (lineHeight: string) => {
    if (lineHeight === 'normal') {
        return 1.2;
    }

    return parseInt(lineHeight);
};

/**
 * Get the height of a single line of text in the text area
 *
 * @param textAreaEl - The text area element
 * @returns The height of a single line of text in the text area
 */
export const getLineHeight = (textAreaEl: HTMLTextAreaElement) => {
    const computedStyle = window.getComputedStyle(textAreaEl);
    const lineHeight = getNumericalLineHeight(computedStyle.lineHeight);
    const fontSize = parseInt(computedStyle.fontSize);

    return Math.floor(lineHeight * fontSize);
};

/**
 * Get the raw scroll height of the text area without paddings
 *
 * @param textAreaEl - The text area element
 * @returns The raw scroll height of the text area
 */
export const getRawScrollHeight = (textAreaEl: HTMLTextAreaElement) => {
    const computedStyle = window.getComputedStyle(textAreaEl);
    const paddingTop = parseInt(computedStyle.paddingBlockStart);
    const paddingBottom = parseInt(computedStyle.paddingBlockEnd);
    const scrollHeight = textAreaEl.scrollHeight;

    return scrollHeight - (paddingTop + paddingBottom);
};

/**
 * Get the line count based on the new line characters
 *
 * @param value - The value of the text area
 * @returns Number of lines
 */
export const getLineCount = (value: string) => {
    return (value.match(/\n/g) || []).length + 1;
};

/**
 * Sets the number of rows of the text area
 *
 * @param textAreaEl - The text area element
 * @param rows - The number of rows to set
 */
export const setTextAreaRows = (textAreaEl: HTMLTextAreaElement, rows: number) => {
    textAreaEl.rows = rows;
};

/**
 * Calculate the number of rows of the text area based on the grow range
 *
 * @param rows - The number of rows to set
 * @param growRange - The grow range of the text area
 * @returns The number of rows to set
 */
export const calculateTextAreaRows = (rows: number, growRange: { start: number; offset: number }) => {
    return Math.min(Math.max(growRange.start, rows), growRange.start + growRange.offset);
};
