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
import {
    CaptureBindingPattern,
    LetClause,
    LetVarDecl,
    NodePosition,
    RecordTypeDesc,
    SimpleNameReference,
    STKindChecker
} from "@wso2-enterprise/syntax-tree";

import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { EXPANDED_QUERY_SOURCE_PORT_PREFIX } from "../../utils/constants";
import {
    getLetClauseVarNames,
    getFromClauseNodeLabel,
    getSearchFilteredInput,
    getTypeFromStore
} from "../../utils/dm-utils";
import { DataMapperNodeModel } from "../commons/DataMapperNode";

export const QUERY_EXPR_LET_NODE_TYPE = "datamapper-node-record-type-desc-let";
const NODE_ID = "query-expr-let-node";

export class LetClauseNode extends DataMapperNodeModel {

    public sourceTypeDesc: RecordTypeDesc;
    public typeDef: TypeField;
    public sourceBindingPattern: CaptureBindingPattern;
    public nodeLabel: string;
    public x: number;
    public numberOfFields:  number;
    public hasNoMatchingFields: boolean;
    originalTypeDef: TypeField;
    letVarDecl: LetVarDecl;

    constructor(
        public context: IDataMapperContext,
        public value: LetClause
    ) {
        super(
            `${NODE_ID}-${getLetClauseVarNames(value).join('.')}`,
            context,
            QUERY_EXPR_LET_NODE_TYPE
        );
        this.numberOfFields = 1;
        this.letVarDecl = value.letVarDeclarations[0] as LetVarDecl;
        const expr = this.letVarDecl?.expression;
        const bindingPattern = (this.value.letVarDeclarations[0] as LetVarDecl)?.typedBindingPattern.bindingPattern;
        if (STKindChecker.isCaptureBindingPattern(bindingPattern)) {
            this.sourceBindingPattern = bindingPattern;
            this.originalTypeDef = getTypeFromStore(expr.position as NodePosition);
            this.typeDef = this.originalTypeDef;
        }
        this.nodeLabel = getFromClauseNodeLabel(bindingPattern, expr);
    }

    initPorts(): void {
        this.typeDef = this.getSearchFilteredType();
        this.hasNoMatchingFields = !this.typeDef;
        if (this.sourceBindingPattern) {
            const name = this.sourceBindingPattern.variableName.value;
            if (this.typeDef){
                const parentPort = this.addPortsForHeaderField(this.typeDef, name, "OUT", EXPANDED_QUERY_SOURCE_PORT_PREFIX, this.context.collapsedFields);

                if (this.typeDef && (this.typeDef.typeName === PrimitiveBalType.Record)) {
                    const fields = this.typeDef.fields;
                    fields.forEach((subField) => {
                        this.numberOfFields += this.addPortsForInputRecordField(
                            subField, "OUT", this.sourceBindingPattern.variableName.value,
                            this.sourceBindingPattern.variableName.value, EXPANDED_QUERY_SOURCE_PORT_PREFIX,
                            parentPort, this.context.collapsedFields, parentPort.collapsed
                        );
                    });
                } else {
                    this.addPortsForInputRecordField(
                        this.typeDef, "OUT", this.sourceBindingPattern.variableName.value,
                        this.sourceBindingPattern.variableName.value, EXPANDED_QUERY_SOURCE_PORT_PREFIX,
                        parentPort, this.context.collapsedFields, parentPort.collapsed
                    );
                }
            }
        }
    }

    async initLinks() {
        // Currently, we create links from "IN" ports and back tracing the inputs.
    }

    public getSearchFilteredType() {
        if (this.originalTypeDef){
            const name = this.sourceBindingPattern.variableName.value;
            const isRecordOrArray = this.originalTypeDef.typeName === PrimitiveBalType.Record || this.originalTypeDef.typeName === PrimitiveBalType.Array;
            return getSearchFilteredInput(isRecordOrArray ? this.originalTypeDef : {...this.originalTypeDef, name: (this.letVarDecl?.expression as SimpleNameReference)?.name?.value}, name)
        }
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
