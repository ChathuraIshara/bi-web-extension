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
import { LinkButton, LinkButtonProps } from "./LinkButton";
import { Codicon } from "../Codicon/Codicon";

const Template: ComponentStory<typeof LinkButton> = (args: LinkButtonProps) => 
    <LinkButton {...args} >
        <Codicon name="add"/>
        <>Sample Link Button</>
    </LinkButton>
;

export const SampleLinkButton = Template.bind();
SampleLinkButton.args = { onClick: () => { console.log("Button Clicked"); } };

export default { component: LinkButton, title: "Link Button" };
