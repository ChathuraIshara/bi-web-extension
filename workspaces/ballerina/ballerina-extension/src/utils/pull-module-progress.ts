/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { extension } from "../BalExtensionContext";
import { StateMachine } from "../stateMachine";

export function handlePullModuleProgress() {
    // Handle pull module progress notifications
    const progressDisposable = StateMachine.langClient().onNotification('$/progress', (params: any) => {
        if (params.token && params.token.startsWith('pull-module')) {
            extension.hasPullModuleNotification = true;
            if (params.value.kind === 'report') {
                extension.hasPullModuleResolved = true;
            }
        }
    });

    // Set up a listener to check for initialPrompt becoming empty
    const checkInterval = setInterval(() => {
        if (extension.hasPullModuleResolved) {
            // Clean up the notification listener
            progressDisposable.dispose();
            clearInterval(checkInterval);
        }
    }, 5000); // Check every 5 seconds

    // Add both disposables to context for clean extension shutdown
    extension.context.subscriptions.push(progressDisposable);
    extension.context.subscriptions.push({ dispose: () => clearInterval(checkInterval) });
}
