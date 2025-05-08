/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
 
import React from "react";
import styled from "@emotion/styled";
import { Queries } from "../ConsoleAPI";

const WelcomeContainer = styled.div({
    padding: "0px 20px 16px 20px",
});

const Scenario = styled.div({
    paddingBottom: '5px',
    backgroundColor: 'var(--vscode-sideBar-background)', // Card background color
    borderRadius: '4px', // Card border radius
    padding: '10px', // Card padding
    marginBottom: '10px', // Card margin bottom
    borderColor: 'var(--vscode-sideBar-border)', // Card border color
    cursor: "pointer",
    '&:hover': {
        backgroundColor: 'var(--vscode-list-hoverBackground)'
    }
});

const ScenarioTitle = styled.div({
    fontWeight: "bolder"
});

function Welcome(props: { state: string, queries: Queries[], handleScenarioTest: (query: string) => void }) {
    return <WelcomeContainer>
        <h3>Test your APIs with natural language</h3>
        <>
            {props.queries && props.queries.length > 0 && props.state !== "loading" && <>
                <p>Click on the following scenarios to try out</p>
                {props.queries.map((query, index) => {
                    return (
                        <React.Fragment key={index}>
                            <Scenario onClick={() => props.handleScenarioTest(query.query)}>
                                <ScenarioTitle>{query.scenario}</ScenarioTitle>
                                <div> {query.query}</div>
                            </Scenario>
                        </React.Fragment>
                    );
                })}
            </>
            }
        </>
    </WelcomeContainer>;
}

export default Welcome;