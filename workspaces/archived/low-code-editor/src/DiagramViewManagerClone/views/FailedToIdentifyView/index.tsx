/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
import React from "react";

import { ServiceInvalidImg } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { ServiceUnsupportedStyles } from "./style";

interface FailedToIdentifyMessageOverlayProps {
    onResetClick: () => void;
}

export function FailedToIdentifyMessageOverlay(props: FailedToIdentifyMessageOverlayProps) {
    const { onResetClick } = props;
    const serviceUnsupportedClasses = ServiceUnsupportedStyles();

    return (
        <div className={serviceUnsupportedClasses.overlayWrapper}>
            <ServiceInvalidImg />
            <p className={serviceUnsupportedClasses.title}>Failed to identify construct, source code has changed significantly.</p>
            <p className={serviceUnsupportedClasses.subtitle}><a className={serviceUnsupportedClasses.clickable} onClick={onResetClick}>Click here</a> to move back to overview page</p>
        </div>
    );
}
