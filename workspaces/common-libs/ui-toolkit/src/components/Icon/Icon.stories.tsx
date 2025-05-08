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
import { Icon, IconProps } from "./Icon";

const Template: ComponentStory<typeof Icon> = (args: IconProps) => <Icon {...args} />;

export const SampleIcon = Template.bind();
SampleIcon.args = { name: "ballerina" };

export const SampleCodicon = Template.bind();
SampleCodicon.args = { name: "plus", isCodicon: true };

export default { component: Icon, title: "Icon" };
