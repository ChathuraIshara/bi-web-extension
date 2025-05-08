/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { DeployProjectRequest, EVENT_TYPE, MACHINE_VIEW, ProjectOverviewResponse, WorkspaceFolder } from "@wso2-enterprise/mi-core";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { ViewHeader } from "../../components/View";
import { Alert, Button, Codicon, colors, Icon, ProgressRing, Typography } from "@wso2-enterprise/ui-toolkit";
import { ComponentDiagram } from "./ComponentDiagram";
import styled from "@emotion/styled";
import ReactMarkdown from "react-markdown";
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { ProjectInformation } from "./ProjectInformation";
import { ERROR_MESSAGES } from "@wso2-enterprise/mi-diagram/lib/resources/constants";
import { DeploymentOptions } from "./DeploymentStatus";
import { useQuery } from "@tanstack/react-query";
import { IOpenInConsoleCmdParams, CommandIds as PlatformExtCommandIds } from "@wso2-enterprise/wso2-platform-core";

export interface DevantComponentResponse {
    org: string;
    project: string;
    component: string;
}

const Body = styled.div`
    padding: 0 32px;
    background: ${colors.vscodeEditorBackground};
    min-height: calc(100vh - 60px);
`;

const Columns = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;

    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

const Rows = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Column = styled.div<{ width?: string }>`
    display: block;
    width: ${({ width }: { width?: string }) => width || 'auto'};
    background: ${colors.vscodeTextCodeBlockBackground};
    border-radius: 12px;
    box-shadow: 0 4px 12px ${({ isDarkMode }: any) => isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'}; // Increased shadow for better visibility
    padding: 24px;
`;

const ProjectInfoColumn = styled(Column)`
    width: 300px;
    padding-right: 20px;
    @media (max-width: 600px) {
        width: auto;
    }
`;


const TabContainer = styled.div`
    display: flex;
    margin-bottom: 24px;
    padding: 8px;
    border-radius: 8px;
`;

const TabContent = styled.div`
    width: 100%;
    animation: fadeIn 0.2s ease-in;
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const Readme = styled.div`
    border-radius: 12px;
    padding: 16px;
    min-height: 200px;
    overflow: auto;
