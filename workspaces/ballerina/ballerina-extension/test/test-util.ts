/**
 * Copyright (c) 2018, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it

// Ballerina tools distribution will be copied to following location by maven
import { readdirSync, realpathSync } from 'fs';
import { join, sep } from 'path';
const kill = require("kill-port");

const TEST_RESOURCES = join(__dirname, '..', '..', 'extractedDistribution').toString();
const PLATFORM_PREFIX = /jballerina-tools-/;


function findBallerinaDistribution() {
    const directories = readdirSync(TEST_RESOURCES);
    if (directories.length === 1) {
        return directories[0];
    }
    if (directories.length > 1) {
        for (const index in directories) {
            if (directories[index].startsWith('ballerina')) {
                return directories[index];
            }
        }
    }
    throw new Error("Unable to find ballerina distribution in test resources.");
}

export function getBallerinaHome(): string {
    const filePath = TEST_RESOURCES + sep + findBallerinaDistribution();
    return realpathSync(filePath);
}

export function getBallerinaCmd(): string {
    const ballerinaDistribution = TEST_RESOURCES + sep + findBallerinaDistribution();
    const prefix = join(realpathSync(ballerinaDistribution), "bin") + sep;
    return prefix + (isWindows() ? 'bal.bat' : 'bal');
}

export function getBallerinaVersion() {
    return findBallerinaDistribution().replace(PLATFORM_PREFIX, '').replace('\n', '').trim();
}

export function getBBEPath(): any {
    return join(__dirname, '..', 'data');
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function killPort(port: number) {
    if (!isWindows()) {
        (async () => {
            await kill(port);
        })();
    }
}

export function isWindows(): boolean {
    return process.platform === "win32";
}
