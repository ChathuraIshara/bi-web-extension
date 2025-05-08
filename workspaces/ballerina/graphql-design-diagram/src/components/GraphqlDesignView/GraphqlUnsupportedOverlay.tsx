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

import { GraphqlUnsupportedStyles } from "./styles";

export function GraphqlUnsupportedOverlay() {
    const graphqlUnsupportedClasses = GraphqlUnsupportedStyles();

    return (
        <div className={graphqlUnsupportedClasses.overlayWrapper}>
            <p className={graphqlUnsupportedClasses.title}>Unable to load the GraphQL visualizer</p>
            <p className={graphqlUnsupportedClasses.subtitle}>Please check for compilation errors within the code</p>
        </div>
    );
}
