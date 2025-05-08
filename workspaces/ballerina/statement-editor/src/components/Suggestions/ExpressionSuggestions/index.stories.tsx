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

import { ExpressionSuggestions } from "./index";

export default {
    title: 'Low Code Editor/Testing/StatementEditor/ExpressionSuggestions',
    component: ExpressionSuggestions,
};

const Template: Story = () => <ExpressionSuggestions />;

const expressionSuggestions: SuggestionItem[] = [{ value: "StringLiteral" },
    { value: "Conditional" },
    { value: "StringTemplate" },
    { value: "Arithmetic" }]

const operatorSuggestions: SuggestionItem[] = [{ value: "+", kind: "PlusToken" },
    { value: "-", kind: "MinusToken" },
    { value: "*", kind: "AsteriskToken" },
    { value: "/", kind: "SlashToken" },
    { value: "%", kind: "PercentToken" }]

export const ExpressionSuggestionDefault = Template.bind({});

ExpressionSuggestionDefault.args = {
    model: varDeclBinaryExprModel,
    suggestions: expressionSuggestions,
    operator: false,
    suggestionHandler: ("")
};

export const OperatorSuggestion = Template.bind({});

OperatorSuggestion.args = {
    model: varDeclBinaryExprModel,
    suggestions: operatorSuggestions,
    operator: true,
    suggestionHandler: ("")
};
