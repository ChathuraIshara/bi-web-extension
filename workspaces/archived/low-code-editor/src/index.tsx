/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { Provider as DiagramProvider } from "./Contexts/Diagram";
import DiagramContainer from "./Diagram/Container";
import { TriggerType } from "./Diagram/models";
import { LowCodeEditorProps as Props } from "./types";

export { renderStandaloneMockedEditor } from "./stories/story-utils";

export { LowCodeEditorProps } from "./types";
export {
    BallerinaConnectorRequest,
    BallerinaConnectorResponse,
    BallerinaConnectorsResponse,
    BallerinaRecordRequest,
    BallerinaRecordResponse,
    BallerinaSTModifyRequest,
    BallerinaSTModifyResponse,
    GetSyntaxTreeParams,
    GetSyntaxTreeResponse,
    TriggerModifyRequest,
    BallerinaProjectParams,
    CompletionParams,
    CompletionResponse,
    DidChangeParams,
    DidCloseParams,
    DidOpenParams,
    PublishDiagnosticsParams,
    BaseLangClientInterface,
    DiagramEditorLangClientInterface,
    ExpressionEditorLangClientInterface,
    ExpressionTypeRequest,
    ExpressionTypeResponse,
    ExpressionEditorState,
    DiagramSize,
    DiagramState,
    ConfigPanelStatus,
    STSymbolInfo,
    ConfigOverlayFormStatus as ConfigOverlayFormStatusDef,
    InsertorDelete
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
export { AnalyzerRequestPayload } from "./Diagram/visitors/AnalyzerPayload";
export { Diagram } from "./Diagram";
export {
    getDiagnosticsFromVisitor,
    getWarningsFromST,
    getLowCodeSTFn,
    getLowCodeSTFnSelected,
    sizingAndPositioningST,
    recalculateSizingAndPositioningST,
    getAnalyzerRequestPayload
} from './Diagram/utils/st-util';
export { AnalyzePayloadVisitor } from "./Diagram/visitors/analyze-payload-visitor";
export { cleanLocalSymbols, cleanModuleLevelSymbols, getSymbolInfo, visitor as SymbolVisitor } from "./Diagram/visitors/symbol-finder-visitor";
export { getTriggerSource, getSampleSource } from "./Diagram/utils/template-utils";
export { createPropertyStatement } from "./Diagram/utils/modification-util";
export * from "./DiagramGenerator/vscode";
export { updatePerfPath } from "./DiagramGenerator/performanceUtil";

const LowCodeEditor: React.FC<Props> = (props: Props) => {
    // TODO: Remove these as these are no longer in use
    const modifyTrigger = (
        triggerType: TriggerType,
        model?: any,
        configObject?: any
    ) => {
        props.api.code.onMutate("TRIGGER", { triggerType, model, configObject });
    };

    // TODO: Remove these as these are no longer in use
    const modifyDiagram = (mutations: STModification[], options: any = {}) => {
        props.api.code.onMutate("DIAGRAM", { mutations, ...options });
    };

    const newProps = {
        modifyDiagram,
        modifyTrigger,
        ...props
    }

    return (
            <DiagramProvider {...newProps} >
                <div className="diagram-container">
                    <DiagramContainer />
                </div>
            </DiagramProvider>
    );
}

export default LowCodeEditor;
