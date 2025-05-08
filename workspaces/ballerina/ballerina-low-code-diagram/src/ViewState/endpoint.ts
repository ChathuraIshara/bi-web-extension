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

export class EndpointViewState extends ViewState {
    public visible: boolean = false;
    public isUsed: boolean = false;
    public isExternal: boolean = false;
    public isParameter: boolean = false;
    public epName?: string;
    public start: SimpleBBox = new SimpleBBox();
    public lifeLine: SimpleBBox = new SimpleBBox();
    public actionExecution: SimpleBBox = new SimpleBBox();
    public client: SimpleBBox = new SimpleBBox();
    public iconId: string = "default";
    public typeName: string;
    public expandConnectorHeight?: number = 0;

    constructor() {
        super();
        this.visible = true;
        this.isUsed = false;
    }
}
