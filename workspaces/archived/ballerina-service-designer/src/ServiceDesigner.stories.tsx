/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import serviceModel from "./data/serviceST.json";
import { ServiceDeclaration } from "@wso2-enterprise/syntax-tree";
import { ServiceDesigner } from "./ServiceDesigner";

export default {
    component: ServiceDesigner,
    title: 'Service Designer',
};

export const EmptyModel = () => <ServiceDesigner />;

export const WithSampleResourceModel = () => <ServiceDesigner model={serviceModel as unknown as ServiceDeclaration}/>;
