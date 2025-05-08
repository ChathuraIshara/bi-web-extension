/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from 'react';
import { AIMachineStateValue } from '@wso2-enterprise/ballerina-core';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import styled from '@emotion/styled';
import AIChat from './components/AIChat';
import { SignInToCopilotMessage } from './SignInWindow';
import { WaitingForLoginMessage } from './WaitingForSignIn';
import { DisabledWindow } from './DisabledWindow';
import { SettingsPanel } from './SettingsPanel';

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    width: 100vw;
`;

const ProgressRing = styled(VSCodeProgressRing)`
    height: 40px;
    width: 40px;
    margin-top: auto;
    padding: 4px;
`;

const AIPanel = (props: { state: AIMachineStateValue }) => {
    const { rpcClient } = useRpcContext();
    const [viewComponent, setViewComponent] = useState<React.ReactNode>();

    useEffect(() => {
        fetchContext();
    }, [props.state]);

    const fetchContext = () => {
        rpcClient.getAiPanelRpcClient().getAiPanelState().then((machineView) => {
            switch (machineView.state) {
                case "Ready":
                    setViewComponent(<AIChat />);
                    break;
                case "loggedOut":
                    setViewComponent(<SignInToCopilotMessage />);
                    break;
                case "WaitingForLogin":
                    setViewComponent(<WaitingForLoginMessage />);
                    break;
                case "disabled":
                    setViewComponent(<DisabledWindow />);
                    break;
                case "Settings":
                    setViewComponent(<SettingsPanel />);
                    break;
                default:
                    setViewComponent(<h1>{machineView.state}</h1>);
            }
        });

    }

    return (
        <div style={{
            height: "100%"
        }}>
            {!viewComponent ? (
                <LoaderWrapper>
                    <ProgressRing />
                </LoaderWrapper>
            ) : <div style={{ height: "100%" }}>
                {viewComponent}
            </div>}
        </div>
    );
};

export default AIPanel;   
