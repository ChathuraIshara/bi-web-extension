/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createElement } from "react";
import { render } from "react-dom";

import { Diagram, EditorProps, WorkspaceOverview } from "./Diagram";

export function renderDiagramEditor(options: { target: HTMLElement, editorProps: EditorProps }) {
    const DiagramElement = createElement(Diagram, options.editorProps);
    return render(DiagramElement, options.target);
}

export function renderOverviewDiagram(options: {
    target: HTMLElement,
    editorProps: EditorProps
}) {
    const DiagramElement = createElement(WorkspaceOverview, options.editorProps);
    return render(DiagramElement, options.target);
}
