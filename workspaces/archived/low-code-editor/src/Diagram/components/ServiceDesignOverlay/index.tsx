/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext, useEffect, useRef, useState } from "react";

import { IBallerinaLangClient } from "@wso2-enterprise/ballerina-languageclient";
import {
    ComponentViewInfo,
    ConfigOverlayFormStatus,
    NavigationBarDetailContainer,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ServiceDesigner } from "@wso2-enterprise/ballerina-service-designer";
import {
    NodePosition,
    ServiceDeclaration,
    STKindChecker,
    STNode,
} from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Contexts/Diagram";
import { useHistoryContext } from "../../../DiagramViewManagerClone/context/history";
import { RecordEditor } from "../FormComponents/ConfigForms/RecordEditor";
import { FormGenerator, FormGeneratorProps } from "../FormComponents/FormGenerator";

import { ServiceDesignStyles } from "./style";

export interface ServiceDesignProps {
    model?: STNode;
    targetPosition?: NodePosition;
    onCancel?: () => void;
}

export function ServiceDesignOverlay(props: ServiceDesignProps) {
    const { onCancel: onClose, model } = props;

    const serviceDesignClasses = ServiceDesignStyles();
    const { history } = useHistoryContext();
    const {
        props: { currentFile, fullST },
        api: {
            code: { gotoSource, modifyDiagram, },
            ls: { getDiagramEditorLangClient, getExpressionEditorLangClient },
            navigation: { updateSelectedComponent }
        },
    } = useContext(Context);

    const [serviceST, setFunctionST] = React.useState<ServiceDeclaration>(undefined);

    useEffect(() => {
        if (model && STKindChecker.isServiceDeclaration(model)) {
            setFunctionST(model);
        }
    }, [model]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formConfig, setFormConfig] = useState<FormGeneratorProps>(undefined);

    const handleFormEdit = (
        stModel: STNode,
        targetPosition: NodePosition,
        configOverlayFormStatus: ConfigOverlayFormStatus,
        onClosex?: () => void,
        onSave?: () => void
    ) => {
        setFormConfig({
            model: stModel,
            configOverlayFormStatus,
            onCancel: () => {
                setIsFormOpen(false);
                if (onClosex) {
                    onClose();
                }
            },
            onSave: () => {
                setIsFormOpen(false);
                if (onSave) {
                    onSave();
                }
            },
            targetPosition
        });
        setIsFormOpen(true);
    };

    const handleResourceDefInternalNav = (resourceModel: STNode) => {
        const currentElementInfo = history[history.length - 1];
        const componentViewInfo: ComponentViewInfo = {
            filePath: currentElementInfo.file,
            position: resourceModel.position
        }
        updateSelectedComponent(componentViewInfo);
    }

    return (
        <div className={serviceDesignClasses.container}>
            <ServiceDesigner
                model={serviceST}
                langClientPromise={
                    getDiagramEditorLangClient() as unknown as Promise<IBallerinaLangClient>
                }
                currentFile={currentFile}
                onClose={onClose}
                handleDiagramEdit={handleFormEdit}
                recordEditor={RecordEditor}
                fullST={fullST}
                getDiagramEditorLangClient={getDiagramEditorLangClient}
                getExpressionEditorLangClient={getExpressionEditorLangClient}
                gotoSource={gotoSource}
                handleResourceDefInternalNav={handleResourceDefInternalNav}
                modifyDiagram={modifyDiagram}
            />
            {isFormOpen && (
                <FormGenerator {...formConfig} />
            )}
        </div>
    );
}
