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
    FromClause,
    ListBindingPattern,
    MappingBindingPattern,
    NodePosition,
    QueryExpression,
    RecordTypeDesc,
    STKindChecker,
    traversNode
} from "@wso2-enterprise/syntax-tree";

import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { EXPANDED_QUERY_SOURCE_PORT_PREFIX } from "../../utils/constants";
import {
    getFromClauseNodeLabel,
    getOptionalArrayField,
    getSearchFilteredInput,
    getTypeFromStore
} from "../../utils/dm-utils";
import { DataMapperNodeModel } from "../commons/DataMapperNode";
import { QueryExprMappingType } from "../QueryExpression";
import { NodeFindingVisitorByPosition } from "../../visitors/NodeFindingVisitorByPosition";
import { AggregationFunctions } from "../../Label";

export const QUERY_EXPR_SOURCE_NODE_TYPE = "datamapper-node-record-type-desc";
const NODE_ID = "from-clause-node";

export class FromClauseNode extends DataMapperNodeModel {

    public sourceTypeDesc: RecordTypeDesc;
    public typeDef: TypeField;
    public sourceBindingPattern: CaptureBindingPattern | MappingBindingPattern | ListBindingPattern;
    public nodeLabel: string;
    public x: number;
    public y: number;
    public numberOfFields:  number;
    public hasNoMatchingFields: boolean;
    public mappedWithCollectClause: boolean;
    originalTypeDef: TypeField;

    constructor(
        public context: IDataMapperContext,
        public value: FromClause) {
        super(
            NODE_ID,
            context,
            QUERY_EXPR_SOURCE_NODE_TYPE
        );
        this.numberOfFields = 1;

        // tslint:disable-next-line: prefer-conditional-expression
        const valExpr = this.value.expression;
        if (STKindChecker.isBinaryExpression(valExpr)
            && STKindChecker.isElvisToken(valExpr.operator)) {
            const exprType = getTypeFromStore(valExpr.lhsExpr.position as NodePosition);
            this.typeDef = exprType && getOptionalArrayField(exprType);
        } else {
            this.typeDef = getTypeFromStore(valExpr.position as NodePosition);
        }
        const bindingPattern = this.value.typedBindingPattern.bindingPattern;
        if (STKindChecker.isCaptureBindingPattern(bindingPattern)
            || STKindChecker.isMappingBindingPattern(bindingPattern)
            || STKindChecker.isListBindingPattern(bindingPattern)
        ) {
            this.sourceBindingPattern = bindingPattern;
        }
        
        this.nodeLabel = getFromClauseNodeLabel(bindingPattern, valExpr);
        this.originalTypeDef = this.typeDef;

        // Check if the selected query expression is connected via a collect clause with aggregation function
        // If so, disable all fields since it can't accept multiple inputs (due to collect clause only deal with sequencial variables)
        const selectedST = context?.selection.selectedST;
        if (selectedST) {
            const queryExprFindingVisitor = new NodeFindingVisitorByPosition(selectedST.position);
            traversNode(selectedST.stNode, queryExprFindingVisitor);
            const queryExpr = queryExprFindingVisitor.getNode() as QueryExpression;

            const connectedViaCollectClause = selectedST?.mappingType
                && selectedST.mappingType === QueryExprMappingType.A2SWithCollect;
            if (queryExpr && connectedViaCollectClause) {
                const resultClause = queryExpr?.resultClause || queryExpr?.selectClause;
                const fnName = resultClause.kind === "CollectClause" && resultClause.expression
                    && STKindChecker.isFunctionCall(resultClause.expression)
                    && STKindChecker.isSimpleNameReference(resultClause.expression.functionName)
                    && resultClause.expression.functionName.name.value;
                if (AggregationFunctions.includes(fnName)) {
                    this.mappedWithCollectClause = true;
                }
            }
        }
    }

    initPorts(): void {
        this.typeDef = this.getSearchFilteredType();
        this.hasNoMatchingFields = !this.typeDef;
        if (this.sourceBindingPattern) {
            if (this.typeDef){
                const parentPort = this.addPortsForHeaderField(this.typeDef, this.nodeLabel, "OUT",
                    EXPANDED_QUERY_SOURCE_PORT_PREFIX, this.context.collapsedFields);

                if (this.typeDef.typeName === PrimitiveBalType.Record) {
                    const fields = this.typeDef.fields;
                    fields.forEach((subField) => {
                        this.numberOfFields += this.addPortsForInputRecordField(
                            subField, "OUT", this.nodeLabel, this.nodeLabel,
                            EXPANDED_QUERY_SOURCE_PORT_PREFIX, parentPort, this.context.collapsedFields,
                            parentPort.collapsed
                        );
                    });
                }
            }
        }
    }

    async initLinks() {
        // Currently, we create links from "IN" ports and back tracing the inputs.
    }

    public getSearchFilteredType() {
        if (this.originalTypeDef
            && this.originalTypeDef?.memberType
            && this.originalTypeDef.typeName === PrimitiveBalType.Array
        ) {
            return getSearchFilteredInput(this.originalTypeDef.memberType, this.nodeLabel);
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
