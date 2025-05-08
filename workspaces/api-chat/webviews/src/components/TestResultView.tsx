/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
 
import React, { useState } from "react";
import { VSCodeButton, VSCodeTextArea } from '@vscode/webview-ui-toolkit/react';
import { Badge } from "@wso2-enterprise/ui-toolkit";
import { TestResult } from "../ConsoleAPI";
import styled from "@emotion/styled";
import { Codicon } from "../Codicon/Codicon";


const colors = {
    "GET": '#3d7eff',
    "PUT": '#49cc90',
    "POST": '#fca130',
    "DELETE": '#f93e3e',
    "PATCH": '#986ee2',
}

const codeColors = {
    "INFORMATIONAL": "#6C757D",
    "SUCCESSFUL": "#28A745",
    "REDIRECTION": "#007aff",
    "CLIENTERROR": "#FFC107",
    "SERVERERROR": "#f93E3E"
}

function getColorByMethod(method: string) {
    switch (method) {
        case "GET":
            return colors.GET;
        case "PUT":
            return colors.PUT;
        case "POST":
            return colors.POST;
        case "DELETE":
            return colors.DELETE;
        case "PATCH":
            return colors.PATCH;
        default:
            return '#FFF'; // Default color
    }
}

function getColorByCode(code: number) {
    const firstDigit = parseInt(code.toString()[0]);
    switch (firstDigit) {
        case 1:
            return codeColors.INFORMATIONAL;
        case 2:
            return codeColors.SUCCESSFUL;
        case 3:
            return codeColors.REDIRECTION;
        case 4:
            return codeColors.CLIENTERROR;
        case 5:
            return codeColors.SERVERERROR;
        default:
            return '#FFF'; // Default color
    }
}

const Method = styled.div({
    display: 'inline-block',
    fontWeight: "bolder",
    padding: "4px 20px 4px 0"
});

const TestResultBlock = styled.div<{ isExpanded: boolean }>(({ isExpanded }) => ({
    margin: "10px",
    backgroundColor: isExpanded ? "var(--vscode-sideBar-background)" : "none"
}));

const TestResultHeader = styled.div({
    cursor: "pointer",
    "&:hover": {
        backgroundColor: "var(--list-hover-background)"
    }
});

const RequestPanel = styled.div({
    padding: '10px',
    backgroundColor: 'var(--vscode-sideBar-background)'
});

const TestResult = ({ log }: { log: TestResult }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };
    // Your code here
    return (
        <TestResultBlock isExpanded={isExpanded}>
            <TestResultHeader onClick={toggleExpansion} style={{ padding: "5px 0 5px 0" }}>
                <Badge color={getColorByCode(log.output.code)}>{log.output.code}</Badge>
                <Method style={{ color: getColorByMethod(log.request.method), width: "30px" }}>{log.request.method}</Method>
                <span>{log.request.path}</span>
                {isExpanded ?
                    <VSCodeButton appearance="icon" style={{ float: "right", marginRight: "10px" }}>
                        <Codicon name="chevron-up" />
                    </VSCodeButton> :
                    <VSCodeButton appearance="icon" style={{ float: "right", marginRight: "10px" }}>
                        <Codicon name="chevron-down" />
                    </VSCodeButton>}
            </TestResultHeader>
            {isExpanded && (
                <>
                    <RequestPanel>
                        {log.request.inputs.requestBody &&
                            <>
                                <h4 style={{ margin: "0 0 5px 0" }}>Request Body</h4>
                                <VSCodeTextArea
                                    style={{ fontFamily: "monospace", width: "100%", marginBottom: "10px" }}
                                    value={JSON.stringify(log.request.inputs.requestBody, null, 2)}
                                    rows={calculateNumberOfLines(JSON.stringify(log.request.inputs.requestBody, null, 2))}
                                    readOnly={true}>
                                </VSCodeTextArea>
                            </>
                        }
                        <h4 style={{ margin: "0 0 5px 0" }}>Response Payload</h4>
                        <VSCodeTextArea
                            style={{ fontFamily: "monospace", width: "100%" }}
                            value={JSON.stringify(log.output.payload, null, 2)}
                            rows={calculateNumberOfLines(JSON.stringify(log.output.payload, null, 2))}
                            readOnly={true}>
                        </VSCodeTextArea>
                        {/* <div style={{ display: "flex", marginTop: "5px" }}>
                            <VSCodeButton onClick={() => { }} appearance="icon">
                                <Codicon name="copy" /> &nbsp;Run as cURL
                            </VSCodeButton>
                            &nbsp;
                            <VSCodeButton onClick={() => { }} appearance="icon">
                                <Codicon name="file-symlink-file" /> &nbsp;Open in REST Client
                            </VSCodeButton>
                        </div> */}
                    </RequestPanel>
                </>
            )}
        </TestResultBlock>
    );
};

export default TestResult;

const calculateNumberOfLines = (str: string): number => {

    const lines = str.split(/\r?\n/);

    // Get approximate number of lines considering the character length
    const viewWidth = document.documentElement.clientWidth;
    const textAreaWidth = viewWidth - 70;
    const charWidth = 8.5;
    const approxLines = Math.ceil((str.length * charWidth) / textAreaWidth);

    if (lines.length > 25 || approxLines > 25) {
        return 25;
    }
    return Math.max(approxLines, lines.length);
};
