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
import styled from "@emotion/styled";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { Button, Codicon, Typography } from "@wso2-enterprise/ui-toolkit";

import {
    AIChatView,

} from './styles'


const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 28px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px;
`;

const VerticalLine = styled.div`
    width: 100%;
    height: 1px;
    background-color: var(--vscode-editorWidget-border);
`;

const RowGroup = styled.div`
    display: flex;
    width: 100%;
    align-items: flex-start;
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 4px;
`;

const TitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    width: 100%;
`;
export const SettingsPanel = (props: { showProjectHeader?: boolean }) => {
    const { rpcClient } = useRpcContext();
    const { showProjectHeader } = props;

    const [copilotAuthorized, setCopilotAuthorized] = React.useState(false);
    const [wso2AILoggedIn, setWso2AILoggedIn] = React.useState(false);

    async function handleChat() {
        await rpcClient.getAiPanelRpcClient().openChat();
    }

    async function handleWSO2Login() {
        await rpcClient.getAiPanelRpcClient().login();
        // setWso2AILoggedIn(true);
    }

    async function handleWSO2Logout() {
        await rpcClient.getAiPanelRpcClient().logout();
        setWso2AILoggedIn(false);
    }

    async function handleAuthorizeCopilot() {
        const resp = await rpcClient.getAiPanelRpcClient().promptGithubAuthorize();
        console.log("called auth copilot", resp);
        if (resp) {
            setCopilotAuthorized(true);
        } else {
            setCopilotAuthorized(false);
        }
    }

    async function isCopilotAuthorized() {
        return await rpcClient.getAiPanelRpcClient().isCopilotSignedIn();
    }

    async function isWSO2AILoggedIn() {
        return await rpcClient.getAiPanelRpcClient().isWSO2AISignedIn();
    }

    React.useEffect(() => {
        isCopilotAuthorized().then((authorized) => {
            setCopilotAuthorized(authorized);
        });
        isWSO2AILoggedIn().then((loggedIn) => {
            setWso2AILoggedIn(loggedIn);
        });
    }, []);

    const messagesEndRef = React.createRef<HTMLDivElement>();

    return (
        <AIChatView>
            <Header>
                {wso2AILoggedIn && (
                    <Button appearance="icon" onClick={() => handleChat()} tooltip="Chat">
                        <Codicon name="arrow-left" />
                    </Button>
                )}
                <Typography variant="subtitle2">Manage Accounts</Typography>
            </Header>
            <VerticalLine />
            <Container>
                <Typography variant="subtitle1">Connect to AI Platforms for Enhanced Features</Typography>
                <RowGroup>
                    <Row>
                        <Typography variant="subtitle2">Login to WSO2 Copilot</Typography>
                    <Typography variant="caption">Login to access AI-powered code generation, completions, test generation, data mappings, and more.</Typography>
                    </Row>
                    {
                            wso2AILoggedIn
                                ? <Button onClick={() => handleWSO2Logout()}>Logout</Button>
                                : <Button onClick={() => handleWSO2Login()}>Login</Button>
                    }
                </RowGroup>
                <RowGroup>
                    <Row>
                        <Typography variant="subtitle2">Enable GitHub Copilot Integration</Typography>
                        <Typography variant="caption">Authorize Github Copilot and get Visual Completions via Github.</Typography>
                    </Row>
                    <Button onClick={() => handleAuthorizeCopilot()} disabled={copilotAuthorized}>
                        {copilotAuthorized ? "Authorized" : "Authorize"}
                    </Button>
                </RowGroup>
                <div ref={messagesEndRef} />
            </Container>
        </AIChatView>
    );
};
