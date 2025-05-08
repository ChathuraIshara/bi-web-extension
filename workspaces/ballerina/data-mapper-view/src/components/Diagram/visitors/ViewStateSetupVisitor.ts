/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ListConstructor, STKindChecker, Visitor } from "@wso2-enterprise/syntax-tree";

import { DataMapperViewState } from "../../../utils/data-mapper-view-state";

export class ViewStateSetupVisitor implements Visitor {

    public beginVisitListConstructor(node: ListConstructor) {
        node.expressions.forEach((expr) => {
            if (!STKindChecker.isCommaToken(expr) && !expr.dataMapperViewState) {
                expr.dataMapperViewState = new DataMapperViewState();
            }
        });
    }
}
