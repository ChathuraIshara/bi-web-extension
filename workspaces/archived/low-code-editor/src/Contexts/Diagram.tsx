/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext, useReducer } from "react";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { recalculateSizingAndPositioning, sizingAndPositioning } from "../Diagram/utils/diagram-util";
import { LowCodeEditorContext, LowCodeEditorProps, LowCodeEditorState } from "../types";

const reducer = (state: LowCodeEditorState, action: any) => {
    switch (action.type) {
        case 'UPDATE_STATE':
            return { ...state, ...action.payload, targetPosition: state.targetPosition };
        case 'DIAGRAM_CLEAN_DRAW':
            return {
                ...state,
                syntaxTree: sizingAndPositioning(action.payload, state.experimentalEnabled),
            }
        case 'DIAGRAM_REDRAW':
            return {
                ...state,
                syntaxTree: recalculateSizingAndPositioning(action.payload, state.experimentalEnabled)
            }
        case 'INSERT_COMPONENT_START':
            return {
                ...state,
                targetPosition: action.payload
            }
        case 'EDITOR_COMPONENT_START':
            return {
                ...state,
                targetPosition: action.payload
            }
        case 'TOGGLE_DIAGRAM_OVERLAY':
            return {
                ...state,
                isConfigOverlayFormOpen: !state.isConfigOverlayFormOpen,
                dataMapperConfig: undefined
            }
        case 'UPDATE_DATAMAPPER_CONFIG':
            return {
                ...state,
                dataMapperConfig: action.payload
            }
        case 'UPDATE_CURRENT_FUNCTION_NODE':
            return {
                ...state,
                currentFunctionNode: action.payload
            }
        default:
            return state;
    }
};

const updateCurrentFunctionNode = (dispatch: any) => {
    return (payload: any) => {
        dispatch({ type: 'UPDATE_CURRENT_FUNCTION_NODE', payload });
    };
}

const updateState = (dispatch: any) => {
    return (payload: any) => {
        dispatch({ type: 'UPDATE_STATE', payload });
    };
}

const diagramCleanDraw = (dispatch: any) => {
    return (payload: STNode) => {
        dispatch({ type: 'DIAGRAM_CLEAN_DRAW', payload });
    }
}

const diagramRedraw = (dispatch: any) => {
    return (payload: STNode) => {
        dispatch({ type: 'DIAGRAM_REDRAW', payload })
    }
}

const insertComponentStart = (dispatch: any) => {
    return (payload: NodePosition) => {
        dispatch({ type: 'INSERT_COMPONENT_START', payload })
    }
}

const editorComponentStart = (dispatch: any) => {
    return (payload: NodePosition) => {
        dispatch({ type: 'EDITOR_COMPONENT_START', payload })
    }
}

const toggleDiagramOverlay = (dispatch: any) => {
    return () => {
        dispatch({ type: 'TOGGLE_DIAGRAM_OVERLAY' })
    }
}

const setTriggerUpdated = (dispatch: any) => {
    return (isUpdated: boolean) => {
        dispatch({ type: 'SET_TRIGGER_UPDATED', payload: isUpdated })
    }
}

const defaultState: any = {};

export const Context = React.createContext<LowCodeEditorContext>(defaultState); // FIXME: Add proper deafault state

export const Provider: React.FC<LowCodeEditorProps> = (props) => {
    const { children, api, ...restProps } = props;
    const [state, dispatch] = useReducer(reducer, { experimentalEnabled: props.experimentalEnabled });

    const actions = {
        updateState: updateState(dispatch),
        diagramCleanDraw: diagramCleanDraw(dispatch),
        diagramRedraw: diagramRedraw(dispatch),
        insertComponentStart: insertComponentStart(dispatch),
        editorComponentStart: editorComponentStart(dispatch),
        toggleDiagramOverlay: toggleDiagramOverlay(dispatch),
        updateCurrentFunctionNode: updateCurrentFunctionNode(dispatch),
        setTriggerUpdated: setTriggerUpdated(dispatch)
    };

    return (
        <Context.Provider value={{ state, actions, api, props: restProps }}>
            {children}
        </Context.Provider>
    );
}

export const useDiagramContext = () => useContext(Context)
