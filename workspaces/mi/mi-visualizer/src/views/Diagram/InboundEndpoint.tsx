/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect } from 'react';
import { Diagnostic } from "vscode-languageserver-types";
import { InboundEndpoint } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { Diagram } from "@wso2-enterprise/mi-diagram";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { View, ViewContent, ViewHeader } from "../../components/View";
import { EVENT_TYPE, MACHINE_VIEW } from "@wso2-enterprise/mi-core";
import { Button, Codicon, Icon, ProgressRing, Typography } from '@wso2-enterprise/ui-toolkit';


export interface InboundEPViewProps {
    path: string;
    model: InboundEndpoint;
    diagnostics: Diagnostic[];
}

export const InboundEPView = ({ path, model, diagnostics }: InboundEPViewProps) => {
    const { rpcClient } = useVisualizerContext();
    const [isFormOpen, setFormOpen] = React.useState(false);

    const handleEditInboundEP = () => {
        rpcClient.getMiVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: { view: MACHINE_VIEW.InboundEPForm, documentUri: path, customProps: { model: model } }
        });
    }

    useEffect(() => {
        if (model && model.sequence === undefined) {
            handleEditInboundEP();
        }
    }, [model]);

    const goHome = () => {
        rpcClient.getMiVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: { view: MACHINE_VIEW.Overview }
        });
    }

    // TODO: Fix from statemachine
    if (!model) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ProgressRing />
        </div>
    }

    return (
        <View>
            {model && model.name &&
                <ViewHeader title={`Event Integration: ${model.name}`} icon='inbound-endpoint' onEdit={handleEditInboundEP} />
            }
            {<ViewContent>
                {model && model.name && model.sequenceModel &&
                    <Diagram
                        model={model.sequenceModel}
                        documentUri={model.sequenceURI}
                        diagnostics={diagnostics}
                        isFormOpen={isFormOpen}
                    />
                }
                {
                    (!model?.sequenceModel) &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Codicon name="error" sx={{ height: "100px", width: "100px" }} iconSx={{ fontSize: 100, color: "var(--vscode-errorForeground)" }} />
                        <Typography variant="h4" sx={{ textAlign: 'center' }}>
                            {"Cannot find the sequence for the inbound endpoint"}
                        </Typography>

                        <Button appearance="icon" onClick={goHome} >
                            <Icon name="home" isCodicon sx={{ width: 24, height: 24 }} iconSx={{ fontSize: 24 }} />
                        </Button>

                    </div>
                }
            </ViewContent>}
        </View>
    )
}

