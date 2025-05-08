/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ComponentViewInfo } from "./util";

export class NavigationHistoryManager {
    private previousStates: ComponentViewInfo[];

    constructor() {
        this.previousStates = [];
    }

    public push(entry: ComponentViewInfo) {
        this.previousStates.push(entry);
    }

    public pop(): ComponentViewInfo {
        return this.previousStates.pop();
    }

    public clear() {
        this.previousStates = [];
    }

    public isStackEmpty(): boolean {
        return this.previousStates.length === 0;
    }
}
