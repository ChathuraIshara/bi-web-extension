/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { ConfigOverlayFormStatus } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormEditor } from "@wso2-enterprise/ballerina-statement-editor";
import {
    ClassDefinition,
    NodePosition,
    ObjectMethodDefinition,
    ResourceAccessorDefinition,
    STKindChecker,
    STNode
} from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";
import { DiagramOverlayPosition } from "../../../Portals/Overlay";

interface GraphqlConfigFormProps {
    position: DiagramOverlayPosition;
    model?: ResourceAccessorDefinition | ObjectMethodDefinition | ClassDefinition,
    targetPosition?: NodePosition,
    configOverlayFormStatus?: ConfigOverlayFormStatus;
    onCancel: () => void;
    onSave: () => void;
    filePath?: string;
    currentST?: STNode;
}

export function GraphqlConfigForm(props: GraphqlConfigFormProps) {
    const { targetPosition, model, configOverlayFormStatus, onCancel, filePath, currentST } = props;
    const functionType = configOverlayFormStatus.formName;

    const {
        api: {
            code: {
                modifyDiagram,
                renameSymbol
            },
            ls: { getExpressionEditorLangClient }
        },
        props: {
            currentFile,
            syntaxTree,
            fullST
        }
    } = useContext(Context);

    let position = targetPosition;

    if (model && !STKindChecker.isClassDefinition(model)) {
        position = {
            startLine: model.functionName.position.startLine,
            startColumn: model.functionName.position.startColumn,
            endLine: model.functionSignature.position.endLine,
            endColumn: model.functionSignature.position.endColumn,
        };
    }

    const getUpdatedCurrentFile = () => {
        return {
            content: currentST.source,
            path: filePath,
            size: 1
        };
    }

    return (
        <>
            <FormEditor
                initialSource={model ? model.source : undefined}
                initialModel={model}
                isLastMember={false}
                targetPosition={position}
                onCancel={onCancel}
                type={functionType}
                currentFile={!filePath ? currentFile : getUpdatedCurrentFile()}
                getLangClient={getExpressionEditorLangClient}
                applyModifications={modifyDiagram}
                topLevelComponent={true} // todo: Remove this
                syntaxTree={!filePath ? syntaxTree : model}
                fullST={!filePath ? fullST : currentST}
                renameSymbol={renameSymbol}
            />
        </>
    );
}
