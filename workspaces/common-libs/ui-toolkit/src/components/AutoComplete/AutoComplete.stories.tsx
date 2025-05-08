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
import { AutoComplete, AutoCompleteProps } from "./AutoComplete";

const Template: ComponentStory<typeof AutoComplete> = (args: AutoCompleteProps) => <div style={{ width: 300 }}><AutoComplete {...args} ref={null}/></div>;

export const Select = Template.bind();
const args: AutoCompleteProps = { id: "autoComplete", label: "Words", required: true, nullable: true, onValueChange: (value: string) => { console.log(value); }, items: ["foo", "boo"] };
Select.args = args;

export default { component: Select, title: "AutoComplete" };
