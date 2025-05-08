/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { SCOPE } from '@wso2-enterprise/ballerina-core';
import { BallerinaExtension } from '../core';
import { WorkspaceConfiguration, workspace, Uri } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export enum VERSION {
    BETA = 'beta',
    ALPHA = 'alpha',
    PREVIEW = 'preview'
}

export const AGENTS_FILE = "agents.bal";
export const AUTOMATION_FILE = "automation.bal";
export const CONFIG_FILE = "config.bal";
export const CONNECTIONS_FILE = "connections.bal";
export const DATA_MAPPING_FILE = "data_mappings.bal";
export const FUNCTIONS_FILE = "functions.bal";
export const MAIN_FILE = "main.bal";
export const TYPES_FILE = "types.bal";

export const BI_PROJECT_FILES = [
    AGENTS_FILE,
    AUTOMATION_FILE,
    CONFIG_FILE,
    CONNECTIONS_FILE,
    DATA_MAPPING_FILE,
    FUNCTIONS_FILE,
    MAIN_FILE,
    TYPES_FILE
];

interface BallerinaPluginConfig extends WorkspaceConfiguration {
    home?: string;
    debugLog?: boolean;
    classpath?: string;
}

export function getPluginConfig(): BallerinaPluginConfig {
    return workspace.getConfiguration('ballerina');
}

export function isWindows(): boolean {
    return process.platform === "win32";
}

export function isSupportedVersion(ballerinaExtInstance: BallerinaExtension, supportedRelease: VERSION,
    supportedVersion: number): boolean {
    const ballerinaVersion: string = ballerinaExtInstance.ballerinaVersion.toLocaleLowerCase();
    const isPreview: boolean = ballerinaVersion.includes(VERSION.PREVIEW);
    const isAlpha: boolean = ballerinaVersion.includes(VERSION.ALPHA);
    if ((supportedRelease == VERSION.BETA && (isAlpha || isPreview)) || (supportedRelease == VERSION.ALPHA &&
        isPreview)) {
        return false;
    }

    const isBeta: boolean = ballerinaVersion.includes(VERSION.BETA);
    if ((!isAlpha && !isBeta && !isPreview) || (supportedRelease == VERSION.ALPHA && isBeta)) {
        return true;
    }

    if ((supportedRelease == VERSION.ALPHA && isAlpha) || (supportedRelease == VERSION.BETA && isBeta)) {
        const digits = ballerinaVersion.replace(/[^0-9]/g, "");
        const versionNumber = +digits;
        if (supportedVersion <= versionNumber) {
            return true;
        }
    }
    return false;
}

export function isSupportedSLVersion(ballerinaExtInstance: BallerinaExtension, minSupportedVersion: number) {
    const ballerinaVersion: string = ballerinaExtInstance.ballerinaVersion.toLocaleLowerCase();
    const isGA: boolean = !ballerinaVersion.includes(VERSION.ALPHA) && !ballerinaVersion.includes(VERSION.BETA) && !ballerinaVersion.includes(VERSION.PREVIEW);

    const regex = /(\d+)\.(\d+)\.(\d+)/;
    const match = ballerinaVersion.match(regex);
    const currentVersionNumber = match ? Number(match.slice(1).join("")) : 0;

    if (minSupportedVersion <= currentVersionNumber && isGA) {
        return true;
    }
    return false;
}

export function checkIsBI(uri: Uri): boolean {
    const config = workspace.getConfiguration('ballerina', uri);
    const inspected = config.inspect<boolean>('isBI');

    if (inspected) {
        const valuesToCheck = [
            inspected.workspaceFolderValue,
            inspected.workspaceValue,
            inspected.globalValue
        ];
        return valuesToCheck.find(value => value === true) !== undefined; // Return true if isBI is set to true
    }
    return false; // Return false if isBI is not set
}

export function checkIsBallerina(uri: Uri): boolean {
    const ballerinaTomlPath = path.join(uri.fsPath, 'Ballerina.toml');
    return fs.existsSync(ballerinaTomlPath);
}

export function fetchScope(uri: Uri): SCOPE {
    const config = workspace.getConfiguration('ballerina', uri);
    const inspected = config.inspect<SCOPE>('scope');

    if (inspected) {
        const valuesToCheck = [
            inspected.workspaceFolderValue,
            inspected.workspaceValue,
            inspected.globalValue
        ];
        const scope = valuesToCheck.find(value => value !== undefined) as SCOPE;
        if (scope) {
            // Create BI files if the scope is set
            setupBIFiles(uri.fsPath);
        }
        return scope;
    }
}

export function setupBIFiles(projectDir: string): void {
    BI_PROJECT_FILES.forEach(file => {
        const filePath = path.join(projectDir, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
        }
    });
}
