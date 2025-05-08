/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    ExpressionRange,
    LinePosition,
    TypeField
} from "@wso2-enterprise/ballerina-core";
import {
    FunctionDefinition,
    NodePosition,
    traversNode
} from "@wso2-enterprise/syntax-tree";

import { IDataMapperContext } from "../../../utils/DataMapperContext/DataMapperContext";
import { isPositionsEquals } from "../../../utils/st-utils";
import { FnDefPositions, TypeFindingVisitor } from "../visitors/TypeFindingVisitor";
import { LangClientRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { URI } from "vscode-uri";

export enum TypeStoreStatus {
    Init,
    Loading,
    Loaded
}

export class TypeDescriptorStore {

    typeDescriptors: Map<NodePosition, TypeField>;
    stNode: FunctionDefinition;
    status: TypeStoreStatus;
    static instance : TypeDescriptorStore;

    private constructor() {
        this.typeDescriptors = new Map();
    }

    public static getInstance() {
        if (!this.instance){
            this.instance = new TypeDescriptorStore();
        }
        return this.instance;
    }

    public async storeTypeDescriptors(
        stNode: FunctionDefinition,
        context: IDataMapperContext,
        isArraysSupported: boolean,
        langServerRpcClient: LangClientRpcClient) {

        if (this.stNode
                && isPositionsEquals(this.stNode.position, stNode.position)
                && this.stNode.source === stNode.source) {
            return;
        }
        this.status = TypeStoreStatus.Loading;
        this.stNode = stNode;
        this.typeDescriptors.clear();
        const visitor = new TypeFindingVisitor(isArraysSupported);
        traversNode(stNode, visitor);

        const fnDefPositions = visitor.getFnDefPositions();
        const expressionNodesRanges = visitor.getExpressionNodesRanges();
        const symbolNodesPositions = visitor.getSymbolNodesPositions();

        const noOfTypes = this.getNoOfTypes(visitor.getNoOfParams(), expressionNodesRanges.length, symbolNodesPositions.length);
        const fileUri = URI.file(context.currentFile.path).toString();

        const promises = [
            await this.setTypesForFnParamsAndReturnType(fileUri, fnDefPositions, langServerRpcClient),
            await this.setTypesForSymbol(fileUri, symbolNodesPositions, langServerRpcClient),
            await this.setTypesForExpressions(fileUri, expressionNodesRanges, langServerRpcClient)
        ];

        await Promise.allSettled(promises);
        if (this.typeDescriptors.size === noOfTypes) {
            this.status = TypeStoreStatus.Loaded;
        }
    }

    async setTypesForExpressions(
        fileUri: string,
        expressionNodesRanges: ExpressionRange[],
        langServerRpcClient: LangClientRpcClient) {

        const typesFromExpression = await langServerRpcClient.getTypeFromExpression({
            documentIdentifier: {
                uri: fileUri
            },
            expressionRanges: expressionNodesRanges
        });

        for (const {type, requestedRange} of typesFromExpression.types) {
            this.setTypeDescriptors(type, requestedRange.startLine, requestedRange.endLine);
        }
    }

    async setTypesForSymbol(
        fileUri: string,
        symbolNodesPositions: LinePosition[],
        langServerRpcClient: LangClientRpcClient) {

        const typesFromSymbol = await langServerRpcClient.getTypeFromSymbol({
            documentIdentifier: {
                uri: fileUri
            },
            positions: symbolNodesPositions
        });

        for (const {type, requestedPosition} of typesFromSymbol.types) {
            this.setTypeDescriptors(type, requestedPosition);
        }
    }

    async setTypesForFnParamsAndReturnType(
        fileUri: string,
        fnDefPositions: FnDefPositions,
        langServerRpcClient: LangClientRpcClient) {

        if (fnDefPositions.fnNamePosition === undefined || fnDefPositions.returnTypeDescPosition === undefined) {
            return;
        }

        const FnParamsAndReturnType = await langServerRpcClient.getTypesFromFnDefinition({
            documentIdentifier: {
                uri: fileUri
            },
            fnPosition: fnDefPositions.fnNamePosition,
            returnTypeDescPosition: fnDefPositions.returnTypeDescPosition
        });

        for (const {type, requestedPosition} of FnParamsAndReturnType.types) {
            this.setTypeDescriptors(type, requestedPosition);
        }
    }

    setTypeDescriptors(type: TypeField, startPosition: LinePosition, endPosition?: LinePosition) {
        if (startPosition) {
            const position: NodePosition = {
                startLine: startPosition.line,
                startColumn: startPosition.offset,
                endLine: endPosition ? endPosition.line : startPosition.line,
                endColumn: endPosition ? endPosition.offset : startPosition.offset,
            };

            // Check if a matching position already exists in the map
            const existingPosition = Array.from(this.typeDescriptors.keys()).find(
                pos => isPositionsEquals(pos, position)
            );

            if (existingPosition) {
                this.typeDescriptors.set(existingPosition, type);
            } else {
                this.typeDescriptors.set(position, type);
            }
        }
    }

    getNoOfTypes(noOfParams: number, noOfExpressions: number, noOfSymbols: number) {
        const hasReturnType = this.stNode.functionSignature?.returnTypeDesc
            && this.stNode.functionSignature.returnTypeDesc.type;
        return noOfParams + noOfExpressions + noOfSymbols + (hasReturnType ? 1 : 0);
    }

    public getTypeDescriptor(position : NodePosition) : TypeField {
        for (const [key, value] of this.typeDescriptors) {
            if (isPositionsEquals(key, position)) {
                return value;
            }
        }
    }

    public getStatus() {
        return this.status;
    }

    public getSTNode() {
        return this.stNode;
    }

    public resetStatus() {
        this.status = TypeStoreStatus.Init;
    }
}
