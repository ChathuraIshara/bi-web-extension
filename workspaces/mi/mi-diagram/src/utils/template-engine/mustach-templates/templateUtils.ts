/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { STNode, Switch } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { MEDIATORS } from "../../../resources/constants";

export function getNewSubSequenceXml(name: string, st: STNode) {
    switch (name) {
        case MEDIATORS.CLONE:
            return getNewCloneTargetXml();
        case MEDIATORS.SWITCH:
            return getNewSwitchCaseXml(st as Switch);
    }
}

function getNewCloneTargetXml() {
    return `<target>
    <sequence></sequence>
</target>`
}

function getNewSwitchCaseXml(st: Switch) {
    let caseName = "case";
    let caseCount = 1;
    if (st._case) {
        caseCount = st._case.length;
    }
    if (caseCount > 0)
        caseName += caseCount;

    return `<case regex="${caseName}">
    </case>`;
}
