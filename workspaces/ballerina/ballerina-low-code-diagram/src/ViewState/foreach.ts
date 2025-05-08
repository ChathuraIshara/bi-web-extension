/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { BlockViewState } from "./block";
import { SimpleBBox } from "./simple-bbox";
import { StatementViewState } from "./statement";

export class ForEachViewState extends StatementViewState {
    public foreachLifeLine: SimpleBBox = new SimpleBBox();
    public foreachHead: SimpleBBox = new SimpleBBox();
    public foreachBody: BlockViewState = new BlockViewState();
    public foreachBodyRect: SimpleBBox = new SimpleBBox();

    constructor() {
        super();
    }
}
