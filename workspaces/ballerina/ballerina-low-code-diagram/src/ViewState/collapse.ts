/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { ViewState } from "./view-state";

export class CollapseViewState extends ViewState {
    public collapsed: boolean = true;
    public range: NodePosition;
    constructor() {
        super();
        this.bBox = undefined;
    }
}
