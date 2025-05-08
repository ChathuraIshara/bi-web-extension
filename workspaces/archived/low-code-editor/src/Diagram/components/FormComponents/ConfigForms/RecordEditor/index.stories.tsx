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

import { RecordEditor, RecordEditorProps } from "./index";
import recordModel from "./story-data/record-decl-raw.json";

export default {
    title: 'Low Code Editor/Testing/Form/Record Editor/Record Editor',
    component: RecordEditor,
};

const Template: Story<RecordEditorProps> = (args: RecordEditorProps) => (
    <LowCodeEditorProvider {...mockedEditorProps}>
        <RecordEditor {...args}/>
    </LowCodeEditorProvider>
);

export const RecordEditorComponent = Template.bind({});
RecordEditorComponent.args = {
    name: "",
    model: recordModel,
    onCancel: null,
    onSave: null
};
