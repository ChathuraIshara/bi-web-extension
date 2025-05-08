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

import { FieldItem, FieldItemProps } from "./index";

export default {
    title: 'Low Code Editor/Testing/Form/Record Editor/Field',
    component: FieldItem,
};

const field = {
    "name": "name",
    "type": "string",
    "isFieldOptional": true,
    "isFieldTypeOptional": true,
}

const Template: Story<FieldItemProps> = (args: FieldItemProps) => <FieldItem {...args} />;

export const FieldItemComponent = Template.bind({});
FieldItemComponent.args = {
    field,
    onEditCLick: null,
    onDeleteClick: null
};
