/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormView, FormActions, Button, LocationSelector, ErrorBanner, Typography } from "@wso2-enterprise/ui-toolkit";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { ConnectorStatus } from "@wso2-enterprise/mi-core";

const LoaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    height: 100px;
    width: 100%;
`;

const ProgressRing = styled(VSCodeProgressRing)`
    height: 50px;
    width: 50px;
    margin-top: auto;
    padding: 4px;
`;

export interface ImportConnectorFormProps {
    goBack: () => void;
    handlePopupClose?: () => void;
    onImportSuccess: () => void;
}

export function ImportConnectorForm(props: ImportConnectorFormProps) {
    const { rpcClient } = useVisualizerContext();
    const [zipDir, setZipDir] = useState("");
    const [openApiDir, setOpenApiDir] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [importOpenAPI, setImportOpenAPI] = useState(true);
    const [isFailedImport, setIsFailedImport] = useState(false);
    const connectionStatus = useRef(null);

    useEffect(() => {
        rpcClient.onConnectorStatusUpdate((connectorStatus: ConnectorStatus) => {
            connectionStatus.current = connectorStatus;
        });

    }, []);

    const handleSourceDirSelection = async () => {
        const specDirecrory = await rpcClient.getMiDiagramRpcClient().askFileDirPath();
        setZipDir(specDirecrory.path);
    }

    const handleOpenAPIDirSelection = async () => {
        const specDirecrory = await rpcClient.getMiDiagramRpcClient().askOpenAPIDirPath();
        setOpenApiDir(specDirecrory.path);
    }

    const importWithOpenAPI = async () => {
        setIsImporting(true);
        try {
            await rpcClient.getMiVisualizerRpcClient().importOpenAPISpec({ filePath: openApiDir });
            
            const newConnector: any = await waitForEvent();
            if (newConnector?.isSuccess) {
                props.onImportSuccess();
            } else {
                setIsFailedImport(true);
            }
        } catch (error) {
            console.log(error);
        }
        setIsImporting(false);
    };

    const importWithZip = async () => {
        setIsImporting(true);
        const response = await rpcClient.getMiDiagramRpcClient().copyConnectorZip({ connectorPath: zipDir });
        try {
            const newConnector: any = await waitForEvent();

            if (newConnector?.isSuccess) {
                props.onImportSuccess();
            } else {
                await removeInvalidConnector(response.connectorPath);
                setIsFailedImport(true);
            }
        } catch (error) {
            console.log(error);
        }

        setIsImporting(false);
    };

    const waitForEvent = () => {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (connectionStatus.current) {
                    clearInterval(checkInterval);
                    resolve(connectionStatus.current);
                }
            }, 200);

            // Reject the promise after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Event did not occur within 10 seconds'));
            }, 10000);
        });
    };

    const removeInvalidConnector = async (connectorPath: string) => {
        await rpcClient.getMiDiagramRpcClient().removeConnector({ connectorPath: connectorPath });
    }

    const handleCancel = () => {
        props.goBack();
    }

    const handleOnClose = () => {
        rpcClient.getMiVisualizerRpcClient().goBack();
    }

    return (
        <>
            <FormView title={`Import Connector`} onClose={props.handlePopupClose ?? handleOnClose}>
                <span>Please select a method to import a connector.</span>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '80px', margin: '0px 0px 20px 0' }}>
                    <label>
                        <input
                            type="radio"
                            name="importMethod"
                            value="openAPI"
                            checked={importOpenAPI}
                            onChange={() => {
                                setImportOpenAPI(true);
                                setZipDir("");
                                setOpenApiDir("");
                                setIsFailedImport(false);
                            }}
                        />
                        Import Using OpenAPI
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="importMethod"
                            value="zip"
                            checked={!importOpenAPI}
                            onChange={() => {
                                setImportOpenAPI(false);
                                setZipDir("");
                                setOpenApiDir("");
                                setIsFailedImport(false);
                            }}
                        />
                        Upload Connector ZIP file
                    </label>
                </div>
                {isImporting ?
                    (
                        <LoaderWrapper>
                            <ProgressRing />
                            Importing Connector...
                        </LoaderWrapper>
                    ) : (
                        <>
                            {isFailedImport && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <Typography variant="body3">Error importing connector. Please try again...</Typography>
                                </div>
                            )}
                            {importOpenAPI ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {openApiDir && !['json', 'yaml', 'yml'].includes(openApiDir.split('.').pop()!) && 
                                    <ErrorBanner errorMsg={"Invalid file type. Please select an OpenAPI specification"} />
                                } 
                                <LocationSelector
                                    label="Choose path to OpenAPI specification"
                                    selectedFile={openApiDir}
                                    required
                                    onSelect={handleOpenAPIDirSelection}
                                />
                            </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {zipDir && !zipDir.endsWith('.zip') &&
                                        <ErrorBanner errorMsg={"Invalid file type. Please select a connector zip file"} />
                                    }
                                    <LocationSelector
                                        label="Choose path to connector Zip"
                                        selectedFile={zipDir}
                                        required
                                        onSelect={handleSourceDirSelection}
                                    />
                                </div>
                            )}
                            <FormActions>
                                {importOpenAPI ? (
                                    <Button
                                        appearance="primary"
                                        onClick={importWithOpenAPI}
                                        disabled={!openApiDir || !['json', 'yaml', 'yml'].includes(openApiDir.split('.').pop()!)}
                                    >
                                        Import
                                    </Button>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <Button
                                            appearance="primary"
                                            onClick={importWithZip}
                                            disabled={!zipDir || !zipDir.endsWith('.zip')}
                                        >
                                            Import
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    appearance="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </FormActions>
                        </>
                    )}
            </FormView >
        </>
    );
}
