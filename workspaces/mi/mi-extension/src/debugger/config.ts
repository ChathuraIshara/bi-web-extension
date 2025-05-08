
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';

export class DebuggerConfig {
    private static commandPort: number = vscode.workspace.getConfiguration().get<number>('MI.debugger.commandPort', 9005);
    private static eventPort: number = vscode.workspace.getConfiguration().get<number>('MI.debugger.eventPort', 9006);
    private static baseServerPort: number = vscode.workspace.getConfiguration().get<number>('MI.serverPort', 8290);
    private static serverReadinessPort: number = 9201;
    private static managementPort: number = 9164;
    private static host: string = 'localhost';
    private static internalOffset = 10;
    private static envVariables: { [key: string]: string } = {};
    private static vmArgs: string[] = [];
    private static vmArgsPortOffset: number = 0;

    //Capps and Libs copied to the MI server
    private static copiedCappUri: string[] = [];
    private static copiedLibs: string[] = [];

    // Management API username and password
    private static managementUserName: string = "admin";
    private static managementPassword: string = "admin";

    private static portOffset: number | undefined;

    public static getEnvVariables(): { [key: string]: string } {
        return this.envVariables;
    }

    public static setEnvVariables(envVariables: { [key: string]: string }): void {
        this.envVariables = envVariables;
    }


    public static getCommandPort(): number {
        return this.commandPort;
    }

    public static getEventPort(): number {
        return this.eventPort;
    }

    public static setPortOffset(offset: number | undefined): void {
        this.portOffset = offset;
    }

    public static setCopiedCapp(capp: string) {
        if (this.copiedCappUri.length > 0) {
            this.copiedCappUri.push(capp);
        } else {
            this.copiedCappUri = [capp];
        }
    }

    public static getCopiedCapp() {
        return this.copiedCappUri;
    }

    public static setCopiedLibs(libs: string) {
        if (this.copiedLibs.length > 0) {
            this.copiedLibs.push(libs);
        } else {
            this.copiedLibs = [libs];
        }
    }

    public static getCopiedLibs() {
        return this.copiedLibs;
    }

    public static resetCappandLibs() {
        this.copiedCappUri = [];
        this.copiedLibs = [];
    }

    public static getServerPort(): number {
        if (this.vmArgsPortOffset !== 0) {
            return this.baseServerPort + this.vmArgsPortOffset - this.internalOffset;
        }
        if (this.portOffset !== undefined) {
            return this.baseServerPort + this.portOffset - this.internalOffset;
        }
        return this.baseServerPort;
    }

    public static getServerReadinessPort(): number {
        if (this.vmArgsPortOffset !== 0) {
            return this.serverReadinessPort + this.vmArgsPortOffset - this.internalOffset;
        }
        if (this.portOffset !== undefined) {
            return this.serverReadinessPort + this.portOffset - this.internalOffset;
        }
        return this.serverReadinessPort;
    }

    public static getManagementPort(): number {
        if (this.vmArgsPortOffset !== 0) {
            return this.managementPort + this.vmArgsPortOffset - this.internalOffset;
        }
        if (this.portOffset !== undefined) {
            return this.managementPort + this.portOffset - this.internalOffset;
        }
        return this.managementPort;
    }

    public static getHost(): string {
        return this.host;
    }

    public static getManagementUserName(): string {
        return this.managementUserName;
    }

    public static getManagementPassword(): string {
        return this.managementPassword;
    }

    public static setManagementUserName(userName: string): void {
        this.managementUserName = userName;
    }

    public static setManagementPassword(password: string): void {
        this.managementPassword = password;
    }
    public static getVmArgs(): string[] {
        return this.vmArgs;
    }

    public static setVmArgs(vmArgs: string[]): void {
        this.vmArgs = vmArgs;
        for (const arg of this.vmArgs) {
            const match = arg.match(/-DportOffset=(\d+)/);
            if (match) {
                this.vmArgsPortOffset = parseInt(match[1]);
            }
        }
    }
}
