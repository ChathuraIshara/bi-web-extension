/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import { STNode } from "@wso2-enterprise/syntax-tree";

import { useVisualizerContext } from "../../../Context";
import { getSymbolInfo } from "@wso2-enterprise/ballerina-low-code-diagram";
import { StatementEditorComponent } from "../../StatementEditorComponent";
import { getDefaultParams, getFormFieldReturnType, getPathParams, getReturnTypeImports, isParentNodeWithErrorReturn } from "../ConnectorWizard/utils";
import { BallerinaConnectorInfo, createActionStatement, createCheckActionStatement, createCheckedRemoteServiceCall, createCheckedResourceServiceCall, createRemoteServiceCall, FunctionDefinitionInfo, genVariableName, getAllVariables, getInitialSource, STModification } from "@wso2-enterprise/ballerina-core";

interface ActionFormProps {
    action: FunctionDefinitionInfo;
    endpointName: string;
    isClassField: boolean;
    functionNode: STNode;
    isHttp: boolean;
    applyModifications: (modifications: STModification[]) => Promise<void>;
    selectedConnector: BallerinaConnectorInfo;

}

export function ActionForm(props: ActionFormProps) {
    const { action, endpointName, isClassField, functionNode, isHttp, applyModifications, selectedConnector } = props;
    const { activeFileInfo, statementPosition, setActivePanel, setSidePanel } = useVisualizerContext();
    const targetPosition = statementPosition;
    const stSymbolInfo = getSymbolInfo();
    const formArgs = {
        action: action,
        endpointName: endpointName,
        isClassField,
        functionNode,
        isHttp,
    }

    let initialSource = "EXPRESSION";
    let imports = new Set<string>();

    // Adding new endpoint
    const queryParameters = getDefaultParams(action.parameters);
    const pathParameters = getPathParams(action.pathParams);
    const returnType = getFormFieldReturnType(action.returnType);
    const parentWithError = isParentNodeWithErrorReturn(functionNode);
    imports = getReturnTypeImports(returnType);

    if (action.qualifiers?.includes("resource")) {
        // handle resource functions
        initialSource = getInitialSource(
            createCheckedResourceServiceCall(
                returnType.returnType,
                genVariableName(`${action.name}Response`, getAllVariables(stSymbolInfo)),
                endpointName,
                pathParameters,
                action.name,
                queryParameters,
                targetPosition,
                isClassField
            )
        );
    } else if (isHttp) {
        // handle http functions if resource functions are not available in metadata
        queryParameters.shift();
        initialSource = getInitialSource(
            createCheckedResourceServiceCall(
                returnType.returnType,
                genVariableName(`${action.name}Response`, getAllVariables(stSymbolInfo)),
                endpointName,
                [],
                action.name === "get" ? "" : action.name,
                queryParameters,
                targetPosition,
                isClassField
            )
        );
    } else if (action.qualifiers?.includes("remote") || action.isRemote) {
        // handle remote function
        initialSource = getInitialSource(
            returnType.hasReturn
                ? returnType.hasError && parentWithError // INFO: New code actions will update parent function and `check` keyword
                    ? createCheckedRemoteServiceCall(
                        returnType.returnType,
                        genVariableName(`${action.name}Response`, getAllVariables(stSymbolInfo)),
                        endpointName,
                        action.name,
                        queryParameters,
                        targetPosition,
                        isClassField
                    )
                    : createRemoteServiceCall(
                        returnType.returnType,
                        genVariableName(`${action.name}Response`, getAllVariables(stSymbolInfo)),
                        endpointName,
                        action.name,
                        queryParameters,
                        targetPosition,
                        isClassField
                    )
                : returnType.hasError && parentWithError
                    ? createCheckActionStatement(endpointName, action.name, queryParameters, targetPosition, isClassField)
                    : createActionStatement(endpointName, action.name, queryParameters, targetPosition, isClassField)
        );
    }

    const closeStatementEditor = () => {
        setSidePanel("EMPTY");
    }


    return (
        <>
            {
                action &&
                <StatementEditorComponent
                    label={"Action"}
                    initialSource={initialSource}
                    formArgs={formArgs}
                    config={{ type: isHttp ? "HttpAction" : "Action" }}
                    applyModifications={applyModifications}
                    currentFile={{
                        content: activeFileInfo?.fullST?.source || "",
                        path: activeFileInfo?.filePath,
                        size: 1
                    }}
                    onCancel={closeStatementEditor}
                    onClose={closeStatementEditor}
                    syntaxTree={activeFileInfo?.fullST}
                    targetPosition={statementPosition}
                    skipSemicolon={false}
                    extraModules={imports}

                />
            }
        </>
    );
}
