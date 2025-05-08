/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { ComponentStory } from "@storybook/react";
import { Card as CardStory, CardProps } from "./Card";

const Template: ComponentStory<typeof CardStory> = (args: CardProps) => <CardStory {...args} />;

export const Card = Template.bind();
Card.args = { id: "Card", icon: "globe", title: "Title", description: "Description" };

export default { component: Card, title: "Card" };
