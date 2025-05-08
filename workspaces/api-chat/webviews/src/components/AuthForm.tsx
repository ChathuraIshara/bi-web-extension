/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import { VSCodeTextField, VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import styled from '@emotion/styled';

const FormWrapper = styled.div({
    padding: "0px 20px 20px 20px"
});

const Label = styled.div({
    marginBottom: "5px"
});

type AuthFormProps = {
    onAuthSubmit: (authData: any) => void;
    onClose: () => void;
    authData: any;
};

function AuthForm({ onAuthSubmit, onClose, authData }: AuthFormProps) {

    const [authType, setAuthType] = useState(authData.type || 'none');
    const [username, setUsername] = useState(authData.username || '');
    const [password, setPassword] = useState(authData.password || '');
    const [token, setToken] = useState(authData.token || '');
    const [headerName, setHeaderName] = useState(authData.headerName || '');
    const [headerValue, setHeaderValue] = useState(authData.headerValue || '');

    const handleAuthTypeChange = (event: any) => {
        setAuthType(event.target.value);
    };

    const handleUsernameChange = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const handleTokenChange = (event: any) => {
        setToken(event.target.value);
    };

    const handleHeaderNameChange = (event: any) => {
        setHeaderName(event.target.value);
    };

    const handleHeaderValueChange = (event: any) => {
        setHeaderValue(event.target.value);
    };

    const handleSubmit = () => {
        let authData = {};

        if (authType === 'none') {
            authData = {
                type: 'none'
            };
        } else if (authType === 'basic') {
            authData = {
                type: 'basic',
                username: username,
                password: password
            };
        } else if (authType === 'bearer') {
            authData = {
                type: 'bearer',
                token: token
            };
        } else if (authType === 'key') {
            authData = {
                type: 'key',
                headerName: headerName,
                headerValue: headerValue
            };
        }

        onAuthSubmit(authData);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <FormWrapper>
                <h3>Authentication Details</h3>
                <Label>Select the authentication type:</Label>
                <VSCodeDropdown value={authType} onChange={handleAuthTypeChange} style={{ marginBottom: "10px", width: "200px" }}>
                    <VSCodeOption value='none'>None</VSCodeOption>
                    <VSCodeOption value='basic'>Authorization Basic</VSCodeOption>
                    <VSCodeOption value='bearer'>Authorization Bearer</VSCodeOption>
                    <VSCodeOption value='key'>API Key</VSCodeOption>
                </VSCodeDropdown>

                {authType === 'none' &&
                    <>
                        <div style={{ width: "100%" }}></div>
                    </>
                }

                {authType === 'basic' && (
                    <>
                        <Label>Username</Label>
                        <VSCodeTextField
                            value={username}
                            onInput={handleUsernameChange}
                            placeholder="Username"
                            style={{ width: '100%', marginBottom: "10px" }}
                        />
                        <Label>Password</Label>
                        <VSCodeTextField
                            value={password}
                            onInput={handlePasswordChange}
                            placeholder="Password"
                            style={{ width: '100%', marginBottom: "10px" }}
                            type='password'
                        />
                    </>
                )}

                {authType === 'bearer' && (
                    <>
                        <Label>Bearer Token </Label>
                        <VSCodeTextField
                            value={token}
                            onInput={handleTokenChange}
                            placeholder="Token"
                            style={{ width: '100%', marginBottom: "10px" }}
                        />
                    </>
                )}

                {authType === 'key' && (
                    <>
                        <Label>Header Name</Label>
                        <VSCodeTextField
                            value={headerName}
                            onInput={handleHeaderNameChange}
                            placeholder="Header Name"
                            style={{ width: '100%', marginBottom: "10px" }}
                        />
                        <Label>Header Value</Label>
                        <VSCodeTextField
                            value={headerValue}
                            onInput={handleHeaderValueChange}
                            placeholder="Header Value"
                            style={{ width: '100%', marginBottom: "10px" }}
                        />
                    </>
                )}
                <div style={{ marginTop: "10px" }}>
                    <VSCodeButton onClick={handleSubmit}>Submit</VSCodeButton>
                    <VSCodeButton onClick={handleClose} appearance={"secondary"} style={{ marginLeft: "10px" }}>Close</VSCodeButton>
                </div>
            </FormWrapper>
        </>
    );
}

export default AuthForm;
