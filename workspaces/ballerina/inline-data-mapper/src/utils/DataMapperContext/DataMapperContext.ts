/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { IDMModel, Mapping } from "@wso2-enterprise/ballerina-core";
import { View } from "../../components/DataMapper/Views/DataMapperView";

export interface IDataMapperContext {
    model: IDMModel;
    views: View[];
    addView: (view: View) => void;
    applyModifications: (mappings: Mapping[]) => Promise<void>;
    addArrayElement: (targetField: string) => Promise<void>;
}

export class DataMapperContext implements IDataMapperContext {

    constructor(
        public model: IDMModel,
        public views: View[] = [],
        public addView: (view: View) => void,
        public applyModifications: (mappings: Mapping[]) => Promise<void>,
        public addArrayElement: (targetField: string) => Promise<void>
    ){}
}
