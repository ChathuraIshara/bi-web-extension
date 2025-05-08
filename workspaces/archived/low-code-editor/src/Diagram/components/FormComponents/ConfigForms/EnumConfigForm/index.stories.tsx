/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

// tslint:disable-next-line:no-submodule-imports
import { Story } from '@storybook/react/types-6-0';

import { Provider as LowCodeEditorProvider } from "../../../../../Contexts/Diagram";
import { mockedEditorProps } from "../ConditionConfigForms/ConditionsOverlayForm/AddWhileForm/index.stories";

import { EnumConfigForm, EnumEditorProps } from "./index";
import enumModel from "./story-data/enum-decl-raw.json";

export default {
    title: 'Low Code Editor/Testing/Form/Enum Editor/Enum Editor',
    component: EnumConfigForm,
};

const Template: Story<EnumEditorProps> = (args: EnumEditorProps) => (
    <LowCodeEditorProvider {...mockedEditorProps}>
        <EnumConfigForm {...args}/>
    </LowCodeEditorProvider>
);

export const EnumEditorComponent = Template.bind({});
EnumEditorComponent.args = {
    name: "",
    model: enumModel,
    onCancel: null,
    onSave: null
};
