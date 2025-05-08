/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { ErrorType } from "@wso2-enterprise/mi-core";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { Alert, Codicon, LinkButton, Typography } from "@wso2-enterprise/ui-toolkit";
import { useEffect, useState } from "react";

// Styles
const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    margin-top: 2em;
    padding: 0 32px;
    gap: 32px;

    * {
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        max-width: fit-content;
    }
`;

const TitlePanel = styled.div`
    display: flex;
    flex-direction: column;
`;

const Headline = styled.div`
    font-size: 2.7em;
    font-weight: 400;
    font-size: 2.7em;
    white-space: nowrap;
    padding-bottom: 10px;
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const ActionButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 24px;
`;

export const DisabledView = () => {
    const { rpcClient } = useVisualizerContext();
    const [errors, setErrors] = useState<ErrorType[]>([]);

    useEffect(() => {
        rpcClient.getVisualizerState().then((state) => {
            setErrors(state.errors);
        });
    });

    const handleFocusOutput = () => {
        rpcClient.getMiVisualizerRpcClient().focusOutput();
    };

    const handleRetry = () => {
        rpcClient.getMiVisualizerRpcClient().reloadWindow();
    };

    return (
        <Container>
            <TitlePanel>
                <Headline>Micro Integrator (MI) for VS Code</Headline>
                <span>
                    The extension is currently disabled due to the following errors. Please resolve the errors and retry.
                </span>
            </TitlePanel>
            <ErrorContainer>
                <div>
                    {errors?.map((error, index) => (
                        <Alert key={index} variant="error" title={error.title} subTitle={error.message} />
                    ))}
                </div>
                <ActionButtons>
                    <LinkButton onClick={handleFocusOutput}>
                        <Codicon name="eye" iconSx={{ fontSize: "18px" }} />
                        <Typography variant="body2">Show Logs</Typography>
                    </LinkButton>
                    <LinkButton onClick={handleRetry}>
                        <Codicon name="refresh" iconSx={{ fontSize: "18px" }} />
                        <Typography variant="body2">Retry</Typography>
                    </LinkButton>
                </ActionButtons>
            </ErrorContainer>
        </Container>
    );
};

