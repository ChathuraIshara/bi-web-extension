/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { generatePrompt } from './prompt';
import { COMMANDS } from '../constants';

export function activateAiPrompt(context: vscode.ExtensionContext) {

	let prompt = vscode.commands.registerCommand(COMMANDS.ADD_MEDIATOR, async () => {
		let userInput = await vscode.window.showInputBox({ prompt: 'What you want to add?' });
		let editor = vscode.window.activeTextEditor;
		if (userInput && editor) {
			let document = editor.document;
			let text = document.getText();

			const prompt = unescape(generatePrompt(text, userInput));

			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Processing...",
				cancellable: false
			}, async (progress) => {
				progress.report({ increment: 0 });

				try {
					const apiKey = vscode.workspace.getConfiguration('MI').get('apiKey');
					if (!apiKey) {
						vscode.window.showErrorMessage('Please set your OpenAI API key in the settings.');
						return;
					}
					// const response = await axios.post('https://api.openai.com/v1/chat/completions', {
					// 	model: "gpt-3.5-turbo",
					// 	"messages": [{ "role": "user", "content": prompt }],
					// 	temperature: 0.2,
					// }, {
					// 	headers: {
					// 		'Content-Type': 'application/json',
					// 		'Authorization': `Bearer ${apiKey}`
					// 	}
					// });

					// progress.report({ increment: 50 });

					// const data = response.data;
					// if (editor) {
					// 	const position = editor.selection.active;
					// 	await editor.edit(editBuilder => {
					// 		const content = data.choices[0].message.content;
					// 		editBuilder.replace(new vscode.Range(document.positionAt(0), document.positionAt(text.length)), content);
					// 	});
					// }

					progress.report({ increment: 100 });
				} catch (error) {
					vscode.window.showErrorMessage('An error occurred while processing your request.');
				}
			});
		}
	});

	context.subscriptions.push(prompt);
}

