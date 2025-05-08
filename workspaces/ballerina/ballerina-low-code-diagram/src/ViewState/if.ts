/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DefaultConfig } from "../Visitors/default";

import { BlockViewState } from "./block";
import { ElseViewState } from "./else";
import { SimpleBBox } from "./simple-bbox";
import { StatementViewState } from "./statement";

export class IfViewState extends StatementViewState {
    public headIf: SimpleBBox = new SimpleBBox();
    public ifBody: BlockViewState = new BlockViewState();
    public defaultElseVS: ElseViewState = undefined;
    public offSetBetweenIfElse: number = DefaultConfig.horizontalGapBetweenComponents;
    public offSetAtBottom: number = 25;
    public verticalOffset: number = DefaultConfig.offSet;
    public isElseIf: boolean = false;
    public elseIfTopHorizontalLine: SimpleBBox = new SimpleBBox();
    public elseIfBottomHorizontalLine: SimpleBBox = new SimpleBBox();
    public elseIfHeadWidthOffset: number = 0;
    public elseIfHeadHeightOffset: number = 0;
    public elseIfLifeLine: SimpleBBox = new SimpleBBox();
    public childElseIfViewState: IfViewState[];
    public childElseViewState: ElseViewState;
    public isMainIfBody: boolean = false;

    constructor() {
        super();
        this.childElseIfViewState = [];
    }
}
