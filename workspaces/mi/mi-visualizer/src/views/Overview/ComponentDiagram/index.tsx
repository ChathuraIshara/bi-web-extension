/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Connection, Diagram, EntryPoint, Project } from "@wso2-enterprise/mi-component-diagram";
import { ProgressRing } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";
import { EVENT_TYPE, MACHINE_VIEW, ProjectOverviewResponse } from "@wso2-enterprise/mi-core";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const DiagramContainer = styled.div`
    height: 800px;
    position: relative;
`;

interface ComponentDiagramProps {
    projectName: string;
    projectStructure: ProjectOverviewResponse;
}

export function ComponentDiagram(props: ComponentDiagramProps) {
    const { projectName, projectStructure } = props;
    const { rpcClient } = useVisualizerContext();

    const model: Project = {
        name: projectName,
        entryPoints: projectStructure?.entrypoints as any || [],
        connections: projectStructure?.connections as any || [],
    };

    const handleGoToEntryPoints = (entryPoint: EntryPoint) => {
        if ((entryPoint as any).path) {
            rpcClient.getMiDiagramRpcClient().executeCommand({ commands: ['MI.show.graphical-view', (entryPoint as any).path] });
        }
    };

    const handleGoToSourceEntryPoints = (entryPoint: EntryPoint) => {
        if ((entryPoint as any).path) {
            rpcClient.getMiVisualizerRpcClient().goToSource({ filePath: (entryPoint as any).path });
        }
    };

    const handleOnDeleteComponent = (entryPoint: EntryPoint | Connection) => {
        rpcClient.getMiDiagramRpcClient().deleteArtifact({ path: (entryPoint as any).path, enableUndo: true });
    };

    const handleGoToConnection = async (connection: Connection) => {
        if ((connection as any).path) {
            rpcClient.getMiVisualizerRpcClient().openView({
                type: EVENT_TYPE.OPEN_VIEW,
                location: { view: MACHINE_VIEW.ConnectionForm, documentUri: (connection as any).path, customProps: { connectionName: connection.name } }
            });
        }
    };

    if (!projectStructure) {
        return (
            <SpinnerContainer>
                <ProgressRing />
            </SpinnerContainer>
        );
    }

    return (
        <DiagramContainer>
            <Diagram
                project={model}
                onEntryPointSelect={handleGoToEntryPoints}
                onEntryPointGoToSource={handleGoToSourceEntryPoints}
                onConnectionSelect={handleGoToConnection}
                onDeleteComponent={handleOnDeleteComponent}
            />
        </DiagramContainer>
    );
}

