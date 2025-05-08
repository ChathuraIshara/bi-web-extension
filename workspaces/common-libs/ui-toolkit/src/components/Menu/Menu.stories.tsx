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
import { Item, Menu, MenuProps } from "./Menu";
import { MenuItem } from "./MenuItem";

const items: Item[] = [{id: "test", label: <>Test Item</>, onClick: () => {console.log("Item Selected")}, disabled: false}, 
    {id: "test2", label: <>Test Item 2</>, onClick: () => {console.log("Item Selected")}, disabled: false}
];
const Template: ComponentStory<typeof Menu> = (args: MenuProps) => 
    <Menu {...args}> 
        {items.map((item: Item) => 
            (<MenuItem key={`item ${item.id}`} item={item} onClick={() => {console.log(`Clicked Item ${item.id}`)}} />)
        )}
    </Menu>;

export const MenuC = Template.bind();
MenuC.args = { id: "menu" };

export default { component: MenuC, title: "Menu" };
