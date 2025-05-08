/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Point } from "@projectstorm/geometry";
import { IOType, Mapping, TypeKind } from "@wso2-enterprise/ballerina-core";

import { useDMCollapsedFieldsStore, useDMSearchStore } from "../../../../store/store";
import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { DataMapperNodeModel } from "../commons/DataMapperNode";
import { getFilteredMappings, getSearchFilteredOutput, hasNoOutputMatchFound } from "../../utils/search-utils";
import { getTypeName } from "../../utils/type-utils";
import { OBJECT_OUTPUT_TARGET_PORT_PREFIX } from "../../utils/constants";
import { STNode } from "@wso2-enterprise/syntax-tree";
import { findInputNode } from "../../utils/node-utils";
import { InputOutputPortModel } from "../../Port";
import { DataMapperLinkModel } from "../../Link";
import { ExpressionLabelModel } from "../../Label";
import { getInputPort, getOutputPort } from "../../utils/port-utils";
import { removeMapping } from "../../utils/modification-utils";

export const OBJECT_OUTPUT_NODE_TYPE = "data-mapper-node-object-output";
const NODE_ID = "object-output-node";

export class ObjectOutputNode extends DataMapperNodeModel {
    public filteredOutputType: IOType;
    public filterdMappings: Mapping[];
    public typeName: string;
    public rootName: string;
    public hasNoMatchingFields: boolean;
    public x: number;
    public y: number;
    public isMapFn: boolean;

    constructor(
        public context: IDataMapperContext,
        public outputType: IOType
    ) {
        super(
            NODE_ID,
            context,
            OBJECT_OUTPUT_NODE_TYPE
        ); 
    }

    async initPorts() {
        this.filteredOutputType = getSearchFilteredOutput(this.outputType);

        if (this.filteredOutputType) {
            this.rootName = this.filteredOutputType?.id;

            const collapsedFields = useDMCollapsedFieldsStore.getState().fields;
            this.typeName = getTypeName(this.filteredOutputType);

            this.hasNoMatchingFields = hasNoOutputMatchFound(this.outputType, this.filteredOutputType);
    
            const parentPort = this.addPortsForHeader(
                this.filteredOutputType, this.rootName, "IN", OBJECT_OUTPUT_TARGET_PORT_PREFIX,
                this.context.model.mappings, this.isMapFn
            );
    
            if (this.filteredOutputType.kind === TypeKind.Record) {
                if (this.filteredOutputType.fields.length) {
                    this.filteredOutputType.fields.forEach(field => {
                        if (!field) return;
                        this.addPortsForOutputField(
                            field, "IN", this.rootName, this.context.model.mappings, OBJECT_OUTPUT_TARGET_PORT_PREFIX,
                            parentPort, collapsedFields, parentPort.collapsed
                        );
                    });
                }
            }
        }
    }

    initLinks(): void {
        const searchValue = useDMSearchStore.getState().outputSearch;
        this.filterdMappings = getFilteredMappings(this.context.model.mappings, searchValue);
        this.createLinks(this.filterdMappings);
    }

    private createLinks(mappings: Mapping[]) {
        mappings.forEach((mapping) => {    
            const { isComplex, inputs, output, expression, diagnostics } = mapping;
            if (isComplex || inputs.length !== 1) {
                // Complex mappings are handled in the LinkConnectorNode
                return;
            }

            const inputNode = findInputNode(inputs[0], this);
            let inPort: InputOutputPortModel;
            if (inputNode) {
                inPort = getInputPort(inputNode, inputs[0].replace(/\.\d+/g, ''));
            }

            const [_, mappedOutPort] = getOutputPort(this, output);

            if (inPort && mappedOutPort) {
                const lm = new DataMapperLinkModel(expression, diagnostics, true, undefined);
                lm.setTargetPort(mappedOutPort);
                lm.setSourcePort(inPort);
                inPort.addLinkedPort(mappedOutPort);

                lm.addLabel(
                    new ExpressionLabelModel({
                        value: expression,
                        link: lm,
                        deleteLink: () => this.deleteField(output),
                    }
                ));

                lm.registerListener({
                    selectionChanged(event) {
                        if (event.isSelected) {
                            inPort.fireEvent({}, "link-selected");
                            mappedOutPort.fireEvent({}, "link-selected");
                        } else {
                            inPort.fireEvent({}, "link-unselected");
                            mappedOutPort.fireEvent({}, "link-unselected");
                        }
                    },
                });

                this.getModel().addAll(lm as any);
            }
        });
    }

    async deleteField(field: string) {
        await removeMapping(field, this.context);
    }

    public updatePosition() {
        this.setPosition(this.position.x, this.position.y);
    }

    setPosition(point: Point): void;
    setPosition(x: number, y: number): void;
    setPosition(x: unknown, y?: unknown): void {
        if (typeof x === 'number' && typeof y === 'number') {
            if (!this.x || !this.y) {
                this.x = x;
                this.y = y;
            }
            super.setPosition(x, y);
        }
    }
}
