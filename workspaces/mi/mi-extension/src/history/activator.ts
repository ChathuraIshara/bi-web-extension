/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { History } from "@wso2-enterprise/mi-core";
import { navigate, StateMachine } from "../stateMachine";

export let history: History;

export function activate() {
    history = new History();
}

export function removeFromHistory(fileUri: string, identifier?: string) {
    const historyStack = history.get();
    const newHistory = historyStack.filter((location) => {
        if (identifier !== undefined) {
            return !(location.location?.documentUri === fileUri && location.location?.identifier === identifier);
        }
        return location.location?.documentUri !== fileUri;
    });
    history.clear();
    newHistory.forEach((location) => {
        history.push(location);
    });

    const context = StateMachine.context();
    if (context.documentUri === fileUri && (identifier !== undefined ? context.identifier?.toString() === identifier.toString() : true)) {
        navigate();
    }
}
