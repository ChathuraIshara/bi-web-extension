/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { Codicon } from "@wso2-enterprise/ui-toolkit";

import { useIONodesStyles } from "../../../styles";

export function OutputBeforeInputNotification() {
    const classes = useIONodesStyles();
    
    return (
        <div className={classes.outputBeforeInputNotification}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <Codicon name="info" sx={{ marginRight: "7px" }} />
                Click on input field first to create a mapping
            </span>
        </div>
    );
}
