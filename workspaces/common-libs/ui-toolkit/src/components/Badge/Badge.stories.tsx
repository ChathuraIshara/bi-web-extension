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
import { Badge, BadgeProps } from "./Badge";

const Template: ComponentStory<typeof Badge> = (args: BadgeProps) =>
    <Badge {...args}> 
        {args.children}
    </Badge>
;

export const informationalBadge = Template.bind();
informationalBadge.args = { color: "#6C757D", children: "100" };

export const SuccessfulBadge = Template.bind();
SuccessfulBadge.args = { color: "#28A745", children: "200" };

export const RedirectionBadge = Template.bind();
RedirectionBadge.args = { color: "#007aff", children: "200" };

export const ClientErrorBadge = Template.bind();
ClientErrorBadge.args = { color: "#FFC107", children: "200" };

export const ServerErrorBadge = Template.bind();
ServerErrorBadge.args = { color: "#f93E3E", children: "500" };

export default { component: Badge, title: "Badge" };
