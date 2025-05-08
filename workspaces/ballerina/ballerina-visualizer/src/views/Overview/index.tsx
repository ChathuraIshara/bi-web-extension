/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Overview as OverviewComponent } from "@wso2-enterprise/overview-view";
import { VisualizerLocation } from "@wso2-enterprise/ballerina-core";
import { ViewWrapper } from "../styles";

export function Overview(props: { visualizerLocation: VisualizerLocation }) {
    return (
        <ViewWrapper>
            <h1>Overview</h1>
            <OverviewComponent visualizerLocation={props.visualizerLocation} />
        </ViewWrapper>
    );
}
