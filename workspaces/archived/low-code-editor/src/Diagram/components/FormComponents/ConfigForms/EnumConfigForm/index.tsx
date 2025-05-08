/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from 'react';

import { EnumDeclaration, NodePosition, STKindChecker, TypeDefinition } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";
import { FormState, Provider as EnumEditorProvider} from "../../../../../Contexts/EnumEditor"

import { Enumeration } from "./Enumeration";
import { EnumModel } from "./types";
import { getEnumModel } from "./utils";

export interface EnumEditorProps {
    name: string;
    existingModel?: EnumModel;
    model?: EnumDeclaration | TypeDefinition;
    targetPosition?: NodePosition;
    isTypeDefinition?: boolean;
    onCancel: () => void;
    onSave: (typeDesc: string, recModel: EnumModel) => void;
}

export function EnumConfigForm(props: EnumEditorProps) {
    const { existingModel, name, onCancel, onSave, model, targetPosition, isTypeDefinition = true } = props;
    let enumModel: EnumModel;
    if (model && STKindChecker.isEnumDeclaration(model)) {
        enumModel = getEnumModel(model, model.identifier.value, true, "enum");
        enumModel.isActive = true;
    } else if (existingModel) {
        enumModel = existingModel;
    } else if (targetPosition) {
        // Constructs a new model
        enumModel = {
            name,
            isClosed: false,
            isOptional: false,
            isArray: false,
            fields: [],
            type: "enum",
            isInline: true,
            isActive: true
        }
    }
    enumModel.isTypeDefinition = (isTypeDefinition || STKindChecker.isTypeDefinition(model));

    return (
        <EnumEditorProvider
            state={{
                enumModel,
                currentForm: FormState.EDIT_RECORD_FORM,
                currentEnum: enumModel,
                sourceModel: model,
                isEditorInvalid: false,
                targetPosition,
                onSave,
                onCancel
            }}
        >
            {enumModel && (
                <Enumeration/>
            )}
        </EnumEditorProvider>
    );
}
