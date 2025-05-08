/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { ServiceForm } from "./ServiceForm";
import { Service } from "../../utils/definitions";

export default {
    component: ServiceForm,
    title: 'Service Form',
};

const serviceConfig: Service = {
    path: "/",
    port: 9090,
    resources: [],
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0,
    },
}

const onSave = (service: Service) => {
    console.log("Service ", service);
}

const onClose = () => {
  console.log("Service Form closed");
}

export const EmptyModel = () => <ServiceForm isOpen={true} serviceConfig={serviceConfig} onSave={onSave} onClose={onClose} />;
