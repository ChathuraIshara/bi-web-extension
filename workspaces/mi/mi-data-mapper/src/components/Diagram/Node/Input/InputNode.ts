/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Point } from "@projectstorm/geometry";
import { ParameterDeclaration } from "ts-morph";

import { useDMCollapsedFieldsStore, useDMSearchStore } from "../../../../store/store";
import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { DataMapperNodeModel } from "../commons/DataMapperNode";
import { DMType, TypeKind } from "@wso2-enterprise/mi-core";
import { getSearchFilteredInput } from "../../utils/search-utils";
import { getTypeAnnotation } from "../../utils/common-utils";

export const INPUT_NODE_TYPE = "datamapper-node-input";
const NODE_ID = "input-node";

export class InputNode extends DataMapperNodeModel {
    public dmType: DMType;
    public numberOfFields:  number;
    public x: number;
    private _paramName: string;
    private _originalType: DMType;

    constructor(
        public context: IDataMapperContext,
        public value: ParameterDeclaration,
        public hasNoMatchingFields?: boolean
    ) {
        super(
            NODE_ID,
            context,
            INPUT_NODE_TYPE
        );
        this.numberOfFields = 1;
        if (!hasNoMatchingFields) {
            this._originalType = this.context.inputTrees
                .find(inputTree => getTypeAnnotation(inputTree) === this.value.getTypeNode()?.getText());
            this.dmType = this._originalType;
            this._paramName = this.value.getName();
        }
    }

    async initPorts() {
        this.numberOfFields = 1;
        this.dmType = this.getSearchFilteredType();
        this.hasNoMatchingFields = !this.dmType;

        if (this.dmType) {
            const isCollapsedField = useDMCollapsedFieldsStore.getState().isCollapsedField;
            const parentPort = this.addPortsForHeader(this.dmType, this._paramName, "OUT", undefined, isCollapsedField);

            if (this.dmType.kind === TypeKind.Interface) {
                const fields = this.dmType.fields;
                fields.forEach((subField) => {
                    this.numberOfFields += this.addPortsForInputField(
                        subField, "OUT", this._paramName, this._paramName, '',
                        parentPort, isCollapsedField, parentPort.collapsed, subField.optional
                    );
                });
            } else if(this.dmType.kind === TypeKind.Array){
                this.dmType.fieldName = this._paramName;
                const arrItemField = { ...this.dmType.memberType, fieldName: `<${this.dmType.fieldName}Item>` };
                this.numberOfFields += this.addPortsForPreviewField(
                    arrItemField, "OUT", this._paramName, this._paramName, '',
                    parentPort, isCollapsedField, parentPort.collapsed, arrItemField.optional
                );
            }else {
                this.addPortsForInputField(
                    this.dmType, "OUT", this._paramName, this._paramName,  '',
                    parentPort, isCollapsedField, parentPort.collapsed, this.dmType.optional
                );
            }
        }
    }

    public getSearchFilteredType() {
        if (this.value) {
            const searchValue = useDMSearchStore.getState().inputSearch;

            const matchesParamName = this.value.getName().toLowerCase().includes(searchValue?.toLowerCase());
            const type = matchesParamName
                ? this._originalType
                : getSearchFilteredInput(this._originalType, this._paramName);
            return type;
        }
    }

    async initLinks() {
        // Links are always created from "IN" ports by backtracing the inputs.
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
