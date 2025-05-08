/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ReactNode } from "react";
import { StyleBase } from "./common";
import { CompletionItem } from "../../../types";

export type CompletionDropdownProps = StyleBase & {
    items: CompletionItem[];
    showDefaultCompletion?: boolean;
    autoSelectFirstItem?: boolean;
    getDefaultCompletion?: () => ReactNode;
    isSavable: boolean;
    onCompletionSelect: (item: CompletionItem) => void | Promise<void>;
    onDefaultCompletionSelect: () => void | Promise<void>;
};

export type DefaultCompletionDropdownItemProps = {
    getDefaultCompletion: () => ReactNode;
    onClick: () => void | Promise<void>;
};

export type CompletionDropdownItemProps = {
    item: CompletionItem;
    isSelected?: boolean;
    onClick: () => void | Promise<void>;
};
