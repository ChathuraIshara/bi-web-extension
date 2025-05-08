/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from "react";
import {
    EVENT_TYPE,
    MACHINE_VIEW,
    ProjectStructureResponse,
    CDModel,
    CDService,
    NodePosition,
    CDAutomation,
    CDConnection,
    CDListener,
    CDResourceFunction,
    CDFunction,
} from "@wso2-enterprise/ballerina-core";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { Diagram } from "@wso2-enterprise/component-diagram";
import { ProgressRing, ThemeColors } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const DiagramContainer = styled.div`
    height: 100%;
`;

interface ComponentDiagramProps {
    projectStructure: ProjectStructureResponse;
}

export function ComponentDiagram(props: ComponentDiagramProps) {
    const { projectStructure } = props;

    const [project, setProject] = useState<CDModel | null>(null);
    const { rpcClient } = useRpcContext();

    useEffect(() => {
        fetchProject();
    }, [projectStructure]);

    const fetchProject = () => {
        rpcClient
            .getBIDiagramRpcClient()
            .getDesignModel()
            .then((response) => {
                console.log(">>> design model", response);
                if (response?.designModel) {
                    setProject(response.designModel);
                }
            })
            .catch((error) => {
                console.error(">>> error getting design model", error);
            });
    };

    const goToView = async (filePath: string, position: NodePosition) => {
        console.log(">>> component diagram: go to view", { filePath, position });
        rpcClient
            .getVisualizerRpcClient()
            .openView({ type: EVENT_TYPE.OPEN_VIEW, location: { documentUri: filePath, position: position } });
    };

    const handleGoToListener = (listener: CDListener) => {
        if (listener.location) {
            goToView(listener.location.filePath, {
                startLine: listener.location.startLine.line,
                startColumn: listener.location.startLine.offset,
                endLine: listener.location.endLine.line,
                endColumn: listener.location.endLine.offset,
            });
        }
    };

    const handleGoToService = (service: CDService) => {
        if (service.location) {
            goToView(service.location.filePath, {
                startLine: service.location.startLine.line,
                startColumn: service.location.startLine.offset,
                endLine: service.location.endLine.line,
                endColumn: service.location.endLine.offset,
            });
        }
    };

    const handleGoToFunction = (func: CDFunction | CDResourceFunction) => {
        if (func.location) {
            goToView(func.location.filePath, {
                startLine: func.location.startLine.line,
                startColumn: func.location.startLine.offset,
                endLine: func.location.endLine.line,
                endColumn: func.location.endLine.offset,
            });
        }
    };

    const handleGoToAutomation = (automation: CDAutomation) => {
        if (automation.location) {
            goToView(automation.location.filePath, {
                startLine: automation.location.startLine.line,
                startColumn: automation.location.startLine.offset,
                endLine: automation.location.endLine.line,
                endColumn: automation.location.endLine.offset,
            });
        }
    };

    const handleGoToConnection = async (connection: CDConnection) => {
        await rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.EditConnectionWizard,
                identifier: connection.symbol,
            },
            isPopup: true,
        });
    };

    const handleDeleteComponent = async (component: CDListener | CDService | CDAutomation | CDConnection) => {
        console.log(">>> delete component", component);
        rpcClient
            .getBIDiagramRpcClient()
            .deleteByComponentInfo({
                filePath: component.location.filePath,
                component: {
                    name: (component as any).name || (component as any).symbol || "",
                    filePath: component.location.filePath,
                    startLine: component.location.startLine.line,
                    startColumn: component.location.startLine.offset,
                    endLine: component.location.endLine.line,
                    endColumn: component.location.endLine.offset,
                },
            })
            .then((response) => {
                console.log(">>> Updated source code after delete", response);
                if (!response.textEdits) {
                    console.error(">>> Error updating source code", response);
                    return;
                }
                // Refresh the component diagram
                fetchProject();
            });
    };

    if (!projectStructure) {
        return (
            <SpinnerContainer>
                <ProgressRing color={ThemeColors.PRIMARY} />
            </SpinnerContainer>
        );
    }

    return (
        <DiagramContainer>
            {project ? (
                <Diagram
                    project={project}
                    onListenerSelect={handleGoToListener}
                    onServiceSelect={handleGoToService}
                    onFunctionSelect={handleGoToFunction}
                    onAutomationSelect={handleGoToAutomation}
                    onConnectionSelect={handleGoToConnection}
                    onDeleteComponent={handleDeleteComponent}
                />
            ) : (
                <SpinnerContainer>
                    <ProgressRing color={ThemeColors.PRIMARY} />
                </SpinnerContainer>
            )}
        </DiagramContainer>
    );
}

export default ComponentDiagram;
