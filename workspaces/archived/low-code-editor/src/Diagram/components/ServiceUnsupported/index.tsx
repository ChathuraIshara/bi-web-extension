/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { ServiceInvalidImg } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { ServiceUnsupportedStyles } from "./style";

export function ServiceUnsupportedOverlay() {
    const serviceUnsupportedClasses = ServiceUnsupportedStyles();

    return (
        <div className={serviceUnsupportedClasses.overlayWrapper}>
            <ServiceInvalidImg />
            <p className={serviceUnsupportedClasses.title}>Diagram editing for this is not supported</p>
            <p className={serviceUnsupportedClasses.subtitle}>Please move to code</p>
        </div>
    );
}
