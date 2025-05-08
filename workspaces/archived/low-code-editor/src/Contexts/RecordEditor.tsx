/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext, useReducer } from "react";

import { NodePosition, RecordTypeDesc, TypeDefinition } from "@wso2-enterprise/syntax-tree";

import { RecordModel, SimpleField } from "../Diagram/components/FormComponents/ConfigForms/RecordEditor/types";

export enum FormState {
    EDIT_RECORD_FORM = 1,
    ADD_FIELD = 2,
    UPDATE_FIELD = 3,
    ADD_RECORD_JSON = 4
}

export interface RecordEditorState {
    recordModel?: RecordModel;
    currentRecord?: RecordModel;
    currentField?: SimpleField;
    currentForm?: FormState;
    targetPosition?: NodePosition;
    isEditorInvalid?: boolean;
    isRecordSelected?: boolean;
    sourceModel?: TypeDefinition | RecordTypeDesc;
    onCancel?: () => void;
    onSave?: (typeDesc: string, recModel: RecordModel) => void;
}

export interface RecordEditorProps {
    state?: RecordEditorState;
    callBacks?: {
        onUpdateModel?: (mode: RecordModel) => void;
        onUpdateCurrentRecord?: (formState: RecordModel) => void;
        onUpdateCurrentField?: (field: SimpleField) => void;
        onChangeFormState?: (formState: FormState) => void;
        updateEditorValidity?: (isInvalid: boolean) => void;
        onUpdateRecordSelection?: (isSelected: boolean) => void;
        updateCurrentField?: (field: SimpleField) => void;
    };
}

const reducer = (state: RecordEditorState, action: any) => {
    switch (action.type) {
        case 'UPDATE_MODEL':
            return {
                ...state,
                recordModel: action.payload
            }
        case 'UPDATE_FORM_STATE':
            return {
                ...state,
                currentForm: action.payload
            }
        case 'UPDATE_CURRENT_RECORD':
            return {
                ...state,
                currentRecord: action.payload
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
                isRecordSelected: action.payload
            }
    }
};

const initialState: RecordEditorProps = {
    state: {
        recordModel: null,
        currentForm: FormState.ADD_FIELD
    }
};

export const Context = React.createContext<RecordEditorProps>(initialState);

export const Provider: React.FC<RecordEditorProps> = (props) => {
    const { children, state } = props;
    const [recordEditorState, dispatch] = useReducer(reducer, {
        currentForm: state.currentForm,
        recordModel: state.recordModel,
        currentRecord: state.currentRecord,
        currentField: state.currentField,
        sourceModel: state.sourceModel,
        targetPosition: state.targetPosition,
        isEditorInvalid: state.isEditorInvalid,
        onSave: state.onSave,
        onCancel: state.onCancel
    });

    const updateModel = (recordModel: RecordModel) => {
        dispatch({ type: 'UPDATE_MODEL', payload: recordModel });
    }

    const updateCurrentRecord = (recordModel: RecordModel) => {
        dispatch({ type: 'UPDATE_CURRENT_RECORD', payload: recordModel });
    }

    const updateCurrentField = (filed: SimpleField) => {
        dispatch({ type: 'UPDATE_CURRENT_FIELD', payload: filed});
    }

    const updateFormState = (formState: FormState) => {
        dispatch({ type: 'UPDATE_FORM_STATE', payload: formState });
    }

    const updateRecordEditorValidity = (isInvalid: boolean) => {
        dispatch({ type: 'UPDATE_RECORD_VALIDITY', payload: isInvalid });
    }

    const updateField = (field: SimpleField) => {
        dispatch({ type: 'UPDATE_FIELD', payload: field });
    }

    const updateRecordSelection = (isSelected: boolean) => {
        dispatch({ type: 'RECORD_SELECTED', payload: isSelected });
    }

    const callBacks = {
        onUpdateModel: updateModel,
        onUpdateCurrentRecord: updateCurrentRecord,
        onUpdateCurrentField: updateCurrentField,
        onChangeFormState: updateFormState,
        updateEditorValidity: updateRecordEditorValidity,
        updateCurrentField: updateField,
        onUpdateRecordSelection: updateRecordSelection
    };

    return (
        <Context.Provider value={{ state: recordEditorState, callBacks }}>
            {children}
        </Context.Provider>
    );
}

export const useRecordEditorContext = () => useContext(Context);
