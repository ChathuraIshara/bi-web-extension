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

import { getLogger } from "../logger/logger";
import { getTelemetryReporter } from "./telemetry";

export async function sendProjectTelemetryEvent(eventName: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }) {
    try {
        sendTelemetryEvent(eventName, properties, measurements);
    } catch (error) {
        getLogger().error("Failed to send telemetry event", error);
    }
};

// this will inject custom dimensions to the event and send it to the telemetry server
export function sendTelemetryEvent(
    eventName: string,
    properties?: { [key: string]: string; },
    measurements?: { [key: string]: number; }
) {
    const reporter = getTelemetryReporter(); 
    reporter.sendTelemetryEvent(eventName, { ...properties }, measurements);
}

export function sendTelemetryException(
    error: Error,
    properties?: { [key: string]: string; },
    measurements?: { [key: string]: number; }
) {
    const reporter = getTelemetryReporter();
    reporter.sendTelemetryException(error, { ...properties }, measurements);
}
