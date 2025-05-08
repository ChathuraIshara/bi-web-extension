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
import { Button, ButtonProps } from "./Button";
import { colors } from "../Commons/Colors";
import { Icon } from "../Icon/Icon";

const Template: ComponentStory<typeof Button> = (args: ButtonProps) =>
    <Button {...args}> 
        <div style={{color: colors.editorForeground}}>Test</div>
    </Button>
;

export const PrimaryButton = Template.bind();
PrimaryButton.args = { appearance: "primary", tooltip: "Primary Button" };

const IconTemplate: ComponentStory<typeof Button> = (args: ButtonProps) =>
    <Button {...args}>
        <Icon sx={{marginTop: 2, marginRight: 5}} name="ballerina"/>
        <div style={{color: colors.editorForeground}}>Test</div>
    </Button>
;

export const IconButton = IconTemplate.bind();
IconButton.args = { appearance: "icon", tooltip: "Icon Button" };

export default { component: Button, title: "Button" };
