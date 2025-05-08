/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ComponentStory } from "@storybook/react";
import React from "react";
import { Alert, AlertProps } from "./Alert";

const Template: ComponentStory<typeof Alert> = (args: AlertProps) => (
    <Alert {...args}>
        <div>Child components go here...</div>
    </Alert>
);

export const Default = Template.bind();
Default.args = {
    title: "Alert Title",
    subTitle: "Alert Subtitle",
    variant: "primary",
};

export default { component: Alert, title: "Alert" };

