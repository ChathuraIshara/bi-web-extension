/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { ConfigVariable, EVENT_TYPE, FlowNode, MACHINE_VIEW } from "@wso2-enterprise/ballerina-core";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { Button, Codicon, Icon, View, ViewContent } from "@wso2-enterprise/ui-toolkit";
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { EditForm } from "../EditConfigurableVariables";
import { AddForm } from "../AddConfigurableVariables";
import { DiagnosticsPopUp } from "../../../../components/DiagnosticsPopUp";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import { TitleBar } from "../../../../components/TitleBar";

const Container = styled.div`
    width: 100%;
`;

type MethodProp = {
    hasLeftMargin?: boolean;
};

type ContainerProps = {
    borderColor?: string;
    haveErrors?: boolean;
};

type ButtonSectionProps = {
    isExpanded?: boolean;
};

type HeaderProps = {
    expandable?: boolean;
}

const AccordionContainer = styled.div<ContainerProps>`
    margin-top: 10px;
    overflow: hidden;
    background-color: var(--vscode-editorHoverWidget-background);
    &:hover {
        background-color: var(--vscode-list-hoverBackground);
        cursor: pointer;
    }
    border: ${(p: ContainerProps) => p.haveErrors ? "1px solid red" : "none"};
`;

const AccordionHeader = styled.div<HeaderProps>`
    padding: 10px;
    cursor: pointer;
    display: grid;
    grid-template-columns: 3fr 1fr;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 10px;
    width: 40px;
`;

const MethodBox = styled.div<MethodProp>`
    display: flex;
    justify-content: center;
    height: 25px;
    min-width: 70px;
    width: auto;
    margin-left: ${(p: MethodProp) => p.hasLeftMargin ? "10px" : "0px"};
    text-align: center;
    padding: 3px 5px 3px 5px;
    background-color: #616161;
    color: #FFF;
    align-items: center;
    font-weight: bold;
`;

const MethodSection = styled.div`
    display: flex;
    gap: 4px;
`;

const ButtonSection = styled.div<ButtonSectionProps>`
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: ${(p: ButtonSectionProps) => p.isExpanded ? "8px" : "6px"};
`;

const MethodPath = styled.div`
    align-self: center;
    margin-left: 10px;
    display: flex;
`;


namespace S {

    export const Row = styled.div`
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    `;

    export const ConfigWrapper = styled.div`
        display: flex;
        flexDirection: row;
        justify-content: space-between;
        align-items: center;
    `;

