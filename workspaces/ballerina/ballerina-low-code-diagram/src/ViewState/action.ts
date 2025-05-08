/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { SimpleBBox } from "./simple-bbox";
import { ViewState } from "./view-state";

export class ActionViewState extends ViewState {
    public endpointName?: string;
    public trigger: SimpleBBox = new SimpleBBox();
    public iconId: string = "default";
    public actionName?: string;
    public resourcePath?: string;

    constructor() {
        super();
    }
}
