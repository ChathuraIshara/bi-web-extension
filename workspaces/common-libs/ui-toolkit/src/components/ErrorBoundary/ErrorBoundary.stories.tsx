/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";
import { ComponentStory } from "@storybook/react";
import { ErrorBoundary as EB } from "./ErrorBoundary";
import { ErrorBoundaryProps } from "react-error-boundary";
import { Button } from "../Button/Button";

function MyComponent() {
    const [shouldThrowError, setShouldThrowError] = useState(false);

    const handleClick = () => {
        setShouldThrowError(true);
    };

    if (shouldThrowError) {
        // This will be caught by the error boundary due to being part of the rendering phase
        throw new Error('This is an error');
    }

    return <Button onClick={handleClick}>My Component</Button>;
}

const Template: ComponentStory<typeof EB> = (args: ErrorBoundaryProps) => <EB {...args} />;

export const ErrorBoundary = Template.bind();
ErrorBoundary.args = { children: <MyComponent />, errorMsg: "An error occurred" };

export default { component: ErrorBoundary, title: "Error Boundary" };
