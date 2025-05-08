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

import { GraphqlUnsupportedStyles } from "./style";

export function GraphqlUnsupportedVersionOverlay() {
    const graphqlUnsupportedClasses = GraphqlUnsupportedStyles();

    return (
        <div className={graphqlUnsupportedClasses.overlayWrapper}>
            <ServiceInvalidImg />
            <p className={graphqlUnsupportedClasses.title}>Unable to load the GraphQL visualizer</p>
            <p className={graphqlUnsupportedClasses.subtitle}>Please update the Ballerina version</p>
        </div>
    );
}
