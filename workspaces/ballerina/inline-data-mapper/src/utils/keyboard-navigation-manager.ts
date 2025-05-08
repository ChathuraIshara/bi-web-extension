/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import Mousetrap from "mousetrap";

export class KeyboardNavigationManager {
    path: string;
    content: string;
    undoStack: Map<string, string[]>;
    redoStack: Map<string, string[]>;
    trap: Mousetrap.MousetrapInstance;
    static instance : KeyboardNavigationManager;

    private constructor() {
        this.undoStack = new Map();
        this.redoStack = new Map();
        this.trap = new Mousetrap();
    }

    public static getClient() {
        if (!this.instance){
            this.instance = new KeyboardNavigationManager();
        }
        return this.instance;
    }

    public bindNewKey(key: string | string[], callbackFunction: (args: any) => void, args?: any) {
        this.trap.bind(key, () => {
            callbackFunction(args);
            return false;
        });
    }

    public resetMouseTrapInstance() {
        this.trap.reset()
    }
}
