/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { ComponentStory } from "@storybook/react";
import { Banner, BannerProps } from "./Banner";
import { Codicon } from "../Codicon/Codicon";

const Template: ComponentStory<typeof Banner> = (args: BannerProps) => <Banner {...args} />;

const Icon = () => <Codicon iconSx={{ fontSize: 18 }} name="info" />;
export const BannerWithoutTitle = Template.bind();
BannerWithoutTitle.args = { icon: <Icon />, message: "This is a sample banner without title", onClose: () => {console.log("Banner closed")}};

const InfoIcon = () => <Codicon iconSx={{ fontSize: 18 }} name="info" />;
export const InfoBanner = Template.bind();
InfoBanner.args = { icon: <InfoIcon />, type: "info", message: "This is a sample info banner"};

const ErrorIcon = () => <Codicon iconSx={{ fontSize: 18 }} name="error" />;
export const ErrorBanner = Template.bind();
ErrorBanner.args = { icon: <ErrorIcon />, type: "error", message: "This is a sample error banner", title: "Error Banner" };

const SuccessIcon = () => <Codicon iconSx={{ fontSize: 18 }} name="check" />;
export const SuccessBanner = Template.bind();
SuccessBanner.args = { icon: <SuccessIcon />, type: "success", message: "This is a sample success banner", title: "Success Banner", onClose: undefined };

const WarningIcon = () => <Codicon iconSx={{ fontSize: 18 }} name="warning" />;
export const WarningBanner = Template.bind();
WarningBanner.args = { icon: <WarningIcon />, type: "warning", message: "This is a sample warning banner", title: "Warning Banner", onClose: undefined };

export default { component: Banner, title: "Banner" };
