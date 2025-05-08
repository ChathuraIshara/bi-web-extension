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
import { RadioButtonGroup, RadioButtonGroupProps } from "./RadioButtonGroup";

const Template: ComponentStory<typeof RadioButtonGroup> = (args: RadioButtonGroupProps) => <RadioButtonGroup {...args} ref={null}/>;

export const ButtonGroup = Template.bind();
ButtonGroup.args = { name: "radio-button-group", value: "option1", orientation: "vertical", options: [{ content: "Option 1", value: "option1" }, { content: "Option 2", value: "option2" }], onChange: (e: any) => console.log("Radio button clicked", e.target.value)};

export default { component: RadioButtonGroup, title: "Radio Button Group" };
