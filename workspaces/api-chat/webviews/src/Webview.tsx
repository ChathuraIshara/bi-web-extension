/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect } from 'react';
import URLForm from './components/URLForm';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { ConsoleAPI, StateChangeEvent, TestCommand, TestResult, Queries, TestError, FinalResult } from "./ConsoleAPI";
import APIChat from './components/APIChat';
import AuthForm from './components/AuthForm';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { Codicon } from './Codicon/Codicon';
import styled from "@emotion/styled";

const StatusMessage = styled.div({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px",
    marginLeft: "8px",
    height: "90vh",
    fontSize: "16px"
});

const SmallProgressRing = styled(VSCodeProgressRing)`
    height: 20px;
    width: 20px;
`;


const Webview = () => {
    const [state, setState] = React.useState("");
    const [logs, setLogs] = React.useState<(TestCommand | TestResult | TestError | FinalResult)[]>([]);
    const [queries, setQueries] = React.useState<Queries[]>([]);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [showAuthForm, setShowAuthForm] = React.useState(false);
    const [authData, setAuthData] = React.useState({ type: "none" });
    const [showErrorDetails, setShowErrorDetails] = React.useState(false);

    useEffect(() => {
        // set the state when component loads
        ConsoleAPI.getInstance().getState()
            .then((newState: string) => {
                setState(newState);
            });
    }, []);

    useEffect(() => {
        // set the state when component loads
        ConsoleAPI.getInstance().getAuthentication()
            .then((authData: any) => {
                setAuthData(authData);
            });
    }, []);

    useEffect(() => {
        // update on state change
        ConsoleAPI.getInstance().onStateChanged((state: StateChangeEvent) => {
            setState(state.state);
            setLogs(state.logs);
            setQueries(state.queries);
            setErrorMessage(state.errorMessage);
        });
    }, [state, logs, queries]);

    const handleURLSubmit = (url: string) => {
        ConsoleAPI.getInstance().setUrl(url);
    };

    const handleShowAuth = () => {
        setShowAuthForm(true);
    };

    const handleAuthSubmit = (authData: any) => {
        setAuthData(authData);
        ConsoleAPI.getInstance().setAuthentication(authData);
        setShowAuthForm(false);
    }

    const handleCloseAuthForm = () => {
        setShowAuthForm(false);
    }

    const reTry = () => {
        ConsoleAPI.getInstance().refreshConsole();
    };

    const handleStopExecution = () => {
        ConsoleAPI.getInstance().stopExecution();
    }


    return <>
        {(() => {
            if (showAuthForm) {
                return <AuthForm onAuthSubmit={handleAuthSubmit} onClose={handleCloseAuthForm} authData={authData} />
            } else {
                switch (state) {
                    case "loading.getUrl":
                        return <URLForm onURLSubmit={handleURLSubmit} onClose={() => { }}></URLForm>
                    case "loading.getTools":
                    case "loading.createClient":
                        return (
                            <StatusMessage>
                                <SmallProgressRing />
                                <div>Analysing OpenAPI, Please wait ...</div>
                            </StatusMessage>
                        );
                    case "ready":
                    case "executing.initExecution":
                    case "executing.fetchRequest":
                    case "executing.executeRequest":
                    case "executing.processRequest":
                    case "executing.end":
                        return <APIChat
                            state={state}
                            logs={logs}
                            queries={queries}
                            showAuthForm={handleShowAuth}
                            stopExecution={handleStopExecution} />;
                    default:
                        return <StatusMessage style={{ flexDirection: "column" }}>
                            <div>
                                An error occurred. Please retry again. &nbsp;
                                {!showErrorDetails &&
                                    <a href="#" onClick={() => setShowErrorDetails(!showErrorDetails)}>Show Error</a>
                                }
                            </div>
                            {showErrorDetails && <div>Error: {errorMessage}</div>}

                            <VSCodeButton onClick={reTry}><Codicon name='refresh' /> Retry</VSCodeButton>
                        </StatusMessage>;
                }
            }
        })()}
    </>
};

export default Webview;
