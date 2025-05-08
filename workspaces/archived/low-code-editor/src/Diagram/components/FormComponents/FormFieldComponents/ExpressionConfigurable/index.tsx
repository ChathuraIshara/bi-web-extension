// tslint:disable: jsx-no-multiline-js
/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import MonacoEditor from "react-monaco-editor";

import {
    ConfigurableKeyword,
    NodePosition,
    STKindChecker,
    TypedBindingPattern,
} from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../../Contexts/Diagram";
import {
    ExpressionInjectablesProps,
    FormGenerator,
    InjectableItem,
} from "../../FormGenerator";

export interface ExpressionConfigurableProps {
    varType: string;
    textLabel: string;
    expressionInjectables?: ExpressionInjectablesProps;
    model: any;
    monacoRef: React.MutableRefObject<MonacoEditor>;
    showConfigurableView: boolean;
    setShowConfigurableView: (visible: boolean) => void;
}

export const configurableTypes = ["string", "int", "float", "boolean", "xml"];

export function ExpressionConfigurable(props: ExpressionConfigurableProps) {
    const {
        varType,
        textLabel,
        expressionInjectables,
        model,
        monacoRef,
        showConfigurableView,
        setShowConfigurableView,
    } = props;
    const {
        props: { fullST, stSymbolInfo },
    } = useDiagramContext();

    const configInsertPosition: NodePosition = {
        startLine: 0,
        startColumn: 0,
        endLine: 0,
        endColumn: 0,
    };
    if (STKindChecker.isModulePart(fullST) && fullST.imports.length > 0) {
        const lastImportPosition =
        fullST.imports[fullST.imports.length - 1].position;
        configInsertPosition.startLine = lastImportPosition?.endLine + 1;
        configInsertPosition.endLine = lastImportPosition?.endLine + 1;
        configInsertPosition.startColumn = lastImportPosition?.endColumn; // 0
        configInsertPosition.endColumn = lastImportPosition?.endColumn; // 0
    }

    const exitingItem = expressionInjectables?.list?.find(
        (item: InjectableItem) => item.id === model.name
    );
    const variableName = exitingItem
        ? exitingItem.name
        : textLabel.replace(/[^A-Z0-9]+/gi, "");

    const updateParentConfigurable = (newValue: string) => {
        const editorModel = monacoRef?.current?.editor?.getModel();
        if (editorModel) {
            editorModel.setValue(newValue);
            monacoRef.current.editor.focus();
        }
    };

    const hideConfigurableView = () => setShowConfigurableView(false);

    return (
        <>
            {showConfigurableView && (
                <FormGenerator
                    configOverlayFormStatus={{
                        formType: "Configurable",
                        isLoading: false,
                        formArgs: {
                            stSymbolInfo,
                            updateInjectables: expressionInjectables,
                            configurableId: model?.name,
                            updateParentConfigurable,
                        },
                    }}
                    onCancel={hideConfigurableView}
                    onSave={hideConfigurableView}
                    targetPosition={configInsertPosition}
                    model={{
                        ...model,
                        position: configInsertPosition,
                        qualifiers: [
                            {
                                kind: "ConfigurableKeyword",
                                isToken: true,
                                value: "configurable",
                            },
                        ],
                        typedBindingPattern: {
                            bindingPattern: {
                                variableName: {
                                    value: variableName,
                                },
                            },
                        },
                        initializer: {
                          source: exitingItem ? exitingItem.value : model.value,
                          typeData: {
                                typeSymbol: {
                                    typeKind: varType,
                                },
                            },
                        },
                    }}
                />
            )}
        </>
    );
}
