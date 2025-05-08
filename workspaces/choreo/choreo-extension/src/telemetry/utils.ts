/*
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { authStore } from "../stores/auth-store";
import { getTelemetryReporter } from "./telemetry";

// export async function sendProjectTelemetryEvent(eventName: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number; }) {
//     try {
//         const choreoProject = await ext.api.getChoreoProject();
//         if (choreoProject) {
//             sendTelemetryEvent(eventName, { ...properties, ...{ 'project': choreoProject?.name } }, measurements);
//         } else {
//             sendTelemetryEvent(eventName, properties, measurements);
//         }
//     } catch (error) {
//         getLogger().error("Failed to send telemetry event", error);
//     }
// };

// this will inject custom dimensions to the event and send it to the telemetry server
export function sendTelemetryEvent(eventName: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
	const reporter = getTelemetryReporter();
	reporter.sendTelemetryEvent(eventName, { ...properties, ...getCommonProperties() }, measurements);
}

export function sendTelemetryException(error: Error, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
	const reporter = getTelemetryReporter();
	reporter.sendTelemetryErrorEvent(`error:${error.message}`, { ...properties, ...getCommonProperties() }, measurements);
}

// Create common properties for all events
export function getCommonProperties(): { [key: string]: string } {
	return {
		idpId: authStore.getState().state?.userInfo?.userId!,
		// check if the email ends with "@wso2.com"
		isWSO2User: authStore.getState().state?.userInfo?.userEmail?.endsWith("@wso2.com") ? "true" : "false",
	};
}
