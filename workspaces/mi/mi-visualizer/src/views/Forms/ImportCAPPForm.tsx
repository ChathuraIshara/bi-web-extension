/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Button, Codicon, LocationSelector, Typography } from "@wso2-enterprise/ui-toolkit";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { SectionWrapper } from "./Commons";
import { EVENT_TYPE, MACHINE_VIEW } from "@wso2-enterprise/mi-core";

const WizardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95vw;
    height: calc(100vh - 140px);
    overflow: auto;
`;

const ActionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    padding-bottom: 20px;
`;

const LocationText = styled.div`
    max-width: 60vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    align-items: center;
    justify-content: flex-start;
`;

export interface Region {
    label: string;
    value: string;
}

export function ImportCAPPWizard() {
    const { rpcClient } = useVisualizerContext();
    const [sourceDir, setSourceDir] = useState("");
    const [projectDir, setProjectDir] = useState("");

    useEffect(() => {
        (async () => {
            const currentDir = await rpcClient.getMiDiagramRpcClient().getWorkspaceRoot();
            setProjectDir(currentDir.path);
        })();

    }, []);

    const handleProjectSourceDirSelection = async () => {
        const projectDirectory = await rpcClient.getMiDiagramRpcClient().askProjectImportDirPath();
        setSourceDir(projectDirectory.path);
    }
    const handleProjectDirSelection = async () => {
        const projectDirectory = await rpcClient.getMiDiagramRpcClient().askProjectDirPath();
        setProjectDir(projectDirectory.path);
    }

    const handleImportProject = async () => {
        const importProjectParams = {
            source: sourceDir,
            directory: projectDir,
            open: false
        }
        await rpcClient.getMiDiagramRpcClient().importProject(importProjectParams);
    };

    const handleCancel = () => {
        console.log("cancel");
        rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Welcome } });

    };

    const handleBackButtonClick = () => {
        rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Welcome } });
    }

    const isValid: boolean = sourceDir.length > 0 && projectDir.length > 0;

    return (
        <WizardContainer>
            <SectionWrapper>
                <Container>
                    <Codicon iconSx={{ marginTop: -3, fontWeight: "bold", fontSize: 22 }} name='arrow-left' onClick={handleBackButtonClick} />
                    <div style={{ marginLeft: 30 }}>
                        <Typography variant="h3">Import Integration Project</Typography>
                    </div>
                </Container>
                <LocationSelector
                    label="Choose CAPP File"
                    selectedFile={sourceDir}
                    required
                    onSelect={handleProjectSourceDirSelection}
                />
                <LocationSelector
                    label="Destination for Imported Project"
                    selectedFile={projectDir}
                    required
                    onSelect={handleProjectDirSelection}
                />
                <ActionContainer>
                    <Button
                        appearance="secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={handleImportProject}
                        disabled={!isValid}
                    >
                        Import
                    </Button>
                </ActionContainer>
            </SectionWrapper>
        </WizardContainer>
    );
}
