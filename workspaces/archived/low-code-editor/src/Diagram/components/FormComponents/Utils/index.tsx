/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import {
    ConnectorConfig, ExpressionEditorLangClientInterface,
    FormField,
    FormFieldReturnType,
    genVariableName,
    getAllVariables, PublishDiagnosticsParams,
    STModification,
    STSymbolInfo
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FunctionDefinition, ModulePart, NodePosition, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import * as monaco from "monaco-editor";
import { Diagnostic } from "vscode-languageserver-protocol";

import { createImportStatement, createPropertyStatement, createQueryWhileStatement, updateFunctionSignature } from "../../../utils/modification-util";
import * as Forms from "../ConfigForms";
import { FormFieldChecks } from "../Types";

export const FILE_SCHEME = "file://";
export const EXPR_SCHEME = "expr://";

export function getForm(type: string, args: any) {
    const Form = (Forms as any)[type];
    return Form ? (
        <Form {...args} />
    ) : <Forms.Custom {...args} />;
}

export function isAllEmpty(allFieldChecks: Map<string, FormFieldChecks>): boolean {
    let result = true
    allFieldChecks?.forEach((fieldChecks, key) => {
        if (!fieldChecks.isEmpty) {
            result = false;
        }
    });
    return result;
}

export function isAllIgnorable(fields: FormField[]): boolean {
    let result = true;
    fields?.forEach((field, key) => {
        if (!(field.optional || field.defaultable)) {
            result = false;
        }
    });
    return result;
}

export function isAllDefaultableFields(recordFields: FormField[]): boolean {
    return recordFields?.every((field) => field.defaultable || (field.fields && isAllDefaultableFields(field.fields)));
}

export function isAnyFieldSelected(recordFields: FormField[]): boolean {
    return recordFields?.some((field) => field.selected || (field.fields && isAnyFieldSelected(field.fields)));
}

export function isAllFieldsValid(allFieldChecks: Map<string, FormFieldChecks>, model: FormField | FormField[], isRoot: boolean): boolean {
    let result = true;
    let canModelIgnore = false;
    let allFieldsIgnorable = false;

    if (!isRoot) {
        const formField = model as FormField;
        canModelIgnore = formField.optional || formField.defaultable;
        allFieldsIgnorable = isAllIgnorable(formField.fields);
    } else {
        const formFields = model as FormField[];
        allFieldsIgnorable = isAllIgnorable(formFields);
    }

    allFieldChecks?.forEach(fieldChecks => {
        if (!canModelIgnore && !fieldChecks.canIgnore && (!fieldChecks.isValid || fieldChecks.isEmpty)) {
            result = false;
        }
        if (fieldChecks.canIgnore && !fieldChecks.isEmpty && !fieldChecks.isValid) {
            result = false;
        }
    });

    return result;
}

const BALLERINA_CENTRAL_ROOT = 'https://lib.ballerina.io';
const BALLERINA_CENTRAL_STAGE = 'https://staging-lib.ballerina.io';
const BALLERINA_CENTRAL_DEV = 'https://dev-lib.ballerina.io';

export enum VERSION {
    BETA = 'beta',
    ALPHA = 'alpha',
    PREVIEW = 'preview'
}

export function generateDocUrl(org: string, module: string, method: string, clientName: string, env: string) {
    const environment = env === "dev" ? BALLERINA_CENTRAL_DEV : env === "stage" ? BALLERINA_CENTRAL_STAGE : BALLERINA_CENTRAL_ROOT;

    // tslint:disable-next-line: no-console
    return method ? clientName ? `${environment}/${org}/${module}/latest/clients/${clientName}#${method}` :
        `${environment}/${org}/${module}/latest/clients/Client#${method}` : clientName ?
        `${environment}/${org}/${module}/latest/clients/${clientName}` :
        `${environment}/${org}/${module}/latest/clients/Client`;
}

export function updateFunctionSignatureWithError(modifications: STModification[], activeFunction: FunctionDefinition) {
    const parametersStr = activeFunction.functionSignature.parameters.map((item) => item.source).join(",");
    const returnTypeStr = addErrorReturnType(activeFunction.functionSignature.returnTypeDesc?.source.trim());

    const functionSignature = updateFunctionSignature(activeFunction.functionName.value, parametersStr, returnTypeStr, {
        ...activeFunction.functionSignature.position,
        startColumn: activeFunction.functionName.position.startColumn,
    });
    if (functionSignature) {
        modifications.push(functionSignature);
    }
}

function addErrorReturnType(returnTypeStr: string): string {
    // The function signature already includes the error return type.
    if (returnTypeStr?.includes("error")) {
        return returnTypeStr;
    }
    // Handles the scenarios where the error return type is not present.
    if (returnTypeStr?.includes("?") || returnTypeStr?.includes("()")) {
        returnTypeStr = returnTypeStr + "|error";
    } else if (returnTypeStr) {
        returnTypeStr = returnTypeStr + "|error?";
    } else {
        returnTypeStr = "returns error?";
    }
    return returnTypeStr;
}

export function addReturnTypeImports(modifications: STModification[], returnType: FormFieldReturnType) {
    if (returnType.importTypeInfo) {
        returnType.importTypeInfo?.forEach((typeInfo) => {
            const addImport: STModification = createImportStatement(typeInfo.orgName, typeInfo.moduleName, {
                startColumn: 0,
                startLine: 0,
            });
            const existsMod = modifications.find(
                (modification) => JSON.stringify(addImport) === JSON.stringify(modification)
            );
            if (!existsMod) {
                modifications.push(addImport);
            }
        });
    }
}

export function isDependOnDriver(connectorModule: string): boolean {
    const dbConnectors = ["mysql", "mssql", "postgresql", "oracledb", "cdata.connect", "snowflake"]
    if (dbConnectors.includes(connectorModule)) {
        return true;
    }
    return false;
}

export function addDbExtraImport(modifications: STModification[], syntaxTree: STNode, orgName: string, moduleName: string) {
    let importCounts: number = 0;
    if (STKindChecker.isModulePart(syntaxTree)) {
        (syntaxTree as ModulePart).imports?.forEach((imp) => {
            if (
                imp.typeData?.symbol?.moduleID &&
                imp.typeData.symbol.moduleID.orgName === orgName &&
                imp.typeData.symbol.moduleID.moduleName === `${moduleName}.driver`
            ) {
                importCounts = importCounts + 1;
            }
        });
        if (importCounts === 0 && isDependOnDriver(moduleName)) {
            const addDriverImport: STModification = createImportStatement(orgName, `${moduleName}.driver as _`, {
                startColumn: 0,
                startLine: 0,
            });
            modifications.push(addDriverImport);
        }
    }
}

export function addDbExtraStatements(
    modifications: STModification[],
    config: ConnectorConfig,
    stSymbolInfo: STSymbolInfo,
    targetPosition: NodePosition,
    isAction: boolean
) {
    if (config.action.name === "query") {
        const resultUniqueName = genVariableName("recordResult", getAllVariables(stSymbolInfo));
        const returnTypeName = config.action.returnVariableName;
        const addQueryWhileStatement = createQueryWhileStatement(resultUniqueName, returnTypeName, targetPosition);
        modifications.push(addQueryWhileStatement);

        const closeStreamStatement = `check ${returnTypeName}.close();`;
        const addCloseStreamStatement = createPropertyStatement(closeStreamStatement, targetPosition);
        modifications.push(addCloseStreamStatement);
    }
    if (!isAction) {
        const resp = config.name;
        const closeStatement = `check ${resp}.close();`;
        const addCloseStatement = createPropertyStatement(closeStatement, targetPosition);
        modifications.push(addCloseStatement);
    }
}

export function isStatementEditorSupported(version: string): boolean {
    // Version example
    // 2301.0.0
    // major release of next year
    // YYMM.0.0
    if (!version) {
        return false;
    }
    const versionRegex = new RegExp("^[0-9]{4}.[0-9].[0-9]");
    const versionStr = version.match(versionRegex);
    const splittedVersions = versionStr[0]?.split(".");
    if ((parseInt(splittedVersions[0], 10) === 2201)) {
        // 2201.1.x
        if ((parseInt(splittedVersions[1], 10) === 1)) {
            return parseInt(splittedVersions[2], 10) >= 1;
        } else {
            // > 2201.0 (eg: 2301.1.2, 2301.2.2)
            return parseInt(splittedVersions[1], 10) > 0;
        }
    } else if (parseInt(splittedVersions[0], 10) > 2201) {
        // > 2201 (eg: 2301, 2202)
        return true;
    } else {
        return false;
    }
}

export function getUpdatedSource(statement: string, currentFileContent: string,
                                 targetPosition: NodePosition, moduleList?: Set<string>,
                                 skipSemiColon?: boolean): string {

    const updatedStatement = skipSemiColon ? statement : (statement.trim().endsWith(';') ? statement : statement + ';');
    return addToTargetPosition(currentFileContent, targetPosition, updatedStatement);
}

export function addToTargetPosition(currentContent: string, position: NodePosition, codeSnippet: string): string {

    const splitContent: string[] = currentContent.split(/\n/g) || [];
    const splitCodeSnippet: string[] = codeSnippet.trimEnd().split(/\n/g) || [];
    const noOfLines: number = position.endLine - position.startLine + 1;
    const startLine = splitContent[position.startLine].slice(0, position.startColumn);
    const endLine = isFinite(position?.endLine) ?
        splitContent[position.endLine].slice(position.endColumn || position.startColumn) : '';

    const replacements = splitCodeSnippet.map((line, index) => {
        let modifiedLine = line;
        if (index === 0) {
            modifiedLine = startLine + modifiedLine;
        }
        if (index === splitCodeSnippet.length - 1) {
            modifiedLine = modifiedLine + endLine;
        }
        if (index > 0) {
            modifiedLine = " ".repeat(position.startColumn) + modifiedLine;
        }
        return modifiedLine;
    });

    splitContent.splice(position.startLine, noOfLines, ...replacements);

    return splitContent.join('\n');
}

export async function checkDiagnostics(path: string, updatedContent: string, ls: any, targetPosition: NodePosition) {
    const fileURI = monaco.Uri.file(path).toString().replace(FILE_SCHEME, EXPR_SCHEME);
    await sendDidChange(fileURI, updatedContent, ls.getDiagramEditorLangClient);
    return handleDiagnostics(updatedContent, fileURI, targetPosition, ls.getDiagramEditorLangClient);
}

export async function getDiagnostics(
    docUri: string,
    getLangClient: () => Promise<ExpressionEditorLangClientInterface>): Promise<PublishDiagnosticsParams[]> {
    const langClient = await getLangClient();
    const diagnostics = await langClient.getDiagnostics({
        documentIdentifier: {
            uri: docUri,
        }
    });

    return diagnostics;
}

export const handleDiagnostics = async (source: string, fileURI: string, targetPosition: NodePosition,
                                        getLangClient: () => Promise<ExpressionEditorLangClientInterface>):
    Promise<Diagnostic[]> => {
    const diagResp = await getDiagnostics(fileURI, getLangClient);
    const diag = diagResp[0]?.diagnostics ? diagResp[0].diagnostics : [];
    return diag;
}

export async function sendDidChange(
    docUri: string,
    content: string,
    getLangClient: () => Promise<ExpressionEditorLangClientInterface>) {
    const langClient = await getLangClient();
    langClient.didChange({
        contentChanges: [
            {
                text: content
            }
        ],
        textDocument: {
            uri: docUri,
            version: 1
        }
    });
}

export function isSupportedSLVersion(balVersion: string, minSupportedVersion: number) {
    const ballerinaVersion: string = balVersion.toLocaleLowerCase();
    const isGA: boolean = !ballerinaVersion.includes(VERSION.ALPHA) && !ballerinaVersion.includes(VERSION.BETA) && !ballerinaVersion.includes(VERSION.PREVIEW);

    const regex = /(\d+)\.(\d+)\.(\d+)/;
    const match = ballerinaVersion.match(regex);
    const currentVersionNumber = match ? Number(match.slice(1).join("")) : 0;

    if (minSupportedVersion <= currentVersionNumber && isGA) {
        return true;
    }
    return false;
}
