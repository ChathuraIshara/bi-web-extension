/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Point } from "@projectstorm/geometry";
import { PrimitiveBalType, TypeField } from "@wso2-enterprise/ballerina-core";
import { RequiredParam } from "@wso2-enterprise/syntax-tree";

import { useDMSearchStore } from "../../../../store/store";
import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { getSearchFilteredInput, getTypeOfInputParam, isOptionalAndNillableField } from "../../utils/dm-utils";
import { DataMapperNodeModel, TypeDescriptor } from "../commons/DataMapperNode";

export const REQ_PARAM_NODE_TYPE = "datamapper-node-required-param";
const NODE_ID = "required-param-node";

export class RequiredParamNode extends DataMapperNodeModel {
    public typeDef: TypeField;
    public x: number;
    public numberOfFields:  number;
    originalTypeDef: TypeField;

    constructor(
        public context: IDataMapperContext,
        public value: RequiredParam,
        public typeDesc: TypeDescriptor,
        public hasNoMatchingFields?: boolean
    ) {
        super(
            `${NODE_ID}${!hasNoMatchingFields && value.paramName.value}`,
            context,
            REQ_PARAM_NODE_TYPE
        );
        this.numberOfFields = 1;
        if (!hasNoMatchingFields) {
            this.originalTypeDef = this.value ? getTypeOfInputParam(this.value, this.context.ballerinaVersion) : undefined;
            this.typeDef = this.originalTypeDef;
        }
    }

    async initPorts() {
        this.numberOfFields = 1;
        this.typeDef = this.getSearchFilteredType();
        this.hasNoMatchingFields = !this.typeDef;
        if (this.typeDef) {
            const parentPort = this.addPortsForHeaderField(this.typeDef, this.value.paramName.value, "OUT", undefined, this.context.collapsedFields);

            if (this.typeDef.typeName === PrimitiveBalType.Record) {
                const fields = this.typeDef.fields;
                fields.forEach((subField) => {
                    const isOptional = isOptionalAndNillableField(subField);
                    this.numberOfFields += this.addPortsForInputRecordField(
                        subField, "OUT", this.value.paramName.value, this.value.paramName.value, '',
                        parentPort, this.context.collapsedFields, parentPort.collapsed, isOptional
                    );
                });
            } else {
                const isOptional = isOptionalAndNillableField(this.typeDef);
                this.addPortsForInputRecordField(
                    this.typeDef, "OUT", this.value.paramName.value, this.value.paramName.value,
                    '', parentPort, this.context.collapsedFields, parentPort.collapsed, isOptional
                );
            }
        }
    }

    public getSearchFilteredType() {
        if (this.value) {
            const searchValue = useDMSearchStore.getState().inputSearch;

            const matchesParamName = this.value?.paramName?.value?.toLowerCase()?.includes(searchValue?.toLowerCase());
            const type = matchesParamName
                ? this.originalTypeDef
                : getSearchFilteredInput(this.originalTypeDef,  this.value?.paramName?.value);
            return type;
        }
    }

    async initLinks() {
        // Currently we create links from "IN" ports and back tracing the inputs.
    }

    setPosition(point: Point): void;
    setPosition(x: number, y: number): void;
    setPosition(x: unknown, y?: unknown): void {
        if (typeof x === 'number' && typeof y === 'number'){
            if (!this.x){
                this.x = x;
            }
            super.setPosition(this.x, y);
        }
    }
}
