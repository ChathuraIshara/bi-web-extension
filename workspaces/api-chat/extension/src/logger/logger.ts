/*
 *  Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 * 
 *  This software is the property of WSO2 LLC. and its suppliers, if any.
 *  Dissemination of any information or reproduction of any material contained
 *  herein is strictly forbidden, unless permitted by WSO2 in accordance with
 *  the WSO2 Commercial License available at http://wso2.com/licenses.
 *  For specific language governing the permissions and limitations under
 *  this license, please see the license as well as any agreement you’ve
 *  entered into with WSO2 governing the purchase of this software and any
 *  associated services.
 */

/**
 * This file manages the logger's state.
 */
import { readFile as readFileCallback } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import { ok } from "assert";
import { ExtensionContext, window } from "vscode";
import { IChildLogger, IVSCodeExtLogger } from "@vscode-logging/types";
import { configureLogger, NOOP_LOGGER } from "@vscode-logging/wrapper";
import { TelemetryWrapper } from "./telemetry-wrapper";
import { getTelemetryReporter } from "../telemetry/telemetry";

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
  const meta = JSON.parse(
    await readFile(resolve(context.extensionPath, "package.json"), "utf8")
  );

  const extLogger = configureLogger({
    extName: meta.displayName,
    logPath: context.logUri.fsPath,
    logOutputChannel: window.createOutputChannel(meta.displayName),
    // set to `true` if you also want your VSCode extension to log to the console.
    logConsole: false,
    loggingLevelProp: LOGGING_LEVEL_PROP,
    sourceLocationProp: SOURCE_LOCATION_PROP,
    subscriptions: context.subscriptions
  });

  setLogger(extLogger);
}
