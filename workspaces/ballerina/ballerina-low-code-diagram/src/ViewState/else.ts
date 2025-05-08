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

export class ElseViewState extends BlockViewState {

    public ifHeadWidthOffset: number = 0;
    public ifHeadHeightOffset: number = 0;
    public widthDiffOfIfBody: number = 0;
    public elseTopHorizontalLine: SimpleBBox = undefined;
    public elseBottomHorizontalLine: SimpleBBox = undefined;
    public elseBody: SimpleBBox = undefined;
    constructor() {
        super();
        this.elseBody = new SimpleBBox();
        this.elseBottomHorizontalLine = new SimpleBBox();
        this.elseTopHorizontalLine = new SimpleBBox();
    }
}
