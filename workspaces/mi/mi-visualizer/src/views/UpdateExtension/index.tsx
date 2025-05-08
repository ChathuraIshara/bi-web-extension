/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';

import { AlertBox } from "../AlertBox/AlertBox";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 8px;
`;

const WideVSCodeButton = styled(VSCodeButton)`
    width: 100%;
    max-width: 300px;
    margin: 15px 0 15px 0;
    align-self: center;
`;

export const UpdateMIExtension = () => {
    const { rpcClient } = useVisualizerContext();

    const openExtensionUpdatePage = async () => {
        await rpcClient.getMiDiagramRpcClient().openUpdateExtensionPage();
    };

    return (
        <Container>
                <AlertBox
                    buttonTitle="Update Extension"
                    onClick={openExtensionUpdatePage} 
                    title={"You are in an older version of Micro Integrator extension."}
                    subTitle={"To continue using the MI Copilot Chat please update to the latest version."}
                />
        </Container>
    );
};
