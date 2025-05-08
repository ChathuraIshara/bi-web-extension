/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { FunctionDefinition, NodePosition } from "@wso2-enterprise/syntax-tree";
import { Diagnostic } from "vscode-languageserver-types";

import { ExpressionInfo, SelectionState, ViewOption } from "../../components/DataMapper/DataMapper";
import { LangClientRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { ComponentInfo, HistoryEntry, STModification } from "@wso2-enterprise/ballerina-core";

export interface ModuleComponents {
    moduleVarDecls: ComponentInfo[];
    constDecls: ComponentInfo[];
    enumDecls: {
        filePath: string;
        enum: ComponentInfo;
    }[];
    functions: ComponentInfo[];
};

export interface IDataMapperContext {
    functionST: FunctionDefinition;
    selection: SelectionState;
    langServerRpcClient: LangClientRpcClient;
    filePath: string;
    currentFile?: {
        content: string,
        path: string,
        size: number
    };
    moduleComponents: ModuleComponents;
    changeSelection: (mode: ViewOption, selection?: SelectionState) => void;
    goToSource: (position: NodePosition) => void;
    diagnostics: Diagnostic[];
    enableStatementEditor: (expressionInfo: ExpressionInfo) => void;
    collapsedFields: string[];
    handleCollapse: (fieldName: string, expand?: boolean) => void;
    isStmtEditorCanceled: boolean;
    handleOverlay: (showOverlay: boolean) => void;
    ballerinaVersion: string;
    handleLocalVarConfigPanel: (showPanel: boolean) => void;
    applyModifications: (modifications: STModification[]) => Promise<void>;
    updateActiveFile?: (currentFile: any) => void;
    updateSelectedComponent?: (info: HistoryEntry) => void;
    referenceManager?: {
        currentReferences: string[],
        handleCurrentReferences: (referencedFields: string[]) => void
    }
}

export class DataMapperContext implements IDataMapperContext {

    constructor(
        public filePath: string,
        private _functionST: FunctionDefinition,
        private _selection: SelectionState,
        public langServerRpcClient: LangClientRpcClient,
        public currentFile: {
            content: string,
            path: string,
            size: number
        },
        public moduleComponents: ModuleComponents,
        public changeSelection: (mode: ViewOption, selection?: SelectionState) => void,
        public goToSource: (position: NodePosition) => void,
        public diagnostics: Diagnostic[],
        public enableStatementEditor: (expressionInfo: ExpressionInfo) => void,
        public collapsedFields: string[],
        public handleCollapse: (fieldName: string, expand?: boolean) => void,
        public isStmtEditorCanceled: boolean,
        public handleOverlay: (showOverlay: boolean) => void,
        public ballerinaVersion: string,
        public handleLocalVarConfigPanel: (showPanel: boolean) => void,
        public applyModifications: (modifications: STModification[]) => Promise<void>,
        public updateActiveFile?: (currentFile: any) => void,
        public updateSelectedComponent?: (info: HistoryEntry) => void,
        public referenceManager?: {
            currentReferences: string[],
            handleCurrentReferences: (referencedFields: string[]) => void;
        }
    ){}

    public get functionST(): FunctionDefinition {
        return this._functionST;
    }

    public set functionST(st: FunctionDefinition) {
        if (!st && st.kind !== 'FunctionDefinition') {
            throw new Error("Invalid value set as FunctionST.");
        }
        this._functionST = st;
    }

    public get selection(): SelectionState {
        return this._selection;
    }

    public set selection(selection: SelectionState) {
        this._selection = selection;
    }
}
