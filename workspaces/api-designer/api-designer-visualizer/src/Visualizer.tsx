/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { createRef, useEffect } from "react";
import { useVisualizerContext } from "@wso2-enterprise/api-designer-rpc-client";
import { MachineStateValue } from "@wso2-enterprise/api-designer-core";
import MainPanel from "./MainPanel";
import styled from "@emotion/styled";
import { ErrorBoundary } from "@wso2-enterprise/ui-toolkit";

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    width: 100vw;
`;

const MODES = {
    VISUALIZER: "visualizer",
    AI: "ai",
    RUNTIME_SERVICES: "runtime-services",
    SWAGGER: "swagger"
};

export function Visualizer({ mode }: { mode: string }) {
    const { rpcClient } = useVisualizerContext();
    const errorBoundaryRef = createRef<any>();
    const [state, setState] = React.useState<MachineStateValue>('initialize');

    const handleResetError = () => {
        if (errorBoundaryRef.current) {
            errorBoundaryRef.current.resetErrorBoundary();
        }
    };

    rpcClient?.onStateChanged((newState: MachineStateValue) => {
        setState(newState);
    });

    useEffect(() => {
        rpcClient.webviewReady();
    }, []);

    return (
        <ErrorBoundary errorMsg="An error occurred in the API Designer" ref={errorBoundaryRef}>
            {(() => {
                switch (mode) {
                    case MODES.VISUALIZER:
                        return <VisualizerComponent state={state as MachineStateValue} handleResetError={handleResetError} />
                }
            })()}
        </ErrorBoundary>
    );
};

const VisualizerComponent = React.memo(({ state, handleResetError }: { state: MachineStateValue, handleResetError: () => void }) => {
    switch (true) {
        case typeof state === 'object' && 'ready' in state && state.ready === "viewReady":
            return <MainPanel handleResetError={handleResetError} />;
        // case typeof state === 'object' && 'newProject' in state && state.newProject === "viewReady":
        //     return <APIDesigner openAPIDefinition={apiDefinition} fileUri={fileUri}/>;
        case state === 'disabled':
            return <>Disabled View</>
        default:
            return (
                <LoaderWrapper>
                </LoaderWrapper>
            );
    }
});
