/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext, useReducer } from "react";

import { EnumDeclaration, NodePosition, TypeDefinition } from "@wso2-enterprise/syntax-tree";

import { EnumModel, SimpleField } from "../Diagram/components/FormComponents/ConfigForms/EnumConfigForm/types";

export enum FormState {
    EDIT_RECORD_FORM = 1,
    ADD_FIELD = 2,
    UPDATE_FIELD = 3,
}

export interface EnumEditorState {
    enumModel?: EnumModel;
    currentEnum?: EnumModel;
    currentField?: SimpleField;
    currentForm?: FormState;
    targetPosition?: NodePosition;
    isEditorInvalid?: boolean;
    isEnumSelected?: boolean;
    sourceModel?: TypeDefinition | EnumDeclaration;
    onCancel?: () => void;
    onSave?: (typeDesc: string, recModel: EnumModel) => void;
}

export interface EnumEditorProps {
    state?: EnumEditorState;
    callBacks?: {
        onUpdateModel?: (mode: EnumModel) => void;
        onUpdateCurrentEnum?: (formState: EnumModel) => void;
        onUpdateCurrentField?: (field: SimpleField) => void;
        onChangeFormState?: (formState: FormState) => void;
        updateEditorValidity?: (isInvalid: boolean) => void;
        onUpdateEnumSelection?: (isSelected: boolean) => void;
        updateCurrentField?: (field: SimpleField) => void;
    };
}

const reducer = (state: EnumEditorState, action: any) => {
    switch (action.type) {
        case 'UPDATE_MODEL':
            return {
                ...state,
                enumModel: action.payload
            }
        case 'UPDATE_FORM_STATE':
            return {
                ...state,
                currentForm: action.payload
            }
        case 'UPDATE_CURRENT_RECORD':
            return {
                ...state,
                currentEnum: action.payload
            }
        case 'UPDATE_CURRENT_FIELD':
            return {
                ...state,
                currentField: action.payload
            }
        case 'UPDATE_RECORD_VALIDITY':
            return {
                ...state,
                isEditorInvalid: action.payload
            }
        case 'UPDATE_FIELD':
            state.currentField.name = action.payload.name;
            state.currentField.isArray = action.payload.isArray;
            state.currentField.isFieldOptional = action.payload.isFieldOptional;
            state.currentField.isFieldTypeOptional = action.payload.isFieldTypeOptional;
            state.currentField.isActive = action.payload.isActive;
            state.currentField.value = action.payload.value;
            state.currentField.type = action.payload.type;
            return {
                ...state
            }
        case 'RECORD_SELECTED':
            return {
                ...state,
                isEnumSelected: action.payload
            }
    }
};

const initialState: EnumEditorProps = {
    state: {
        enumModel: null,
        currentForm: FormState.ADD_FIELD
    }
};

export const Context = React.createContext<EnumEditorProps>(initialState);

export const Provider: React.FC<EnumEditorProps> = (props) => {
    const { children, state } = props;
    const [enumEditorState, dispatch] = useReducer(reducer, {
        currentForm: state.currentForm,
        enumModel: state.enumModel,
        currentEnum: state.currentEnum,
        currentField: state.currentField,
        sourceModel: state.sourceModel,
        targetPosition: state.targetPosition,
        isEditorInvalid: state.isEditorInvalid,
        onSave: state.onSave,
        onCancel: state.onCancel
    });

    const updateModel = (enumModel: EnumModel) => {
        dispatch({ type: 'UPDATE_MODEL', payload: enumModel });
    }

    const updateCurrentEnum = (enumModel: EnumModel) => {
        dispatch({ type: 'UPDATE_CURRENT_RECORD', payload: enumModel });
    }

    const updateCurrentField = (filed: SimpleField) => {
        dispatch({ type: 'UPDATE_CURRENT_FIELD', payload: filed});
    }

    const updateFormState = (formState: FormState) => {
        dispatch({ type: 'UPDATE_FORM_STATE', payload: formState });
    }

    const updateEnumEditorValidity = (isInvalid: boolean) => {
        dispatch({ type: 'UPDATE_RECORD_VALIDITY', payload: isInvalid });
    }

    const updateField = (field: SimpleField) => {
        dispatch({ type: 'UPDATE_FIELD', payload: field });
    }

    const updateEnumSelection = (isSelected: boolean) => {
        dispatch({ type: 'RECORD_SELECTED', payload: isSelected });
    }

    const callBacks = {
        onUpdateModel: updateModel,
        onUpdateCurrentEnum: updateCurrentEnum,
        onUpdateCurrentField: updateCurrentField,
        onChangeFormState: updateFormState,
        updateEditorValidity: updateEnumEditorValidity,
        updateCurrentField: updateField,
        onUpdateEnumSelection: updateEnumSelection
    };

    return (
        <Context.Provider value={{ state: enumEditorState, callBacks }}>
            {children}
        </Context.Provider>
    );
}

export const useEnumEditorContext = () => useContext(Context);
