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
import { Typography } from "./Typography";

const Template: ComponentStory<typeof Typography> = () => (
    <>
        <Typography variant="h1">
            h1. Heading
        </Typography>
        <Typography variant="h2">
            h2. Heading
        </Typography>
        <Typography variant="h3">
            h3. Heading
        </Typography>
        <Typography variant="h4">
            h4. Heading
        </Typography>
        <Typography variant="h5">
            h5. Heading
        </Typography>
        <Typography variant="h6">
            h6. Heading
        </Typography>
        <Typography variant="subtitle1">
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2">
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur
        </Typography>
        <Typography variant="body1">
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2">
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
        </Typography>
        <Typography variant="body3">
            body3. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
        </Typography>
        <Typography variant="button">
            button text
        </Typography>
        <Typography variant="caption">
            caption text
        </Typography>
        <Typography variant="overline">
            overline text
        </Typography>
    </>
);

export const Example = Template.bind();

export default { component: Typography, title: "Typography" };
