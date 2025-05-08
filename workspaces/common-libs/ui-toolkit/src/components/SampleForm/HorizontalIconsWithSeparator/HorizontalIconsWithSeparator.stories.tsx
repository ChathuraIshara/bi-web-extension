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
import { HorizontalIconsWithSeparator as IconsWrapper, IconContainerProps } from "./HorizontalIconsWithSeparator";

const Template: ComponentStory<typeof IconsWrapper> = (args: IconContainerProps) => <IconsWrapper {...args} />;

export const HorizontalIconsWithSeparator = Template.bind();
HorizontalIconsWithSeparator.args = { sx: { width: 600 }, leftIconName: "ballerina", rightIconName: "ellipsis", title: "Sample", description: "Sample Description" };

export default { component: HorizontalIconsWithSeparator, title: "Sample Form" };
