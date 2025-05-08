/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Flow } from "../utils/types";
import { SqParticipantType } from "@wso2-enterprise/ballerina-core";
import { SqParticipant } from "@wso2-enterprise/ballerina-core";

export interface DiagramContextState {
    flow: Flow;
    onClickParticipant: (participant: SqParticipant) => void;
    onAddParticipant: (kind: SqParticipantType) => void;
}

export const DiagramContext = React.createContext<DiagramContextState>({
    flow: {
        participants: [],
        location: {
            fileName: "",
            startLine: { line: 0, offset: 0 },
            endLine: { line: 0, offset: 0 },
        },
    },
    onClickParticipant: () => {},
    onAddParticipant: () => {},
});

export const useDiagramContext = () => React.useContext(DiagramContext);

export function DiagramContextProvider(props: { children: React.ReactNode; value: DiagramContextState }) {
    // enrich context with optional states
    const ctx = {
        ...props.value,
    };

    return <DiagramContext.Provider value={ctx}>{props.children}</DiagramContext.Provider>;
}
