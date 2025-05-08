/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

// tslint:disable-next-line: no-submodule-imports
import { Story } from '@storybook/react/types-6-0';

import { SuggestionItem } from "../../../models/definitions";
import varDeclBinaryExprModel from "../../StatementRenderer/data/local-var-decl-with-binary-expr-st-model.json";

import { LSSuggestions } from "./index";

export default {
    title: 'Low Code Editor/Testing/StatementEditor/LSSuggestions',
    component: LSSuggestions,
};

const Template: Story = () => <LSSuggestions />;

export const LSSuggestionDefault = Template.bind({});

const lsSuggestions: SuggestionItem[] = [{ value: "var1", kind: "string" },
    { value: "var2", kind: "string" },
    { value: "var3", kind: "int" },
    { value: "var4", kind: "int" }]

LSSuggestionDefault.args = {
    model: varDeclBinaryExprModel,
    lsSuggestions,
    suggestionHandler: ("")
}
