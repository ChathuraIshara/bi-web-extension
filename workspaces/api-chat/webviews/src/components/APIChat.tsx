/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useRef } from "react";
import { ConsoleAPI, TestCommand, TestResult, Queries, TestError, FinalResult } from "../ConsoleAPI";
import { VSCodeButton, VSCodeTextField, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import styled from "@emotion/styled";
import Welcome from './Welcome';
import { Codicon } from '../Codicon/Codicon';
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import TestResultView from "./TestResultView";
import APIChatLogo from "./APIChatLogo";

const Command = styled.div({
    backgroundColor: "var(--vscode-chat-requestBackground)",
    borderBottom: "1px solid var(--vscode-chat-requestBorder)",
    borderTop: "1px solid var(--vscode-chat-requestBorder)",
    padding: "20px",
});

const Error = styled.div({
    padding: "10px 20px",
    color: "var(--vscode-inputValidation-errorBorder)",
});

const Layout = styled.div({
    position: "relative",
    color: "var(--vscode-editorCodeLens-foreground)",
    height: "100vh",
    overflow: "auto"
});

const CommandPanel = styled.div({
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid var(--vscode-panel-border)",
    padding: "15px",
});

const DisplayPanel = styled.div({
    height: "calc(100% - 90px)",
    overflow: "auto",
});

const FlexRow = styled.div({
    display: "flex",
    flexDirection: "row",
});

const SmallProgressRing = styled(VSCodeProgressRing)`
    height: calc(var(--design-unit) * 3px);
    width: calc(var(--design-unit) * 3px);
    margin-top: auto;
    padding: 4px;
`;

const StatusMessage = styled.div({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    padding: "10px",
    marginLeft: "8px"
});

const LogoWrapper = styled.div({
    margin: "0px 0px 0px 20px",
    display: "inline-block",
    verticalAlign: "-5px"

});

const Message = styled.div({
    display: "inline-block",
    marginLeft: "5px"
});

const ROOT_CSS = css({
    height: "100%",
});

const APIChat = (props: {
    state: string,
    logs: (TestCommand | TestResult | TestError | FinalResult)[],
    queries: Queries[]
    showAuthForm: () => void;
    stopExecution: () => void;
}) => {

    const [testInput, setTestInput] = React.useState("");


    const handleExecuteTest = (event: any, state: string) => {
        if (state === "ready") {
            if (event.key === "Enter" && testInput !== "") {
                ConsoleAPI.getInstance().executeTest(testInput);
                setTestInput("");
            }
        }
    };

    const handleExecuteButton = () => {
        ConsoleAPI.getInstance().executeTest(testInput);
        setTestInput("");
    }

    const handleRerun = (command: string) => {
        ConsoleAPI.getInstance().executeTest(command);
        setTestInput("");
    }

    const handleScenarioTest = (query: string) => {
        ConsoleAPI.getInstance().executeTest(query);
    }

    const handleInputChange = (event: any) => {
        setTestInput(event.target.value);
    };

    const inputReference = useRef(null);

    useEffect(() => {
        // ignore following tyescript error
        // @ts-ignore
        inputReference.current.focus();
    }, []);

    return (
        <Layout>
            <DisplayPanel>
                <ScrollToBottom className={ROOT_CSS}>
                    <>
                        <Welcome state={props.state} queries={props.queries} handleScenarioTest={handleScenarioTest} />
                        {props.logs.map((log) => {
                            if (log.type === "COMMAND") {
                                return <Command style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                        <Codicon name="account" />
                                        <Message>{log.command}</Message>
                                    </div>
                                    <VSCodeButton appearance="icon" onClick={() => handleRerun(log.command)} title="Rerun">
                                        <Codicon name="debug-rerun" />
                                    </VSCodeButton>
                                </Command>;
                            }
                            if (log.type === "RESULT") {
                                return <TestResultView log={log} />
                            }
                            if (log.type === "ERROR") {
                                return <Error>
                                    <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                        <Codicon name="error" />
                                        <Message>{log.message}</Message>
                                    </div>
                                </Error>;
                            }
                            if (log.type === "FINAL_RESULT") {
                                return <p>
                                    <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                        <LogoWrapper>
                                            <APIChatLogo width="16" height="16" />
                                        </LogoWrapper>
                                        <Message>
                                            {(log as FinalResult).message}
                                        </Message>
                                    </div>
                                </p>
                            }
                            return null;
                        })
                        }
                    </>
                    {props.state === "executing.initExecution" && (
                        <StatusMessage>
                            <SmallProgressRing />
                            <div>Initializing request...</div>
                        </StatusMessage>
                    )}
                    {props.state === "executing.fetchRequest" && (
                        <StatusMessage>
                            <SmallProgressRing />
                            <div>Generating request...</div>
                        </StatusMessage>
                    )}
                    {props.state === "executing.executeRequest" && (
                        <StatusMessage>
                            <SmallProgressRing />
                            <div>Executing request...</div>
                        </StatusMessage>
                    )}
                    {props.state === "executing.processRequest" && (
                        <StatusMessage>
                            <SmallProgressRing />
                            <div>Executing request...</div>
                        </StatusMessage>
                    )}
                    {props.state === "executing.end" && (
                        <StatusMessage>
                            <SmallProgressRing />
                            <div>Executing request...</div>
                        </StatusMessage>
                    )}

                </ScrollToBottom>
                {["executing.initExecution", "executing.fetchRequest", "executing.executeRequest", "executing.processRequest"].includes(props.state) && (
                    <div style={{ position: "absolute", bottom: "100px", right: "50%", transform: "translateX(50%)" }}>
                        <VSCodeButton onClick={props.stopExecution} appearance="icon">
                            <Codicon name="debug-stop" /> &nbsp;Stop Execution
                        </VSCodeButton>
                    </div>
                )}
            </DisplayPanel>
            <CommandPanel>
                <FlexRow>
                    <VSCodeTextField
                        value={testInput}
                        onInput={handleInputChange}
                        onKeyDown={(event) => handleExecuteTest(event, props.state)}
                        placeholder="Type a command to test"
                        innerHTML="true"
                        style={{ width: "calc(100% - 35px)" }}
                        ref={inputReference}
                    >
                    </VSCodeTextField>
                    <VSCodeButton
                        appearance="secondary"
                        disabled={props.state !== "ready"}
                        onClick={handleExecuteButton}
                        style={{ width: "35px" }}>
                        <span className="codicon codicon-send"></span>
                    </VSCodeButton>
                </FlexRow>
                <FlexRow style={{ marginTop: "10px" }}>
                    {/* <VSCodeButton style={{ marginRight: "20px" }} appearance="icon"><Codicon name="link" /> &nbsp;Change Endpoint</VSCodeButton> */}
                    <VSCodeButton appearance="icon" onClick={props.showAuthForm}><Codicon name="lock" /> &nbsp; Authenticate</VSCodeButton>
                </FlexRow>
            </CommandPanel>
        </Layout >
    );
}


export default APIChat;
