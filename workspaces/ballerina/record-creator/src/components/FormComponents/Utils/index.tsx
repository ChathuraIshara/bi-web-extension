/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { LangClientRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { DiagnosticData, DiagnosticsResponse } from "@wso2-enterprise/ballerina-core";
import { Codicon, Tooltip, Typography } from "@wso2-enterprise/ui-toolkit";
import * as monaco from "monaco-editor";
import { VERSION } from "../../../types";

export const FILE_SCHEME = "file://";
export const EXPR_SCHEME = "expr://";

export function getUpdatedSource(
    statement: string,
    currentFileContent: string,
    targetPosition: NodePosition,
    moduleList?: Set<string>,
    skipSemiColon?: boolean
): string {
    const updatedStatement = skipSemiColon ? statement : statement.trim().endsWith(";") ? statement : statement + ";";
    return addToTargetPosition(currentFileContent, targetPosition, updatedStatement);
}

function addToTargetPosition(currentContent: string, position: NodePosition, codeSnippet: string): string {
    const splitContent: string[] = currentContent.split(/\n/g) || [];
    const splitCodeSnippet: string[] = codeSnippet.trimEnd().split(/\n/g) || [];
    const noOfLines: number = position.endLine - position.startLine + 1;
    const startLine = splitContent[position.startLine].slice(0, position.startColumn);
    const endLine = isFinite(position?.endLine)
        ? splitContent[position.endLine].slice(position.endColumn || position.startColumn)
        : "";

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

    return splitContent.join("\n");
}

export async function checkDiagnostics(
    path: string,
    updatedContent: string,
    langServerRpcClient: LangClientRpcClient
): Promise<DiagnosticData[]> {
    const fileURI = monaco.Uri.file(path).toString().replace(FILE_SCHEME, EXPR_SCHEME);
    await sendDidChange(fileURI, updatedContent, langServerRpcClient);
    return handleDiagnostics(fileURI, langServerRpcClient);
}

async function getDiagnostics(docUri: string, langServerRpcClient: LangClientRpcClient): Promise<DiagnosticsResponse> {
    const diagnostics = await langServerRpcClient.getDiagnostics({
        documentIdentifier: {
            uri: docUri,
        },
    });

    return diagnostics;
}

const handleDiagnostics = async (
    fileURI: string,
    langServerRpcClient: LangClientRpcClient
): Promise<DiagnosticData[]> => {
    const diagResp = await getDiagnostics(fileURI, langServerRpcClient);
    const diag = diagResp?.diagnostics ? diagResp.diagnostics : [];
    return diag;
};

async function sendDidChange(docUri: string, content: string, langServerRpcClient: LangClientRpcClient) {
    langServerRpcClient.didChange({
        contentChanges: [
            {
                text: content,
            },
        ],
        textDocument: {
            uri: docUri,
            version: 1,
        },
    });
}

export function isSupportedSLVersion(balVersion: string, minSupportedVersion: number) {
    const ballerinaVersion: string = balVersion.toLocaleLowerCase();
    const isGA: boolean =
        !ballerinaVersion.includes(VERSION.ALPHA) &&
        !ballerinaVersion.includes(VERSION.BETA) &&
        !ballerinaVersion.includes(VERSION.PREVIEW);

    const regex = /(\d+)\.(\d+)\.(\d+)/;
    const match = ballerinaVersion.match(regex);
    const currentVersionNumber = match ? Number(match.slice(1).join("")) : 0;

    if (minSupportedVersion <= currentVersionNumber && isGA) {
        return true;
    }
    return false;
}

export function getTooltipIconComponent(title: string): React.ReactNode {
    return (
        <Tooltip content={<Typography variant="body1">{title}</Typography>} position="bottom-end">
            <Codicon name="info" />
        </Tooltip>
    );
}
