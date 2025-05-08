/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { createRef, useEffect } from "react";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { MachineStateValue, AIMachineStateValue, SwaggerData } from "@wso2-enterprise/mi-core";
import MainPanel from "./MainPanel";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import styled from "@emotion/styled";
import { AIPanel } from "./views/AIPanel";
import { ErrorBoundary } from "@wso2-enterprise/ui-toolkit";
import { WelcomePanel } from "./WelcomePanel";
import { DisabledView } from "./views/Disabled";
import { RuntimeServicePanel } from "./RuntimeServicesPanel";
import { SwaggerPanel } from "./SwaggerPanel";
import { gitIssueUrl } from "./constants";
import { EnvironmentSetup } from "./views/EnvironmentSetup";

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

const MODES = {
    VISUALIZER: "visualizer",
    AI: "ai",
    RUNTIME_SERVICES: "runtime-services",
    SWAGGER: "swagger"
};

export function Visualizer({ mode, swaggerData }: { mode: string, swaggerData?: SwaggerData }) {
    const { rpcClient } = useVisualizerContext();
    const errorBoundaryRef = createRef<any>();
    const [state, setState] = React.useState<MachineStateValue | AIMachineStateValue>('initialize');

    const handleResetError = () => {
        if (errorBoundaryRef.current) {
            errorBoundaryRef.current.resetErrorBoundary();
        }
    };

    rpcClient?.onStateChanged((newState: MachineStateValue | AIMachineStateValue) => {
        setState(newState);
    });

    useEffect(() => {
        rpcClient.webviewReady();
        if (mode === "ai") {
            rpcClient.getAIVisualizerState().then(context => {
                setState(context.state);
            });
        }
    }, []);

    const goHome = () => {
        rpcClient.getMiVisualizerRpcClient().goHome();
    };

    return (
        <ErrorBoundary goHome={goHome} errorMsg="An error occurred in the MI Diagram" issueUrl={gitIssueUrl} ref={errorBoundaryRef}>
            {(() => {
                switch (mode) {
                    case MODES.VISUALIZER:
                        return <VisualizerComponent state={state as MachineStateValue} handleResetError={handleResetError} />
                    case MODES.AI:
                        return <AiVisualizerComponent state={state as AIMachineStateValue} />
                    case MODES.RUNTIME_SERVICES:
                        return <RuntimeServicesComponent />
                    case MODES.SWAGGER:
                        return <SwaggerComponent data={swaggerData} />
                }
            })()}
        </ErrorBoundary>
    );
};

const VisualizerComponent = React.memo(({ state, handleResetError }: { state: MachineStateValue, handleResetError: () => void }) => {
    switch (true) {
        case typeof state === 'object' && 'ready' in state && state.ready === "viewReady":
            return <MainPanel handleResetError={handleResetError} />;
        case typeof state === 'object' && 'newProject' in state && state.newProject === "viewReady":
            return <WelcomePanel />;
        case typeof state === 'object' && 'environmentSetup' in state && state.environmentSetup === "viewReady":
            return <EnvironmentSetup />
        case state === 'disabled':
            return <DisabledView />
        default:
            return (
                <LoaderWrapper>
                    <ProgressRing />
                </LoaderWrapper>
            );
    }
});

const AiVisualizerComponent = React.memo(({ state }: { state: AIMachineStateValue }) => {
    switch (true) {
        case state !== 'Initialize':
            return <AIPanel />;
        default:
            return (
                <LoaderWrapper>
                    <ProgressRing />
                </LoaderWrapper>
            );
    }
});

const RuntimeServicesComponent = () => {
    return <RuntimeServicePanel />;
}

const SwaggerComponent = React.memo(({ data }: { data: SwaggerData }) => {
    if (!data) {
        return (
            <LoaderWrapper>
                <ProgressRing />
            </LoaderWrapper>
        );
    }
    return <SwaggerPanel swaggerData={data} />;
});
