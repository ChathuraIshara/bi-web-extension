/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { storiesOf } from "@storybook/react";
import { SplitView } from "./SplitView";
import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
    min-height: 500px;
`;

export const SplitViewStory = () => {
    return (
        <Container>
            <SplitView sx={{height: "100vh"}}>
                <div><h1>Div1</h1></div>
                <div><h1>Div2</h1></div>
                <div><h1>Div3</h1></div>
            </SplitView>
        </Container>
    );
};

storiesOf("SplitView").add("SplitViewStory", () => <SplitViewStory />);
