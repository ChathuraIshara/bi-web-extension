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
import { Grid, GridProps } from "./Grid";
import { GridItem } from "./GridItem";

interface Item {
    id: number | string;
    label: React.ReactNode;
    onClick: () => void;
}
  
const items: Item[] = [
    {id: "i1", label: <>Item 1</>, onClick: () => {console.log("Item1 Selected")}},
    {id: "i2", label: <>Item 2</>, onClick: () => {console.log("Item2 Selected")}},
    {id: "i3", label: <>Item 3</>, onClick: () => {console.log("Item3 Selected")}},
    {id: "i4", label: <>Item 4</>, onClick: () => {console.log("Item4 Selected")}},
    {id: "i5", label: <>Item 5</>, onClick: () => {console.log("Item5 Selected")}},
    {id: "i6", label: <>Item 6</>, onClick: () => {console.log("Item6 Selected")}}
]

const Template: ComponentStory<typeof Grid> = (args: GridProps) => (
    <Grid {...args}>
        {items.map(item => (
            <GridItem
                id={item.id}
                key={item.id}
                onClick={item.onClick}
                sx={{color: 'var(--foreground)'}}
            >
                {item.label}
            </GridItem>
        ))}
    </Grid>
);

export const GridC = Template.bind();
GridC.args = { columns: 3};

export default { component: GridC, title: "Grid" };
