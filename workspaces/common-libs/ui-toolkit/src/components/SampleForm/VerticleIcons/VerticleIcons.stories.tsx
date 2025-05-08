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
import { VerticleIcons as IconsWrapper, Props } from "./VerticleIcons";

// const FORM_WIDTH = 600;

const Template: ComponentStory<typeof IconsWrapper> = (args: Props) => <IconsWrapper {...args} />;

const onClick = (type: string) => {
    console.log("Selected Type", type);
}

export const VerticleIcons = Template.bind();
VerticleIcons.args = { sx: { width: `1000px` }, onClick: onClick };

export default { component: VerticleIcons, title: "Sample Form" };