`;

interface OverviewProps {
}

export function Overview(props: OverviewProps) {
    const { rpcClient } = useVisualizerContext();
    const [workspaces, setWorkspaces] = React.useState<WorkspaceFolder[]>([]);
    const [activeWorkspaces, setActiveWorkspaces] = React.useState<WorkspaceFolder>(undefined);
    const [selected, setSelected] = React.useState<string>("");
    const [projectOverview, setProjectOverview] = React.useState<ProjectOverviewResponse>(undefined);
    const [readmeContent, setReadmeContent] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [pomTimestamp, setPomTimestamp] = React.useState<number>(0);
    const [errors, setErrors] = React.useState({});
    const { data: devantMetadata } = useQuery({
        queryKey: ["devant-metadata", workspaces],
        queryFn: () => rpcClient.getMiDiagramRpcClient().getDevantMetadata(),
        refetchInterval: 5000
    })

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await rpcClient.getMiVisualizerRpcClient().getWorkspaces();
                setWorkspaces(response.workspaces);
                setActiveWorkspaces(response.workspaces[0]);
                changeWorkspace(response.workspaces[0].fsPath);

            } catch (error) {
                console.error('Error fetching workspaces:', error);
            }

            rpcClient.onDocumentSave(async (data: any) => {
                if (data.uri.endsWith("README.md")) {
                    await getReadmeContent();
                }
            });

            await getReadmeContent();

            setIsLoading(false);
        };
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        if (workspaces && selected) {
            rpcClient.getMiVisualizerRpcClient().getProjectOverview({ documentUri: selected }).then((response) => {
                setProjectOverview(response);
            }).catch((error) => {
                console.error('Error getting project settings:', error);
                setProjectOverview(undefined);
                setErrors({ ...errors, projectOverview: ERROR_MESSAGES.ERROR_LOADING_PROJECT_OVERVIEW });
            });
        }
    }, [selected, props]);

    async function getReadmeContent() {
        try {
            const readme = await rpcClient.getMiVisualizerRpcClient().getReadmeContent();
            setReadmeContent(readme.content);
        } catch (error) {
            console.error('Error fetching README content on document save:', error);
        }
    }

    const changeWorkspace = (fsPath: string) => {
        setSelected(fsPath);
    }

    const handleExport = async () => {
        await rpcClient.getMiDiagramRpcClient().exportProject({
            projectPath: activeWorkspaces.fsPath,
        });
    }

    const handleDockerBuild = () => {
        rpcClient.getMiDiagramRpcClient().buildProject({ buildType: "docker" });
    };

    const handleCappBuild = () => {
        rpcClient.getMiDiagramRpcClient().buildProject({ buildType: "capp" });
    };

    const goToDevant = () => {
        rpcClient.getMiDiagramRpcClient().executeCommand({
            commands: [
                PlatformExtCommandIds.OpenInConsole, 
                {
                    extName:"Devant",
                    componentFsPath: activeWorkspaces.fsPath,
                    newComponentParams: { buildPackLang: "microintegrator" }
                } as IOpenInConsoleCmdParams]
        })
    };

    const handleDeploy = (params: DeployProjectRequest) => {
        rpcClient.getMiDiagramRpcClient().deployProject(params);
    };

    const handleAddArtifact = () => {
        rpcClient.getMiVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.ADD_ARTIFACT
            },
        })
    }

    const handleEditReadme = () => {
        rpcClient.getMiVisualizerRpcClient().openReadme();
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ProgressRing />
            </div>
        );
    }

    return (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 30px)', padding: '10px 0' }}>
            <div style={{ padding: '0 16px' }}>
                <ViewHeader
                    title={"Project: " + activeWorkspaces?.name}
                    icon="project"
                    iconSx={{ fontSize: "18px", color: "#0066cc" }}
                >
                    <Button
                        appearance="primary"
                        onClick={handleAddArtifact}
                        tooltip="Add Artifact"
                        sx={{
                            background: "#0066cc",
                            '&:hover': {
                                background: "#0052a3"
                            }
                        }}
                    >
                        <Codicon name="add" sx={{ marginRight: "8px" }} />
                        Add Artifact
                    </Button>
                    <Button
                        appearance="icon"
                        onClick={handleExport}
                        tooltip="Export"
                    >
                        <Codicon name="export" sx={{ marginRight: "4px" }} />
                        Export
                    </Button>
                </ViewHeader>
            </div>
            <Body>
                <Columns>
                    <Rows style={{ flex: 1, height: 800 }}>
                        <Column style={{ flex: 1 }}>
                            <TabContent style={{ overflow: 'hidden', borderRadius: '8px' }}>
                                {projectOverview ? (
                                    projectOverview.connections.length > 0 || projectOverview.entrypoints?.length > 0 ? (
                                        <ComponentDiagram
                                            projectName={activeWorkspaces.name}
                                            projectStructure={projectOverview}
                                        />
                                    ) : (
                                        <Alert
                                            title="No artifacts were found"
                                            subTitle="Please add artifacts to your project to view them here."
                                            variant="primary"
                                        />
                                    )
                                ) : (
                                    <Alert
                                        title="Project overview not available"
                                        subTitle="Please add APIs, Automations, Event integrations or Connections to your project to view the project overview."
                                        variant="primary"
                                    />
                                )
                                }
                            </TabContent>
                        </Column>
                        <Column>
                            <Typography variant="h3" sx={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center' }}>
                                Project Readme
                                {readmeContent && <Icon name="edit" isCodicon onClick={handleEditReadme} sx={{ marginLeft: '8px', paddingTop: '5px', cursor: 'pointer' }} />}
                            </Typography>
                            <Readme>
                                {readmeContent ? (
                                    <ReactMarkdown>{readmeContent}</ReactMarkdown>
                                ) : (
                                    <div style={{ display: 'flex', marginTop: '20px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <Typography variant="h3" sx={{ marginBottom: '16px' }}>
                                            Add a README
                                        </Typography>
                                        <Typography variant="body1" sx={{ marginBottom: '24px', color: 'var(--vscode-descriptionForeground)' }}>
                                            Describe your integration and generate your constructs with AI
                                        </Typography>
                                        <VSCodeLink onClick={handleEditReadme}>
                                            Add a README
                                        </VSCodeLink>
                                    </div>
                                )}
                            </Readme>
                        </Column>

                    </Rows>
                    <div>
                        <ProjectInfoColumn>
                            <DeploymentOptions
                                handleDockerBuild={handleDockerBuild}
                                handleCAPPBuild={handleCappBuild}
                                handleDeploy={handleDeploy}
                                goToDevant={goToDevant}
                                devantMetadata={devantMetadata} />
                        </ProjectInfoColumn>
                        <ProjectInfoColumn style={{ marginTop: '10px' }}>
                            <Typography variant="h3" sx={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                Project Summary
                            </Typography>
                            <div style={{ height: '100%', scrollbarWidth: "thin", paddingRight: '5px' }}>
                                <ProjectInformation key={pomTimestamp} />
                            </div>
                        </ProjectInfoColumn>
                    </div>
                </Columns>
            </Body>
        </div>
    );
}

