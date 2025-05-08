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
import { ActionButtons, ActionButtonsProps } from "./ActionButtons";

const Template: ComponentStory<typeof ActionButtons> = (args: ActionButtonsProps) =>
    <ActionButtons {...args}/> 
;

export const PrimaryButton = Template.bind();
PrimaryButton.args = { primaryButton: { tooltip: "Primary Tooltip", text: "Save", onClick: () => console.log("Primary Clicked")}, secondaryButton: { tooltip: "Secondary Tooltip", text: "Cancel", onClick: () => console.log("Secondary Clicked")  } };

export default { component: ActionButtons, title: "ActionButtons" };
