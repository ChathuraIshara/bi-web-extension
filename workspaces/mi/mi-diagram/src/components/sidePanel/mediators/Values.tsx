/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react"
import { DATA_SERVICE_NODES } from "../../../resources/constants"
import TransformationForm from "../dataServices/transformation";
import QueryForm from "../dataServices/query";
import InputMappingsForm from "../dataServices/input-mapping";
import OutputMappingsForm from "../dataServices/output-mapping";

export interface GetMediatorsProps {
    nodePosition: any;
    trailingSpace: string;
    documentUri: string;
    parentNode?: string;
    previousNode?: string;
    nextNode?: string;
}
export function getAllDataServiceForms(props: GetMediatorsProps) {
    const { nodePosition, documentUri, trailingSpace } = props;
    return [
        {
            title: "Input Mapping",
            operationName: DATA_SERVICE_NODES.INPUT,
            form: <InputMappingsForm nodePosition={nodePosition} documentUri={documentUri} trailingSpace={trailingSpace}></InputMappingsForm>,
        },
        {
            title: "Query",
            operationName: DATA_SERVICE_NODES.QUERY,
            form: <QueryForm nodePosition={nodePosition} documentUri={documentUri} trailingSpace={trailingSpace}></QueryForm>,
        },
        {
            title: "Transformation",
            operationName: DATA_SERVICE_NODES.TRANSFORMATION,
            form: <TransformationForm nodePosition={nodePosition} documentUri={documentUri} trailingSpace={trailingSpace}></TransformationForm>,
        },
        {
            title: "Output Mapping",
            operationName: DATA_SERVICE_NODES.OUTPUT,
            form: <OutputMappingsForm nodePosition={nodePosition} documentUri={documentUri} trailingSpace={trailingSpace}></OutputMappingsForm>,
        }
    ]
}