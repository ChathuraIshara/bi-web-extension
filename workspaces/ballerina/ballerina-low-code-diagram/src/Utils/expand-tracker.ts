/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
class ExpandTracker {
    private expandedSignatures: string[];
    constructor() {
        this.expandedSignatures = [];
    }

    isExpanded(signature: string): boolean {
        return this.expandedSignatures.indexOf(signature) > -1;
    }

    addExpandedSignature(signature: string) {
        this.expandedSignatures.push(signature);
    }

    removeExpandedSignature(signature: string) {
        const index = this.expandedSignatures.indexOf(signature);

        if (index > -1) {
            this.expandedSignatures.splice(index, 1);
        }
    }
}

const expandTracker = new ExpandTracker();
export default expandTracker;
