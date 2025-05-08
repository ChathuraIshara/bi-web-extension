/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export function appendToArray(newVal: string, editorValue: string) {
    const trimmedEditorValue = editorValue.replace(" ", "");
    if (!editorValue || trimmedEditorValue === "") {
        return `[${newVal}]`
    } else if (trimmedEditorValue.startsWith("[") && trimmedEditorValue.endsWith("]")) {
        for (let i = editorValue.length - 1; i >= 0; i--) {
            if (editorValue[i] === "]") {
                const tempArray = editorValue.substring(0, i);
                return trimmedEditorValue === "[]" ? `[${newVal}]` : `${tempArray}, ${newVal}]`;
            }
        }
    }
    return `${editorValue} + [${newVal}]`
}
