/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { BlockStatement, FunctionBodyBlock, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Context/diagram";
import { useFunctionContext } from "../../../Context/Function";
import { ViewMode } from "../../../Context/types";
import { collapseExpandedRange, expandCollapsedRange, getDraftComponent, getSTComponents, recalculateSizingAndPositioning } from "../../../Utils";
import { BlockViewState } from "../../../ViewState";
import { PlusButton } from "../../PlusButtons/Plus";
import CollapseComponent from "../Collapse";
import ControlFlowArrow from "../ControlFlowArrow";
import ControlFlowExecutionTime from "../ControlFlowExecutionTime";
import { ControlFlowLine } from "../ControlFlowLine";

export interface DiagramProps {
    model: FunctionBodyBlock | BlockStatement,
    viewState: BlockViewState;
    expandReadonly?: boolean;
}

export function WorkerBody(props: DiagramProps) {
    const {
        state,
        actions: { insertComponentStart, diagramRedraw },
        props: {
            syntaxTree,
            experimentalEnabled
        }
    } = useContext(Context);

    const { viewMode } = useFunctionContext();

    const { expandReadonly, model, viewState } = props;
    const pluses: React.ReactNode[] = [];
    const workerArrows: React.ReactNode[] = [];
    let children: React.ReactNode[] = [];
    let drafts: React.ReactNode[] = [];
    const controlFlowLines: React.ReactNode[] = [];
    const controlFlowExecutionTime: React.ReactNode[] = [];
    const workerIndicatorLine: React.ReactNode[] = [];

    if (STKindChecker.isFunctionBodyBlock(model) && viewState.hasWorkerDecl) {
        children = children.concat(
            getSTComponents(model.namedWorkerDeclarator.workerInitStatements, viewState, model, expandReadonly));
        children = children.concat(
            getSTComponents(model.namedWorkerDeclarator.namedWorkerDeclarations, viewState, model, expandReadonly));
    }
    children = children.concat(getSTComponents(model.statements, viewState, model, expandReadonly))

    for (const controlFlowLine of viewState.controlFlow.lineStates) {
        const line = controlFlowLine.isArrowed ?
            <ControlFlowArrow isDotted={false} x={controlFlowLine.x} y={controlFlowLine.y} w={controlFlowLine.w} isLeft={true} /> :
            <ControlFlowLine controlFlowViewState={controlFlowLine} />;
        controlFlowLines.push(line);
    }

    for (const plusView of viewState.plusButtons) {
        if (!expandReadonly && viewMode === ViewMode.STATEMENT) {
            pluses.push(<PlusButton viewState={plusView} model={model} initPlus={false} />);
        }
    }

    for (const workerArrow of viewState.workerArrows) {
        workerArrows.push(
            <line
                style={{ stroke: '#5567D5', strokeWidth: 1 }}
                markerEnd="url(#arrowhead)"
                x1={workerArrow.x}
                y1={workerArrow.y}
                x2={workerArrow.x + workerArrow.w}
                y2={workerArrow.y}
            />
        )
    }

    if (viewState.hasWorkerDecl) {
        workerIndicatorLine.push((
            <>
                <circle
                    cx={viewState.workerIndicatorLine.x}
                    cy={viewState.workerIndicatorLine.y}
                    r="6"
                    style={{ stroke: '#5567D5', strokeWidth: 1, fill: '#fff' }}
                />
                <circle
                    cx={viewState.workerIndicatorLine.x}
                    cy={viewState.workerIndicatorLine.y}
                    r="4"
                    style={{ stroke: '#5567D5', strokeWidth: 1, fill: '#5567D5' }}
                />
                <line
                    x1={viewState.workerIndicatorLine.x}
                    y1={viewState.workerIndicatorLine.y}
                    x2={viewState.workerIndicatorLine.x + viewState.workerIndicatorLine.w}
                    y2={viewState.workerIndicatorLine.y}
                    strokeDasharray={'5, 5'}
                    style={{ stroke: '#5567D5', strokeWidth: 1 }}
                />
            </>
        ))
    }

    for (const executionTime of viewState?.controlFlow.executionTimeStates) {
        if (executionTime.value) {
            controlFlowExecutionTime.push(<ControlFlowExecutionTime x={executionTime.x} y={executionTime.y} value={executionTime.value} h={executionTime.h} />);
        }
    }
    // if (viewState?.collapseView) {
    //     children.push(<Collapse blockViewState={viewState} />)
    // }
    const collapsedComponents: JSX.Element[] = []
    if (viewState.collapsedViewStates.length > 0) {
        // TODO: handle collapse ranges rendering
        viewState.collapsedViewStates.forEach((collapseVS) => {
            const onExpandClick = () => {
                diagramRedraw(
                    recalculateSizingAndPositioning(
                        expandCollapsedRange(syntaxTree, collapseVS.range), experimentalEnabled)
                );
            }

            const onCollapseClick = () => {
                diagramRedraw(
                    recalculateSizingAndPositioning(
                        collapseExpandedRange(syntaxTree, collapseVS.range)
                    )
                );
            }
            collapsedComponents.push((
                <CollapseComponent
                    collapseVS={collapseVS}
                    onExpandClick={onExpandClick}
                    onCollapseClick={onCollapseClick}
                />
            ))
        })
    }

    if (viewState?.draft) {
        drafts = getDraftComponent(viewState, state, insertComponentStart);
    }

    return (
        <>
            {controlFlowLines}
            {collapsedComponents}
            {pluses}
            {workerIndicatorLine}
            {workerArrows}
            {children}
            {drafts}
            {controlFlowExecutionTime}
        </>
    );
}
