/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";

import {
    AddArrayElementRequest,
    FlowNode,
    IDMModel,
    InlineDataMapperSourceRequest,
    LinePosition,
    Mapping,
    SubPanel,
    SubPanelView
} from "@wso2-enterprise/ballerina-core";
import { DataMapperView } from "@wso2-enterprise/ballerina-inline-data-mapper";
import { ProgressIndicator } from "@wso2-enterprise/ui-toolkit";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { ExpressionFormField } from "@wso2-enterprise/ballerina-side-panel";

import { useInlineDataMapperModel } from "../../Hooks";

interface InlineDataMapperProps {
    filePath: string;
    flowNode: FlowNode;
    propertyKey: string;
    editorKey: string;
    position: LinePosition;
    onClosePanel: (subPanel: SubPanel) => void;
    updateFormField: (data: ExpressionFormField) => void;
}

export function InlineDataMapper(props: InlineDataMapperProps) {
    const { filePath, flowNode, propertyKey, editorKey, position, onClosePanel, updateFormField } = props;

    const [isFileUpdateError, setIsFileUpdateError] = useState(false);
    const [model, setModel] = useState<IDMModel>(null);

    const { rpcClient } = useRpcContext();
    const {
        model: initialModel,
        isFetching,
        isError
    } = useInlineDataMapperModel(filePath, flowNode, propertyKey, position);

    useEffect(() => {
        if (initialModel) {
            setModel(initialModel);
        }
    }, [initialModel]);

    const onClose = () => {
        onClosePanel({ view: SubPanelView.UNDEFINED });
    }

    const updateExpression = async (mappings: Mapping[]) => {
        try {
            const updateSrcRequest: InlineDataMapperSourceRequest = {
                filePath,
                flowNode,
                propertyKey,
                position,
                mappings
            };
            const resp = await rpcClient
                .getInlineDataMapperRpcClient()
                .getDataMapperSource(updateSrcRequest);
            console.log(">>> [Inline Data Mapper] getSource response:", resp);
            const updateData: ExpressionFormField = {
                value: resp.source,
                key: editorKey,
                cursorPosition: position
            }
            updateFormField(updateData);
        } catch (error) {
            console.error(error);
            setIsFileUpdateError(true);
        }
    };

    const addArrayElement = async (targetField: string) => {
        try {
            const addElementRequest: AddArrayElementRequest = {
                filePath,
                flowNode,
                propertyKey,
                position,
                targetField
            };
            const resp = await rpcClient
                .getInlineDataMapperRpcClient()
                .addNewArrayElement(addElementRequest);
            console.log(">>> [Inline Data Mapper] addArrayElement response:", resp);
            const updateData: ExpressionFormField = {
                value: resp.source,
                key: editorKey,
                cursorPosition: position
            }
            updateFormField(updateData);
        } catch (error) {
            console.error(error);
            setIsFileUpdateError(true);
        }
    };

    useEffect(() => {
        // Hack to hit the error boundary
        if (isError) {
            throw new Error("Error while fetching input/output types");
        } else if (isFileUpdateError) {
            throw new Error("Error while updating file content");
        } 
    }, [isError]);

    return (
        <>
            {isFetching && (
                 <ProgressIndicator /> 
            )}
            {model && (
                <DataMapperView 
                    model={model || initialModel}
                    onClose={onClose} 
                    applyModifications={updateExpression}
                    addArrayElement={addArrayElement}
                />
            )}
        </>
    );
};

