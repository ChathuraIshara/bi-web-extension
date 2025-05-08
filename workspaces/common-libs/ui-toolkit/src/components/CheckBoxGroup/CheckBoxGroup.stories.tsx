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
import { CheckBox, CheckBoxGroup, CheckBoxGroupProps } from "./CheckBoxGroup";
import styled from "@emotion/styled";

const Container = styled.div`
    display: flex;
    gap: 20px;
`;

const Template: ComponentStory<typeof CheckBoxGroup> = (args: CheckBoxGroupProps) => {
    const [values, setValues] = React.useState({
        "option1": true,
        "option2": false,
        "option3": true,
        "option4": false,
        "option5": false,
    });

    return (
        <Container>
            <CheckBoxGroup {...args}>
                <CheckBox label="Option 1" value="option-1" checked={values.option1} onChange={(checked: boolean) => setValues({...values, option1: checked })} />
                <CheckBox label="Option 2" value="option-2" checked={values.option2} onChange={(checked: boolean) => setValues({...values, option2: checked })} />
                <CheckBox label="Option 3" value="option-3" checked={values.option3} onChange={(checked: boolean) => setValues({...values, option3: checked })} />
                <CheckBox label="Option 4" value="option-4" checked={values.option4} onChange={(checked: boolean) => setValues({...values, option4: checked })} />
                <CheckBox label="Option 5" value="option-5" checked={values.option5} onChange={(checked: boolean) => setValues({...values, option5: checked })} />
            </CheckBoxGroup>
        </Container>
    );
};

export const Default = Template.bind();
Default.args = {
    direction: "horizontal",
};

export default { component: CheckBoxGroup, title: "CheckBoxGroup" };
