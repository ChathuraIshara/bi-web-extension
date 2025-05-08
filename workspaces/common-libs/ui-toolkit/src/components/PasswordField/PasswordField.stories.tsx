/*
 *  Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 *  This software is the property of WSO2 LLC. and its suppliers, if any.
 *  Dissemination of any information or reproduction of any material contained
 *  herein is strictly forbidden, unless permitted by WSO2 in accordance with
 *  the WSO2 Commercial License available at http://wso2.com/licenses.
 *  For specific language governing the permissions and limitations under
 *  this license, please see the license as well as any agreement you’ve
 *  entered into with WSO2 governing the purchase of this software and any
 *  associated services.
 */
import React from "react";
import { PasswordField } from "./PasswordField";
import styled from "@emotion/styled";
import { storiesOf } from "@storybook/react";

export default {
    component: PasswordField,
    title: 'PasswordField',
};

const Container = styled.div`
    min-height: 500px;
`;

export const Password = () => {
    const [values, setValues] = React.useState<string>("Password");

    return (
        <Container>
            <PasswordField
                value={values}
                label="Password"
                showPassword={false}
                onTextChange={(value: string) => setValues(value)}
                onPasswordToggle={(showPassword: boolean) => console.log("Password visibility: ", showPassword)}
            />
        </Container>
    );
};
storiesOf("Password Field").add("Default", () => <Password />);
