/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { BlockViewState } from "./block";
import { SimpleBBox } from "./simple-bbox";
import { StatementViewState } from "./statement";

export class WhileViewState extends StatementViewState {
    public whileLifeLine: SimpleBBox = new SimpleBBox();
    public whileHead: SimpleBBox = new SimpleBBox();
    public whileBody: BlockViewState = new BlockViewState();
    public whileBodyRect: SimpleBBox = new SimpleBBox();

    constructor() {
        super();
    }
}
