/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from 'react';
import { ComponentModel, PersistERModel } from '@wso2-enterprise/ballerina-core';
import { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import { ProgressRing, ThemeColors } from '@wso2-enterprise/ui-toolkit';
import { CMEntity as Entity } from '@wso2-enterprise/ballerina-core';
import { modelMapper, generateEngine } from './utils';
import { DiagramControls, HeaderWidget, OverlayLayerModel, PersistDiagramContext, PromptScreen } from './components';
import { ERRONEOUS_MODEL, NO_ENTITIES_DETECTED, dagreEngine } from './resources';
import { Container, DiagramContainer, useStyles } from './utils/CanvasStyles';

import './resources/assets/font/fonts.css';
import { NavigationWrapperCanvasWidget } from "./components/DiagramNavigationWrapper/NavigationWrapperCanvasWidget";

interface PersistDiagramProps {
    getPersistModel: () => Promise<PersistERModel>;
    selectedRecordName: string;
    showProblemPanel: () => void;
}

export function PersistDiagram(props: PersistDiagramProps) {
    const { getPersistModel, selectedRecordName, showProblemPanel } = props;

    const [diagramEngine] = useState<DiagramEngine>(generateEngine);
    const [diagramModel, setDiagramModel] = useState<DiagramModel>(undefined);
    const [selectedNodeId, setSelectedNodeId] = useState<string>(undefined);
    const [hasDiagnostics, setHasDiagnostics] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState<string>(undefined);
    const [collapsedMode, setIsCollapsedMode] = useState<boolean>(false);
    const [focusedNodeId, setFocusedNodeId] = useState<string>(undefined);

    const styles = useStyles();

    useEffect(() => {
        refreshDiagram();
        const nodeId = selectedRecordName ? `$anon/.:0.0.0:${selectedRecordName}` : '';
        if (nodeId !== selectedNodeId) {
            setSelectedNodeId(nodeId);
        }
        setFocusedNodeId(undefined);
    }, [props]);

    useEffect(() => {
        if (diagramEngine.getCanvas()) {
            function handleEscapePress(event: KeyboardEvent) {
                if (event.key === 'Escape' && selectedNodeId) {
                    setSelectedNodeId(undefined);
                }
            }
            document.addEventListener('keydown', handleEscapePress);
        }
    }, [diagramModel, diagramEngine.getCanvas()]);

    const refreshDiagram = () => {
        getPersistModel().then(response => {
            const pkgModel: Map<string, ComponentModel> = new Map(Object.entries(response.persistERModel));
            const entities: Map<string, Entity> = new Map(Object.entries(pkgModel.get('entities')));
            setHasDiagnostics(response.diagnostics.length > 0);
            if (entities.size) {
                const model = modelMapper(entities);
                model.addLayer(new OverlayLayerModel());
                diagramEngine.setModel(model);
                setDiagramModel(model);
                autoDistribute(model);
            } else if (response.diagnostics.length && !diagramModel) {
                setUserMessage(ERRONEOUS_MODEL);
            } else if (!response.diagnostics?.length) {
                setDiagramModel(undefined);
                setUserMessage(NO_ENTITIES_DETECTED);
            }
        });
    }

    const autoDistribute = (model: DiagramModel) => {
        setTimeout(() => {
            dagreEngine.redistribute(diagramEngine.getModel());
            diagramEngine.zoomToFitNodes({ margin: 10, maxZoom: 1 });
            diagramEngine.getModel().removeLayer(diagramEngine.getModel().getLayers().find(layer => layer instanceof OverlayLayerModel));
            diagramEngine.setModel(model);
        }, 30);
    };

    const switchCollapseMode = (shouldCollapse: boolean) => {
        setIsCollapsedMode(shouldCollapse);
        if (diagramModel) {
            autoDistribute(diagramModel);
        }
    }

    let ctx = {
        collapsedMode,
        selectedNodeId,
        setSelectedNodeId,
        setHasDiagnostics,
        hasDiagnostics,
        focusedNodeId,
        setFocusedNodeId
    }

    const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (focusedNodeId && event.target === diagramEngine.getCanvas()) {
            setFocusedNodeId(undefined);
        }
    };

    return (
        <Container>
            <PersistDiagramContext {...ctx}>
                <HeaderWidget collapsedMode={collapsedMode} setIsCollapsedMode={switchCollapseMode} />
                <DiagramContainer onClick={handleCanvasClick}>
                    {diagramEngine?.getModel() && diagramModel ?
                        <>
                            <NavigationWrapperCanvasWidget
                                diagramEngine={diagramEngine}
                                className={styles.canvas}
                                focusedNode={diagramEngine?.getModel()?.getNode(focusedNodeId)}
                            />
                            <DiagramControls
                                engine={diagramEngine}
                                refreshDiagram={refreshDiagram}
                                showProblemPanel={showProblemPanel}
                            />
                        </> :
                        userMessage ?
                            <PromptScreen
                                userMessage={userMessage}
                                showProblemPanel={hasDiagnostics ? showProblemPanel : undefined}
                            /> :
                            <ProgressRing sx={{ color: ThemeColors.PRIMARY }} />
                    }
                </DiagramContainer>
            </PersistDiagramContext>
        </Container>
    );
}
