/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { Box, FormControl } from "@material-ui/core";
import {
    BallerinaConnectorInfo,
    genVariableName,
    getAllVariables,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../Contexts/Diagram";
import { TextPreLoader } from "../../../../../../PreLoader/TextPreLoader";
import { createCheckObjectDeclaration, createObjectDeclaration, getInitialSource } from "../../../../../utils";
import { getFormattedModuleName } from "../../../../Portals/utils";
import { FormGeneratorProps } from "../../../FormGenerator";
import { wizardStyles as useFormStyles } from "../../style";
import { getConnectorImports, getDefaultParams, getFormFieldReturnType, isParentNodeWithErrorReturn } from "../util";

interface EndpointFormProps {
    connector: BallerinaConnectorInfo;
    functionNode: STNode;
    isModuleType?: boolean;
}

export function EndpointForm(props: FormGeneratorProps) {
    const formClasses = useFormStyles();

    const intl = useIntl();
    const { model, targetPosition, onCancel, onSave, configOverlayFormStatus } = props;
    const { isLoading, formArgs } = configOverlayFormStatus;
    const { connector, functionNode, isModuleType } = formArgs as EndpointFormProps;

    const {
        props: { currentFile, stSymbolInfo, fullST, experimentalEnabled, ballerinaVersion },
        api: {
            ls: { getExpressionEditorLangClient },
            code: { modifyDiagram, updateFileContent },
            library,
            runBackgroundTerminalCommand,
            openExternalUrl
        },
    } = useContext(Context);

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.endpointForm.title",
        defaultMessage: "Endpoint",
    });

    const imports = getConnectorImports(fullST, connector.package.organization, connector.moduleName);
    const moduleName = getFormattedModuleName(connector.moduleName);
    const parentWithError = isParentNodeWithErrorReturn(functionNode);
    const isModuleVar = (!functionNode || isModuleType);
    let initialSource = "EXPRESSION";

    if (model && model.source) {
        // Update existing endpoint
        initialSource = model.source;
    } else if (connector?.functions) {
        // Adding new endpoint
        const initFunction = (connector as BallerinaConnectorInfo).functions?.find((func) => func.name === "init");
        if (initFunction) {
            const defaultParameters = getDefaultParams(initFunction.parameters);
            const returnType = getFormFieldReturnType(initFunction.returnType);

            initialSource = getInitialSource(
                (returnType?.hasError && (isModuleVar || parentWithError)) // INFO: New code actions will update parent function and `check` keyword
                    ? createCheckObjectDeclaration(
                          `${moduleName}:${connector.name}`,
                          genVariableName(`${moduleName}Ep`, getAllVariables(stSymbolInfo)),
                          defaultParameters,
                          targetPosition
                      )
                    : createObjectDeclaration(
                          `${moduleName}:${connector.name}`,
                          genVariableName(`${moduleName}Ep`, getAllVariables(stSymbolInfo)),
                          defaultParameters,
                          targetPosition
                      )
            );
        } else {
            initialSource = getInitialSource(
                createObjectDeclaration(
                    `${moduleName}:${connector.name}`,
                    genVariableName(`${moduleName}Ep`, getAllVariables(stSymbolInfo)),
                    [""],
                    targetPosition
                )
            );
        }
    }

    // HACK
    formArgs.targetPosition = targetPosition;

    return (
        <>
            {isLoading && (
                <FormControl className={formClasses.wizardFormControlExtended}>
                    <Box display="flex" justifyContent="center" width="100%">
                        <TextPreLoader position="absolute" text="Loading connector..." />
                    </Box>
                </FormControl>
            )}
            {!isLoading &&
                connector?.functions?.length > 0 &&
                StatementEditorWrapper({
                    label: formTitle,
                    initialSource,
                    formArgs: { formArgs },
                    config: { type: "Connector" },
                    onWizardClose: onSave,
                    onCancel,
                    currentFile,
                    getLangClient: getExpressionEditorLangClient,
                    applyModifications: modifyDiagram,
                    updateFileContent,
                    library,
                    syntaxTree: fullST,
                    stSymbolInfo,
                    extraModules: imports,
                    experimentalEnabled,
                    runBackgroundTerminalCommand,
                    isModuleVar,
                    ballerinaVersion,
                    openExternalUrl
                })}
        </>
    );
}
