/*
 *  Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
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
import { AIMachineStateValue, AI_EVENT_TYPE, AI_MACHINE_VIEW } from '@wso2-enterprise/ballerina-core';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';

import { AlertBox } from "./AlertBox";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 8px;
`;

export const SignInToCopilotMessage = (props: { showProjectHeader?: boolean }) => {
    const { rpcClient } = useRpcContext();
    const { showProjectHeader } = props;

    const signInToCopilot = () => {
        rpcClient.getAiPanelRpcClient().login();
    };


    return (
        <Container>
            <AlertBox
                buttonTitle="Sign In"
                onClick={signInToCopilot}
                subTitle={
                    "Please sign in to enable Copilot Artifical Intelligence features"
                }
                title={"WSO2 Copilot Account Not Found"}
            />
        </Container>
    );
};