    export const ConfigData = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    export const ConfigDataControls = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100px;
    `;
}

export interface ConfigProps {
    variableIndex?: number;
    isExternallauncher?: boolean;
    fileName: string;
}

export function ViewConfigurableVariables(props?: ConfigProps) {

    const { rpcClient } = useRpcContext();

    const [configVariables, setConfigVariables] = useState<ConfigVariable[]>([]);
    const [isEditConfigVariableFormOpen, setEditConfigVariableFormOpen] = useState<boolean>(false);
    const [isAddConfigVariableFormOpen, setAddConfigVariableFormOpen] = useState<boolean>(false);
    const [configIndex, setConfigIndex] = useState<number>(null);
    const [showProgressIndicator, setShowProgressIndicator] = useState(false);
    const selectedNodeRef = useRef<FlowNode>();
    const [updateConfigVariables, setUpdateConfigVariables] = useState(true);

    const handleEditConfigVariableFormOpen = (index: number) => {
        setEditConfigVariableFormOpen(true);
        setConfigIndex(index);
        setUpdateConfigVariables(false);
    };

    const handleAddConfigVariableFormOpen = () => {
        console.log("Add Config Variable Form Opened");
        setAddConfigVariableFormOpen(true);
    };

    // Handler to close the child component
    const handleEditConfigFormClose = () => {
        setUpdateConfigVariables(true);
        setEditConfigVariableFormOpen(false);
        setConfigIndex(null);
        
        rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.ViewConfigVariables,
            },
        });

    };


    const handleAddConfigFormClose = () => {
        setAddConfigVariableFormOpen(false);
        getConfigVariables();
    };

    const handleOnDeleteConfigVariable = async (index: number) => {
        const delConfig = configVariables[index];

        const projectPath: string = (await rpcClient.getVisualizerLocation()).projectUri
        const filePath = projectPath.concat('/' + delConfig.codedata.lineRange.fileName);

        setShowProgressIndicator(true);
        rpcClient
            .getBIDiagramRpcClient()
            .deleteFlowNode({
                filePath: filePath,
                flowNode: delConfig,
            })
            .then((response) => {
                console.log(">>> Updated source code after delete", response);
                if (response.textEdits) {
                    // clear memory
                    selectedNodeRef.current = undefined;
                } else {
                    console.error(">>> Error updating source code", response);
                    // handle error
                }
            })
            .finally(() => {
                setShowProgressIndicator(false);
                getConfigVariables();
            });
    };

    useEffect(() => {
        console.log(">>> Get Config Variables");
        getConfigVariables();
    }, [updateConfigVariables]);

    // Effect to handle prop changes
    useEffect(() => {
        if (props.variableIndex !== undefined && configVariables.length > 0) {
            // Open child component if props are provided           
            setEditConfigVariableFormOpen(true);
            setConfigIndex(props.variableIndex);
        }
    }, [props?.variableIndex, configVariables]);

    const getConfigVariables = () => {
        rpcClient
            .getBIDiagramRpcClient()
            .getConfigVariables()
            .then((variables) => {
                setConfigVariables(variables.configVariables);
            });
    };

    return (
        <View>
            <TopNavigationBar />
            <TitleBar title="Configurable Variables" subtitle="View and manage configurable variables" actions={
                <Button appearance="primary" onClick={handleAddConfigVariableFormOpen}>
                    <Codicon name="add" sx={{ marginRight: 5 }} />Add Configurable Variable
                </Button>
            } />
            <ViewContent padding>
                <Container>
                    {
                        configVariables.length > 0 && configVariables.map((variable, index) => {
                            return (
                                <AccordionContainer data-testid="config-resources" key={index}>
                                    <AccordionHeader>
                                        <MethodSection>
                                            <MethodBox hasLeftMargin={false}>
                                                {String(variable.properties.type.value)}
                                            </MethodBox>
                                            <MethodPath>
                                                <div style={{ display: "flex", marginRight: "20px" }}>
                                                    {
                                                        typeof variable.properties.variable.value === 'string' ?
                                                            variable.properties.variable.value : ''
                                                    }
                                                    {variable?.diagnostics?.hasDiagnostics &&
                                                        <>&nbsp;&nbsp;&nbsp;&nbsp;<DiagnosticsPopUp node={variable} /></>
                                                    }
                                                </div>
                                                {
                                                    variable.properties.defaultable.value && variable.properties.defaultable.value !== null ?
                                                        variable.properties.defaultable.value === "?" ?
                                                            null
                                                            : <div style={{ display: "flex", marginRight: "20px" }}>=</div>
                                                        : null
                                                }
                                                <div style={{ display: "flex" }}>
                                                    {variable.properties.defaultable.value && variable.properties.defaultable.value !== null ?
                                                        variable.properties.defaultable.value === "?" ?
                                                            null
                                                            : String(variable.properties.defaultable.value)
                                                        : null}
                                                </div>
                                            </MethodPath>
                                        </MethodSection>
                                        <ButtonSection>

                                            <ButtonWrapper>
                                                <VSCodeButton appearance="icon" title="Edit Resource" onClick={() => handleEditConfigVariableFormOpen(index)}>
                                                    <Icon name="editIcon" />
                                                </VSCodeButton>
                                            </ButtonWrapper>


                                            <ButtonWrapper>
                                                <VSCodeButton appearance="icon" title="Delete Resource" onClick={() => handleOnDeleteConfigVariable(index)}>
                                                    <Codicon name="trash" />
                                                </VSCodeButton>
                                            </ButtonWrapper>

                                        </ButtonSection>
                                    </AccordionHeader>
                                </AccordionContainer>

                            );
                        })
                    }

                    {isEditConfigVariableFormOpen &&
                        <EditForm
                            isOpen={isEditConfigVariableFormOpen}
                            onClose={handleEditConfigFormClose}
                            variable={configVariables[configIndex]}
                            title="Edit Configurable Variable"
                            filename={props.fileName}
                        />
                    }

                    {isAddConfigVariableFormOpen &&
                        <AddForm
                            isOpen={isAddConfigVariableFormOpen}
                            onClose={handleAddConfigFormClose}
                            title="Add Configurable Variable"
                            filename={props.fileName}
                        />
                    }
                </Container>
            </ViewContent>
        </View>
    );
}

export default ViewConfigurableVariables;
