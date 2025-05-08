/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 * 
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
*/

import React from 'react';
import { Button, FormActions, Typography } from '@wso2-enterprise/ui-toolkit';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import styled from '@emotion/styled';
import SidePanelContext from '../SidePanelContexProvider';
import { sidepanelGoBack } from '..';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';

const ProgressRing = styled(VSCodeProgressRing)`
    height: 50px;
    width: 50px;
    margin-top: 25px;
    margin-bottom: 10px;
`;

interface RemoveConnectorPageProps {
    connectorName: string;
    artifactId: string;
    version: string;
    connectorPath: string;
    onRemoveSuccess: () => Promise<void>;
}

export function RemoveConnectorPage(props: RemoveConnectorPageProps) {
    const { connectorName, artifactId, version, connectorPath, onRemoveSuccess } = props;
    const sidePanelContext = React.useContext(SidePanelContext);
    const { rpcClient } = useVisualizerContext();
    const [isRemoving, setIsRemoving] = React.useState(false);
    const [isFailedRemoving, setIsFailedRemoving] = React.useState(false);

    const handleResponse = async (response: boolean) => {
        if (response) {

            setIsRemoving(true);

            if (connectorPath) {
                // Remove imported connectors
                await rpcClient.getMiDiagramRpcClient().removeConnector({ connectorPath: connectorPath });
                const response = await rpcClient.getMiVisualizerRpcClient().updateConnectorDependencies();

                if ((response === "Success" || !response.includes(artifactId))) {
                    await onRemoveSuccess();
                    setIsRemoving(false);
                    sidepanelGoBack(sidePanelContext, 1);
                } else {
                    setIsFailedRemoving(true);
                    setIsRemoving(false);
                }
            } else {
                const projectDetails = await rpcClient.getMiVisualizerRpcClient().getProjectDetails();
                const connectorDependencies = projectDetails.dependencies.connectorDependencies;

                let pomRemoveSuccess: boolean;

                const removeDependency = async () => {
                    for (const d of connectorDependencies) {
                        if (d.artifact === artifactId && d.version === version) {
                            pomRemoveSuccess = await rpcClient.getMiVisualizerRpcClient().updatePomValues({
                                pomValues: [{ range: d.range, value: '' }]
                            });
                        }
                    }
                }

                await removeDependency();

                // HACK: time to serve saved pom file to ls
                await new Promise(resolve => setTimeout(resolve, 500));

                const response = await rpcClient.getMiVisualizerRpcClient().updateConnectorDependencies();

                if (pomRemoveSuccess && (response === "Success" || !response.includes(artifactId))) {
                    await onRemoveSuccess();
                    setIsRemoving(false);
                    sidepanelGoBack(sidePanelContext, 1);
                } else {
                    setIsFailedRemoving(true);
                    setIsRemoving(false);
                }
            }
        } else {
            sidepanelGoBack(sidePanelContext);
        }
    }

    const retryRemove = async () => {
        setIsFailedRemoving(true);
        // Removing Connector
        const response = await rpcClient.getMiVisualizerRpcClient().updateConnectorDependencies();

        if (response === "Success" || !response.includes(artifactId)) {
            await onRemoveSuccess();
            setIsRemoving(false);
            sidepanelGoBack(sidePanelContext);
        } else {
            setIsFailedRemoving(true);
            setIsRemoving(false);
        }
    }

    return (
        <>
            <Typography sx={{ padding: "10px 20px", borderBottom: "1px solid var(--vscode-editorWidget-border)" }} variant="body3"></Typography>
            <div>
                {isRemoving ? (
                    <div style={{ display: "flex", flexDirection: "column", padding: "10px", alignItems: "center", gap: "10px" }}>
                        <ProgressRing sx={{ height: '50px', width: '50px' }} />
                        <span>Removing Module...</span>
                    </div>
                ) : isFailedRemoving ? (
                    <div style={{ display: "flex", flexDirection: "column", padding: "40px", gap: "15px" }}>
                        <Typography variant="body2">Error removing module. Please try again...</Typography>
                        <FormActions>
                            <Button
                                appearance="primary"
                                onClick={() => retryRemove()}
                            >
                                Retry
                            </Button>
                            <Button
                                appearance="secondary"
                                onClick={() => handleResponse(false)}
                            >
                                Cancel
                            </Button>
                        </FormActions>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", padding: "40px", gap: "15px" }}>
                        <Typography variant="body2">
                            {connectorName} module will be removed from the project. Make sure all its dependencies are removed.
                        </Typography>
                        <Typography variant="body2">Do you want to continue?</Typography>
                        <FormActions>
                            <Button
                                appearance="secondary"
                                onClick={() => handleResponse(false)}
                            >
                                No
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={() => handleResponse(true)}
                            >
                                Yes
                            </Button>
                        </FormActions>
                    </div>
                )}
            </div>
        </>
    );
};
