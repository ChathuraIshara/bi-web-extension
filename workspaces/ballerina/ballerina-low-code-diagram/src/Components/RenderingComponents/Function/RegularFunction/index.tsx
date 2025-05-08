/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useEffect, useRef, useState } from "react";

import {
    FunctionBodyBlock,
    STKindChecker,
} from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";
import { v4 as uuid } from "uuid";

import { Canvas } from "../../../../Canvas";
import { Context } from "../../../../Context/diagram";
import { Provider as FunctionProvider } from "../../../../Context/Function";
import { ViewMode } from "../../../../Context/types";
import { useOverlayRef, useSelectedStatus } from "../../../../hooks";
import { initializeCollapseView } from "../../../../Utils";
import { BlockViewState, FunctionViewState } from "../../../../ViewState";
import { End } from "../../End";
import { StartButton } from "../../Start";
import { WorkerBody } from "../../WorkerBody";
import { WorkerLine } from "../../WorkerLine";
import { FunctionProps } from "../index";
import PanAndZoom from "../PanAndZoom";
import { PerformanceBar } from "../perBar/PerformanceBar";

import { NavigationBarDetailContainer } from "./NavigationBarDetailContainer"
import "./style.scss";


export function RegularFuncComponent(props: FunctionProps) {
    const [overlayId] = useState(`function-overlay-${uuid()}`);
    const diagramContext = useContext(Context);
    const { isReadOnly, syntaxTree } = diagramContext.props;
    const { diagramRedraw, diagramCleanDraw } = diagramContext.actions;
    const diagramApi = diagramContext.api;
    const navigation = diagramApi?.navigation;
    const navigateUptoParent = navigation?.navigateUptoParent;

    const run = diagramContext?.api?.project?.run;

    const { model } = props;

    const viewState: FunctionViewState = model.viewState;
    const isInitPlusAvailable: boolean = viewState.initPlus !== undefined;
    const isExpressionFuncBody: boolean = STKindChecker.isExpressionFunctionBody(
        model.functionBody
    );

    const containerRef = useRef(null);
    const [diagramExpanded, setDiagramExpanded] = useSelectedStatus(model, containerRef);
    const [overlayNode, overlayRef] = useOverlayRef();
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.STATEMENT);

    useEffect(() => {
        if (viewMode === ViewMode.INTERACTION) {
            diagramRedraw(initializeCollapseView(syntaxTree, model.position));
        } else {
            diagramCleanDraw(syntaxTree);
        }
    }, [viewMode]);


    const toggleViewMode = () => {
        setViewMode(viewMode === ViewMode.INTERACTION ? ViewMode.STATEMENT : ViewMode.INTERACTION);
    }

    let component: JSX.Element;

    if (isExpressionFuncBody) {
        component = (
            <g>
                <StartButton model={model} />
                <WorkerLine viewState={viewState} />
                <End
                    model={model.functionBody}
                    viewState={viewState.end}
                    isExpressionFunction={true}
                />
            </g>
        );
    } else {
        const block: FunctionBodyBlock = model.functionBody as FunctionBodyBlock;
        const isStatementsAvailable: boolean = block.statements.length > 0 || !!block.namedWorkerDeclarator;
        const bodyViewState: BlockViewState = block.viewState;

        component = (
            <g className="function-body">
                <>
                    {!isReadOnly &&
                        isInitPlusAvailable &&
                        !viewState.initPlus.isTriggerDropdown && (
                            <WorkerLine viewState={viewState} />
                        )}
                </>

                {!isInitPlusAvailable && <WorkerLine viewState={viewState} />}
                {isInitPlusAvailable && <StartButton model={model} />}
                {!isInitPlusAvailable && <StartButton model={model} />}
                {!isInitPlusAvailable && (
                    <WorkerBody model={block} viewState={block.viewState} />
                )}
                {
                    (!bodyViewState?.isEndComponentInMain ||
                        bodyViewState?.collapseView) && <End viewState={viewState.end} />}
            </g>
        );
    }

    const functionBody = (
        <div className={"lowcode-diagram"}>
            <PerformanceBar model={model} />
            <FunctionProvider
                overlayId={overlayId}
                overlayNode={overlayNode}
                functionNode={model}
                hasWorker={!!(model.functionBody as FunctionBodyBlock).namedWorkerDeclarator}
                viewMode={viewMode}
            >
                <PanAndZoom
                    viewMode={viewMode}
                    toggleViewMode={toggleViewMode}
                >
                    <div ref={overlayRef} id={overlayId} className={"function-overlay-container"} />
                    <Canvas h={model.viewState.bBox.h} w={model.viewState.bBox.w}>
                        {component}
                    </Canvas>
                </PanAndZoom>
            </FunctionProvider>
        </div>
    );

    const onClickRun = async () => {
        if (run) {
            run([]);
        }
    }

    function renderButtons() {
        if (model.isRunnable) {
            return (
                <div className={"action-container"}>
                    <button className={"action-button"} onClick={onClickRun}>Run</button>
                </div>
            );
        }
    }

    const headerComponent: React.ReactElement[] = [];

    if (viewState.parentNamePlaceHolder) {
        headerComponent.push(
            <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>/</div>
        );
        const handleParentNavigation = () => {
            navigateUptoParent(viewState.parentPosition);
        }
        headerComponent.push(
            <div className="btn-container" onClick={handleParentNavigation}>
                {viewState.parentNamePlaceHolder}
            </div>
        )
        // <span className="component-name">{model?.functionName.value}</span>
    }


    return (
        <div
            ref={containerRef}
            className={classNames(
                {
                    "function-box":
                        STKindChecker.isResourceAccessorDefinition(model) ||
                        STKindChecker.isObjectMethodDefinition(model),
                    "module-level-function": STKindChecker.isFunctionDefinition(model),
                    expanded: diagramExpanded,
                },
                STKindChecker.isResourceAccessorDefinition(model)
                    ? model.functionName.value
                    : ""
            )}
            data-function-name={model?.functionName?.value}
        >
            {/* {!hideHeader && (STKindChecker.isResourceAccessorDefinition(model) ? (
                <ResourceHeader
                    isExpanded={diagramExpanded}
                    model={model}
                    onExpandClick={onExpandClick}
                />
            ) : (
                <div >
                    <FunctionHeader
                        isExpanded={diagramExpanded}
                        model={model}
                        onExpandClick={onExpandClick}
                        onClickRun={model.isRunnable && onClickRun}
                    />
                </div>
            ))} */}
            <NavigationBarDetailContainer forceRender={true}>
                {headerComponent}
            </NavigationBarDetailContainer>
            {functionBody}
        </div>
    );

}


        // <div
        //     ref={containerRef}
        //     className={classNames(
        //         {
        //             "function-box":
        //                 STKindChecker.isResourceAccessorDefinition(model) ||
        //                 STKindChecker.isObjectMethodDefinition(model),
        //             "module-level-function": STKindChecker.isFunctionDefinition(model),
        //             expanded: diagramExpanded,
        //         },
        //         STKindChecker.isResourceAccessorDefinition(model)
        //             ? model.functionName.value
        //             : ""
        //     )}
        //     data-function-name={model?.functionName?.value}
        // >
        //     {!hideHeader && (STKindChecker.isResourceAccessorDefinition(model) ? (
        //         <ResourceHeader
        //             isExpanded={diagramExpanded}
        //             model={model}
        //             onExpandClick={onExpandClick}
        //         />
        //     ) : (
        //         <div >
        //             <FunctionHeader
        //                 isExpanded={diagramExpanded}
        //                 model={model}
        //                 onExpandClick={onExpandClick}
        //                 onClickRun={model.isRunnable && onClickRun}
        //             />
        //         </div>
        //     ))}
        //     {(diagramExpanded || hideHeader) && functionBody}
        // </div>
