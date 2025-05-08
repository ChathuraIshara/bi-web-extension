/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { RemoteMethodCallAction, STNode, Visitor } from "@wso2-enterprise/syntax-tree";

export class ActionInvocationFinder implements Visitor {
    // TODO: use the correct type once the syntax-tree types are updated
    public action: any = undefined;
    constructor() {
        this.action = undefined;
    }

    public beginVisitRemoteMethodCallAction(node: RemoteMethodCallAction) {
        this.action = node;
    }

    public beginVisitClientResourceAccessAction(node: STNode) {
        this.action = node;
    }

    public getIsAction(): RemoteMethodCallAction {
        return this.action;
    }
}
