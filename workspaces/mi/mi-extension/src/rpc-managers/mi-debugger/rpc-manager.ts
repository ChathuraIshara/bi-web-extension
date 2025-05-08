/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */
import {
    AddBreakpointToSourceRequest,
    AddBreakpointToSourceResponse,
    GetBreakpointInfoRequest,
    GetBreakpointInfoResponse,
    GetBreakpointsRequest,
    GetBreakpointsResponse,
    MiDebuggerAPI,
    RemoveBreakpointFromSourceRequest,
    StepOverBreakpointRequest,
    StepOverBreakpointResponse,
    ValidateBreakpointsRequest,
    ValidateBreakpointsResponse
} from "@wso2-enterprise/mi-core";
import * as vscode from "vscode";
import { StateMachine, refreshUI } from "../../stateMachine";

export class MiDebuggerRpcManager implements MiDebuggerAPI {
    async validateBreakpoints(params: ValidateBreakpointsRequest): Promise<ValidateBreakpointsResponse> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const definition = await langClient.validateBreakpoints(params);

            resolve(definition);
        });
    }

    async getBreakpointInfo(params: GetBreakpointInfoRequest): Promise<GetBreakpointInfoResponse> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const breakpointInfo = await langClient.getBreakpointInfo(params);

            resolve(breakpointInfo);
        });
    }

    async addBreakpointToSource(params: AddBreakpointToSourceRequest): Promise<AddBreakpointToSourceResponse> {
        return new Promise(async (resolve) => {
            const breakpoint = new vscode.SourceBreakpoint(
                new vscode.Location(vscode.Uri.file(params.filePath), new vscode.Position(params.breakpoint.line, params.breakpoint?.column || 0)));
            vscode.debug.addBreakpoints([breakpoint]);
            refreshUI();

            resolve({ isBreakpointValid: true });
        });
    }

    async getBreakpoints(params: GetBreakpointsRequest): Promise<GetBreakpointsResponse> {
        return new Promise(async (resolve) => {
            const breakpointsForFile: vscode.SourceBreakpoint[] = vscode.debug.breakpoints.filter((breakpoint) => {
                const sourceBreakpoint = breakpoint as vscode.SourceBreakpoint;
                return sourceBreakpoint.location.uri.fsPath === params.filePath;
            }) as vscode.SourceBreakpoint[];

            const breakpoints = breakpointsForFile.map((breakpoint) => {
                return {
                    line: breakpoint.location.range.start.line,
                    column: breakpoint.location.range.start?.character
                };
            });


            // get the  current stackTrace to find the triggered breakpoint
            const debugSession = vscode.debug.activeDebugSession;
            let currentLine = 0;
            let currentColumn = 0;
            if (debugSession) {
                // Request the stack trace for the current thread
                const response = await debugSession.customRequest('stackTrace', {
                    threadId: 1,
                });

                if (response && response.stackFrames) {
                    // Check the first stack frame, as it represents the current execution point
                    const firstFrame = response.stackFrames[0];
                    const currentFile = firstFrame.source.path;
                    if (currentFile === params.filePath) {
                        // convert to debugger line since its zero based
                        currentLine = Math.max(0, firstFrame.line - 1);
                        currentColumn = Math.max(0, firstFrame?.column - 1);
                    }
                }
            }
            resolve({ breakpoints, activeBreakpoint: { line: currentLine, column: currentColumn } });
        });
    }

    async getStepOverBreakpoint(params: StepOverBreakpointRequest): Promise<StepOverBreakpointResponse> {
        return new Promise(async (resolve) => {
            const langClient = StateMachine.context().langClient!;
            const breakpointInfo = await langClient.getStepOverBreakpoint(params);

            resolve(breakpointInfo);
        });
    }

    removeBreakpointFromSource(params: RemoveBreakpointFromSourceRequest): void {
        const breakpointsForFile: vscode.SourceBreakpoint[] = vscode.debug.breakpoints.filter((breakpoint) => {
            const sourceBreakpoint = breakpoint as vscode.SourceBreakpoint;
            return sourceBreakpoint.location.uri.fsPath === params.filePath;
        }) as vscode.SourceBreakpoint[];

        const breakpoints = breakpointsForFile.filter((breakpoint) => {
            return breakpoint.location.range.start.line === params.breakpoint.line && breakpoint.location.range.start?.character === params.breakpoint?.column;
        });

        // If there are no breakpoints found, then it could be due the breakpoint has been added from the sourceCode, where the column is not provided
        // so we need to check for breakpoint with the same line and remove
        if (breakpoints.length === 0) {
            vscode.debug.removeBreakpoints(breakpointsForFile.filter((breakpoint) => {
                return breakpoint.location.range.start.line === params.breakpoint.line;
            }));
        } else {
            breakpoints.forEach((breakpoint) => {
                vscode.debug.removeBreakpoints([breakpoint]);
            });
        }

        refreshUI();
    }
}
