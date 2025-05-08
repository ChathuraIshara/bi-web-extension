/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DebugProtocol } from "vscode-debugprotocol";

export class BreakpointManager {
    private static instance: BreakpointManager;
    private currentBreakpoints: DebugProtocol.Breakpoint[] = [];
    private activeBreakpoint: DebugProtocol.Breakpoint | undefined;

    constructor() {
        BreakpointManager.instance = this;
    }

    public static getInstance(): BreakpointManager {
        return BreakpointManager.instance;
    }

    public setBreakpoints(breakpoints: DebugProtocol.Breakpoint[]) {
        this.currentBreakpoints = breakpoints;
    }

    public addBreakpoints(breakpoints: DebugProtocol.Breakpoint[]) {
        this.currentBreakpoints.push(...breakpoints);
    }

    public getBreakpoints(): DebugProtocol.Breakpoint[] {
        return this.currentBreakpoints;
    }

    public setActiveBreakpoint(breakpoint: DebugProtocol.Breakpoint) {
        this.activeBreakpoint = breakpoint;
    }

    public getActiveBreakpoint(): DebugProtocol.Breakpoint | undefined {
        return this.activeBreakpoint;
    }

    public clearBreakpoints() {
        this.currentBreakpoints = [];
    }
}
