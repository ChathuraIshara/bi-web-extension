/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { DownloadProgress } from "@wso2-enterprise/ballerina-core";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import styled from "@emotion/styled";
import { Button, Icon, ProgressRing, ThemeColors } from "@wso2-enterprise/ui-toolkit";

const Wrapper = styled.div`
    height: calc(100vh - 100px);
    max-width: 800px;
    margin: 80px 120px;
    overflow: auto;
`;

const Headline = styled.div`
    font-size: 2.7em;
    font-weight: 400;
    font-size: 2.7em;
    white-space: nowrap;
    margin-bottom: 15px;
`;

const SubLine = styled.div`
    font-size: 2.0em;
    font-weight: 400;
    white-space: nowrap;
    margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
    margin-top: 10px;
    width: 100%;
`;

const ButtonContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    height: 28px;
`;

//

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 20px;
`;

const Caption = styled.div`
    font-size: 1.1em;
    line-height: 1.5em;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 5px;
`;

const StepContainer = styled.div`
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
`;

const StepTitle = styled.div<{ color?: string }>`
    font-size: 1.2em;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 5px;
    color: ${(props: { color?: string }) => props.color || "inherit"};
`;

const StepDescription = styled.div<{ color?: string }>`
    font-size: 1em;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 5px;
    color: ${(props: { color?: string }) => props.color || "inherit"};
`;

const IconContainer = styled.div`
    margin-top: 4px;
`;

export interface SetupViewProps {
    haveLS: boolean;
}

export function SetupView(props: SetupViewProps) {
    const { rpcClient } = useRpcContext();
    const { haveLS } = props;

    const [progress, setProgress] = React.useState<DownloadProgress>(null);

    const downloadLS = () => {
        rpcClient.getCommonRpcClient().executeCommand({ commands: ["ballerina.setup-ballerina"] });
    };

    const reloadVscode = () => {
        rpcClient.getCommonRpcClient().executeCommand({ commands: ["workbench.action.reloadWindow"] });
    };

    rpcClient?.onDownloadProgress((response: DownloadProgress) => {
        setProgress(response);
    });

    const getIcon = (complete: boolean, loading: boolean) => {
        if (complete) {
            return <Icon name="enable-inverse" iconSx={{ fontSize: "15px", color: ThemeColors.PRIMARY, cursor: "default" }} />;
        } else if (loading) {
            return <ProgressRing sx={{ height: "16px", width: "16px" }} color={ThemeColors.PRIMARY} />;
        } else {
            return <Icon name="radio-button-unchecked" iconSx={{ fontSize: "16px", cursor: "default" }} />;
        }
    };

    return (
        <Wrapper>
            <TitleContainer>
                <Headline>Ballerina Integrator for VS Code</Headline>
                <SubLine>Let's set up your environment</SubLine>
                <Caption>
                    Ballerina distribution is required but not found. Just click the button below, and we’ll take care of everything step by step.
                </Caption>
            </TitleContainer>
            <StyledButton appearance="primary" onClick={() => downloadLS()} disabled={progress !== null}>
                <ButtonContent>Set up Ballerina distribution</ButtonContent>
            </StyledButton>
            {progress &&
                <StepContainer>
                    <Row>
                        <IconContainer>
                            {getIcon(progress?.step > 1 || progress?.success, progress?.step === 1)}
                        </IconContainer>
                        <Column>
                            <StepTitle>Prepare Installation</StepTitle>
                            <StepDescription>Checking versions and preparing environment for installation.</StepDescription>
                        </Column>
                    </Row>
                    <Row>
                        <IconContainer>
                            {getIcon(progress?.step > 2 || progress?.success, progress?.step === 2)}
                        </IconContainer>
                        <Column>
                            <StepTitle>Install Ballerina Tool {progress?.step === 2 && progress?.percentage ? "(" + progress.percentage + "% - " + progress?.totalSize.toFixed(0) + "MB)" : ""}</StepTitle>
                            <StepDescription>Downloading and installing the Ballerina tool package.</StepDescription>
                        </Column>
                    </Row>
                    <Row>
                        <IconContainer>
                            {getIcon(progress?.step > 3 || progress?.success, progress?.step === 3)}
                        </IconContainer>
                        <Column>
                            <StepTitle>Install Ballerina Distribution {progress?.step === 3 && progress?.percentage ? "(" + progress.percentage + "% - " + progress?.totalSize.toFixed(0) + "MB)" : ""}</StepTitle>
                            <StepDescription>Downloading and installing the Ballerina distribution package.</StepDescription>
                        </Column>
                    </Row>
                    <Row>
                        <IconContainer>
                            {getIcon(progress?.step > 4 || progress?.success, progress?.step === 4)}
                        </IconContainer>
                        <Column>
                            <StepTitle>Install Java Runtime {progress?.step === 4 && progress?.percentage ? "(" + progress.percentage + "% - " + progress?.totalSize.toFixed(0) + "MB)" : ""}</StepTitle>
                            <StepDescription>Downloading and installing the required Java Runtime Environment.</StepDescription>
                        </Column>
                    </Row>
                    <Row>
                        <IconContainer>
                            {getIcon(progress?.step > 5 || progress?.success, progress?.step === 5)}
                        </IconContainer>
                        <Column>
                            <StepTitle>Complete Setup</StepTitle>
                            <StepDescription>Configuring VS Code, setting permissions and finalizing installation.</StepDescription>
                        </Column>
                    </Row>
                </StepContainer>
            }
            {progress && progress.step && progress.step === -1 && (
                <StepContainer>
                    <Row>
                        <Column>
                            <StepTitle color={ThemeColors.ERROR}>Something went wrong while setting up Ballerina Integrator</StepTitle>
                            <StepDescription>{progress.message}</StepDescription>
                            <StepDescription>
                                Please check your internet connection or permissions and try again.
                            </StepDescription>
                            <StyledButton appearance="primary" onClick={() => downloadLS()}>
                                <ButtonContent>Retry Setup</ButtonContent>
                            </StyledButton>
                        </Column>
                    </Row>
                </StepContainer>
            )}
            {progress && progress.success && (
                <StepContainer>
                    <Row>
                        <Column>
                            <StepTitle>Restart to apply changes</StepTitle>
                            <StepDescription>
                                To finish the setup, please restart the VS Code. This ensures everything is
                                configured correctly and ready to use.
                            </StepDescription>
                            <StyledButton appearance="primary" onClick={() => reloadVscode()}>
                                <ButtonContent>Restart VS Code</ButtonContent>
                            </StyledButton>
                        </Column>
                    </Row>
                </StepContainer>
            )}
        </Wrapper>
    );
}
