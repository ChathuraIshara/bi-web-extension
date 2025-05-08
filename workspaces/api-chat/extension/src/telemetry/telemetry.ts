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
import * as vscode from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';

const key = '8f98bf03-9ba8-47ba-a18d-62449b92ca42';

// telemetry reporter
let reporter: TelemetryReporter;

export function activateTelemetry(context: vscode.ExtensionContext) {
   reporter = new TelemetryReporter(key);
   context.subscriptions.push(reporter);
}

export function getTelemetryReporter() {
   return reporter;
}
