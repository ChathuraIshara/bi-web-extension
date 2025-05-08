/*
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { IChildLogger } from "@vscode-logging/logger";
import type TelemetryReporter from "@vscode/extension-telemetry";

// This is the telemetry wrapper class that is used to send telemetry data to the App Insights backend.
// It will implment the IChildLogger interface by wrapping a provided logger instance.
// It will only send telemetry for error events.

export class TelemetryWrapper implements IChildLogger {
	private logger: IChildLogger;
	private reporter: TelemetryReporter;

	constructor(logger: IChildLogger, reporter: TelemetryReporter) {
		this.logger = logger;
		this.reporter = reporter;
	}
	public fatal(msg: string, ...args: any[]): void {
		this.logger.fatal(msg, args);
		this.reporter.sendTelemetryErrorEvent("vscode-error-occurred", {
			message: msg,
		});
	}

	public error(message: string, error?: Error): void {
		this.logger.error(message, error);
		this.reporter.sendDangerousTelemetryErrorEvent("vscode-error-occurred", {
			message: message,
			error: error ? error.toString() : "",
		});
	}

	public warn(message: string, error?: Error): void {
		this.logger.warn(message, error);
	}

	public info(message: string): void {
		this.logger.info(message);
	}

	public debug(message: string): void {
		this.logger.debug(message);
	}

	public trace(message: string): void {
		this.logger.trace(message);
	}

	public getChildLogger(opts: { label: string }): IChildLogger {
		return new TelemetryWrapper(this.logger.getChildLogger(opts), this.reporter);
	}
}
