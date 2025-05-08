/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createRoot } from "react-dom/client";
import { Webview } from "./Visualizer";
import { VisualizerContextProvider } from "./Context";

export function renderWebview(target: HTMLElement, mode: string) {
    const root = createRoot(target);
    root.render(
        <VisualizerContextProvider>
            <Webview />
        </VisualizerContextProvider>
    );
}
