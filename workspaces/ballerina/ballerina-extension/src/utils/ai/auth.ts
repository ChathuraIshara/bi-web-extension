/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { extension } from "../../BalExtensionContext";
import { commands } from 'vscode';
import { StateMachineAI } from 'src/views/ai-panel/aiMachine';
import { AI_EVENT_TYPE } from '@wso2-enterprise/ballerina-core';

//TODO: What if user doesnt have github copilot.
//TODO: Where does auth git get triggered
export async function loginGithubCopilot() {
    try {
        // Request a session with the 'github' authentication provider
        const session = await vscode.authentication.getSession('github', ['user:email'], { createIfNone: true });
        if (session) {
            // Access the account information
            const { account, accessToken } = session;
            const { label, id } = account;

            // Output the account information
            console.log(`GitHub Account Label: ${label}`);
            console.log(`GitHub Account ID: ${id}`);

            try {
                const copilot_resp = await fetch('https://api.github.com/copilot_internal/v2/token', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "editor-version": "Neovim/0.6.1",
                        "editor-plugin-version": "copilot.vim/1.16.0",
                        "user-agent": "GithubCopilot/1.155.0"
                    },
                });
                const copilot_resp_body: any = await copilot_resp.json();
                //TODO: What if user doesnt have github copilot.
                const copilot_token = copilot_resp_body.token;
                await extension.context.secrets.store('GITHUB_TOKEN', accessToken);
                await extension.context.secrets.store('GITHUB_COPILOT_TOKEN', copilot_token);
                console.log('GitHub Copilot authorized successfully.');
                return true;
            } catch (error) {
                console.error('Error exchanging GitHub Copilot information:', error);
                vscode.window.showErrorMessage('An error occurred while exchanging GitHub Copilot information. Make sure you have GitHub Copilot access.');
                return false;
            }
        } else {
            console.log('No GitHub session found. User may not be signed in.');
            return false;
        }
    } catch (error) {
        console.error('Error retrieving GitHub account information:', error);
        return false;
    }
}

export async function refreshGithubCopilotToken() {
    try {
        console.log("Refreshing GitHub Copilot token...");
        const accessToken = await extension.context.secrets.get('GITHUB_TOKEN');
        const copilot_resp = await fetch('https://api.github.com/copilot_internal/v2/token', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "editor-version": "Neovim/0.6.1",
                "editor-plugin-version": "copilot.vim/1.16.0",
                "user-agent": "GithubCopilot/1.155.0"
            },
        });
        const copilot_resp_body: any = await copilot_resp.json();
        console.log(copilot_resp_body);
        const copilot_token = copilot_resp_body.token;
        await extension.context.secrets.store('GITHUB_COPILOT_TOKEN', copilot_token);
    } catch (error) {
        console.error('Error retrieving GitHub account information:', error);
    }
}

vscode.authentication.onDidChangeSessions(async e => {
    if (e.provider.id === 'github') {
        if (await copilotTokenExists()) {
            // its a logout. remove token.
            await extension.context.secrets.delete('GITHUB_COPILOT_TOKEN');
            await extension.context.secrets.delete('GITHUB_TOKEN');
        } else {
            //it could be a login(which we havent captured) or a logout 
            // vscode.window.showInformationMessage(
            //     'Ballerina Integrator supports completions with GitHub Copilot.',
            //     'Login with GitHub Copilot'
            // ).then(selection => {
            //     if (selection === 'Login with GitHub Copilot') {
            //         commands.executeCommand('ballerina.login.copilot');
            //     }
            // });
        }
    }
});

async function copilotTokenExists() {
    const copilotToken = await extension.context.secrets.get('GITHUB_COPILOT_TOKEN');
    return copilotToken !== undefined && copilotToken !== '';
}
