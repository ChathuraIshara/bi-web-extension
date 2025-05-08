/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as path from "path";
import { CommandIds } from "@wso2-enterprise/choreo-core";
import * as vscode from "vscode";
import * as yaml from "yaml";

// Register all code lenses here
export function activateCodeLenses(context: vscode.ExtensionContext) {
	const yamlCodeLensProvider = new YAMLCodeLensProvider();
	context.subscriptions.push(vscode.languages.registerCodeLensProvider({ scheme: "file", language: "yaml" }, yamlCodeLensProvider));
}

class YAMLCodeLensProvider implements vscode.CodeLensProvider {
	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		const codeLenses: vscode.CodeLens[] = [];
		const componentFsPath = path.dirname(path.dirname(document.uri.fsPath));

		const addDependencyCmd: vscode.Command = {
			title: "Add Connection",
			command: CommandIds.CreateComponentDependency,
			tooltip: "Add a new API connection to your Choreo component",
			arguments: [{ componentFsPath, isCodeLens: true }],
		};

		const viewDependencyCmd: vscode.Command = {
			title: "View Documentation",
			command: CommandIds.ViewDependency,
			tooltip: "View documentation on how to use this connection dependency",
		};

		if (document.fileName.endsWith("component.yaml")) {
			const yamlContent = document.getText();
			const lineCounter = new yaml.LineCounter();
			const parsedYaml = yaml.parseDocument(yamlContent, { lineCounter });
			const connectionReferences = parsedYaml.getIn(["dependencies", "connectionReferences"], true);
			if (connectionReferences && yaml.isSeq(connectionReferences) && connectionReferences.range?.[0]) {
				const linePos = lineCounter.linePos(connectionReferences.range?.[0]);
				const range = new vscode.Range(linePos.line - 2, linePos.col, linePos.line - 2, linePos.col + connectionReferences.toString()?.length);
				codeLenses.push(new vscode.CodeLens(range, addDependencyCmd));
				for (const item of connectionReferences.items) {
					const nameNode = (item as yaml.Document.Parsed<yaml.YAMLSeq.Parsed, true>).get("name", true);
					if (nameNode && yaml.isNode(nameNode) && nameNode.range?.[0]) {
						const value = nameNode.toString();
						const linePos = lineCounter.linePos(nameNode.range?.[0]);
						const range = new vscode.Range(linePos.line - 1, linePos.col, linePos.line - 1, linePos.col + value?.length);
						const viewDependencyCommand = { ...viewDependencyCmd };
						viewDependencyCommand.arguments = [{ componentFsPath, isCodeLens: true, connectionName: value?.trim() }];
						codeLenses.push(new vscode.CodeLens(range, viewDependencyCommand));
					}
				}
			} else {
				const range = new vscode.Range(0, 0, 0, 0);
				codeLenses.push(new vscode.CodeLens(range, addDependencyCmd));
			}
		}
		return codeLenses;
	}

	resolveCodeLens?(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
		return new vscode.CodeLens(codeLens.range, codeLens.command);
	}
}
