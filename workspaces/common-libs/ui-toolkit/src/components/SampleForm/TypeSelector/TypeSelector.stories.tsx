/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { ComponentStory } from "@storybook/react";
import { TypeSelector as AppTypeSelector, TypeSelectorProps } from "./TypeSelector";

const Template: ComponentStory<typeof AppTypeSelector> = (args: TypeSelectorProps) => <AppTypeSelector {...args} />;

const onClick = (type: string) => {
    console.log("Selected Type", type);
}

export const TypeSelector = Template.bind();
TypeSelector.args = { onTypeSelected: onClick, sx: { width: 600 } };

export default { component: TypeSelector, title: "Sample Form" };
