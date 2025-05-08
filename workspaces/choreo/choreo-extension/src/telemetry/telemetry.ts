/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import TelemetryReporter from "@vscode/extension-telemetry";
import type * as vscode from "vscode";

// TODO: replace with connection string
const key = "8f98bf03-9ba8-47ba-a18d-62449b92ca42";

// telemetry reporter
let reporter: TelemetryReporter;

export function activateTelemetry(context: vscode.ExtensionContext) {
	reporter = new TelemetryReporter(key);
	context.subscriptions.push(reporter);
}

export function getTelemetryReporter() {
	return reporter;
}
