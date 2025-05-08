/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ok } from "assert";
import { readFile as readFileCallback } from "fs";
import { resolve } from "path";
import { promisify } from "util";
import type { IChildLogger, IVSCodeExtLogger } from "@vscode-logging/types";
import { NOOP_LOGGER, configureLogger } from "@vscode-logging/wrapper";
import { type ExtensionContext, window } from "vscode";
import { getTelemetryReporter } from "../telemetry/telemetry";
import { TelemetryWrapper } from "./telemetry-wrapper";

const readFile = promisify(readFileCallback);

// On file load we initialize our logger to `NOOP_LOGGER`
// this is done because the "real" logger cannot be initialized during file load.
// only once the `activate` function has been called in extension.ts
// as the `ExtensionContext` argument to `activate` contains the required `logPath`
let loggerImpel: IVSCodeExtLogger = NOOP_LOGGER;
let childLogger: IChildLogger = new TelemetryWrapper(loggerImpel, getTelemetryReporter());

export function getLogger(): IChildLogger {
	return childLogger;
}

function setLogger(newLogger: IVSCodeExtLogger): void {
	loggerImpel = newLogger;
	childLogger = new TelemetryWrapper(loggerImpel, getTelemetryReporter());
}

const LOGGING_LEVEL_PROP = "Logging.loggingLevel";
const SOURCE_LOCATION_PROP = "Logging.sourceLocationTracking";

export async function initLogger(context: ExtensionContext): Promise<void> {
	const meta = JSON.parse(await readFile(resolve(context.extensionPath, "package.json"), "utf8"));

	// By asserting the existence of the properties in the package.json
	// at runtime, we avoid many copy-pasta mistakes...
	const configProps = meta?.contributes?.configuration?.properties;
	ok(configProps?.[LOGGING_LEVEL_PROP]);
	ok(configProps?.[SOURCE_LOCATION_PROP]);

	const extLogger = configureLogger({
		extName: meta.displayName,
		logPath: context.logUri.fsPath,
		logOutputChannel: window.createOutputChannel(meta.displayName, "json"),
		// set to `true` if you also want your VSCode extension to log to the console.
		logConsole: false,
		loggingLevelProp: LOGGING_LEVEL_PROP,
		sourceLocationProp: SOURCE_LOCATION_PROP,
		subscriptions: context.subscriptions,
	});

	setLogger(extLogger);
}
