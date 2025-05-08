/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Dispatch, useEffect, useReducer } from "react";

export interface DiagramFocusState {
    filePath: string;
    uid: string;
}

export enum DiagramFocusActionTypes {
    UPDATE_FILE_PATH,
    UPDATE_POSITION,
    UPDATE_STATE,
    RESET_STATE
};

type FocusAction =
    | { type: DiagramFocusActionTypes.UPDATE_STATE, payload: DiagramFocusState }
    | { type: DiagramFocusActionTypes.UPDATE_FILE_PATH, payload: string }
    | { type: DiagramFocusActionTypes.RESET_STATE };

function diagramFocusReducer(state: DiagramFocusState, action: FocusAction): DiagramFocusState {
    switch (action.type) {
        case DiagramFocusActionTypes.UPDATE_STATE:
            return action.payload;
        case DiagramFocusActionTypes.UPDATE_FILE_PATH:
            return {
                ...state,
                filePath: action.payload
            };
        case DiagramFocusActionTypes.RESET_STATE:
            return undefined;
        default:
        // ignored
    }
}


export function useDiagramFocus(): [DiagramFocusState, Dispatch<FocusAction>] {
    const [state, dispatch] = useReducer(diagramFocusReducer, undefined);

    return [state, dispatch];
}

