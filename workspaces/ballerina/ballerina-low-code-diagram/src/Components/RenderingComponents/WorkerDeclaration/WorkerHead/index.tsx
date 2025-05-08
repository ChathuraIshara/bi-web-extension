/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext } from "react";

import { NamedWorkerDeclaration } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../Context/diagram";
import { WorkerDeclarationViewState } from "../../../../ViewState/worker-declaration";
import { DeleteBtn } from "../../../DiagramActions/DeleteBtn";
import { EditBtn } from "../../../DiagramActions/EditBtn";
import { StartSVG, START_SVG_HEIGHT, START_SVG_WIDTH } from "../../Start/StartSVG";

interface WorkerHeadProps {
    model: NamedWorkerDeclaration
}

export function WorkerHead(props: WorkerHeadProps) {
    const diagramContext = useContext(Context);
    const { model } = props;
    const viewState: WorkerDeclarationViewState = model.viewState;
    const renderEditForm = diagramContext.api?.edit?.renderEditForm;
    const deleteComponent = diagramContext.api?.edit?.deleteComponent;

    const handleEditClick = () => {
        const workerConfig = {
            formType: 'Worker',
            isLoading: false,
            formArgs: {
                model,
            },
        };

        if (renderEditForm) {
            diagramContext.props.onEditComponent(model, model.position, 'Worker');
            // renderEditForm(model, model.position, workerConfig);
        }
    }

    const onDeleteClick = () => {
        if (deleteComponent) {
            deleteComponent(model);
        }
    }

    const editButtons = (
        <g className="modification-buttons">
            <rect
                x={viewState.trigger.cx - START_SVG_WIDTH / 2 + 2}
                y={viewState.trigger.cy - START_SVG_HEIGHT / 4}
                width={START_SVG_WIDTH - 4}
                height={START_SVG_HEIGHT / 2}
                rx={10}
                fill={"#D3D8FF"}
            />
            <DeleteBtn
                model={model}
                cx={viewState.trigger.cx}
                cy={viewState.trigger.cy - START_SVG_HEIGHT / 4}
                toolTipTitle={'Delete worker'}
                isReferencedInCode={false}
                onDraftDelete={onDeleteClick}
                showOnRight={true}
            />
            <EditBtn
                model={model}
                cx={viewState.trigger.cx - START_SVG_WIDTH / 4}
                cy={viewState.trigger.cy - START_SVG_HEIGHT / 4}
                onHandleEdit={handleEditClick}
            />
        </g>
    );

    return (
        <g className="worker-start-container">
            <StartSVG
                x={viewState.trigger.cx - (START_SVG_WIDTH / 2)}
                y={viewState.trigger.cy - (START_SVG_HEIGHT / 2)}
                text={model.workerName.value}
            />
            {editButtons}
        </g>
    )
}
