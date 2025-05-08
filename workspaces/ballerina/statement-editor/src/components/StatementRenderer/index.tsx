/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from "react";

import { StatementNodes } from "../../constants";
import { StatementEditorContext } from "../../store/statement-editor-context";
import { getExpressionTypeComponent, getStatementTypeComponent } from "../../utils";

export interface StatementRendererProps {
    model: StatementNodes;
}

export function StatementRenderer(props: StatementRendererProps) {
    const { model } = props;
    const { isExpressionMode } = useContext(StatementEditorContext);
    const component = isExpressionMode ? getExpressionTypeComponent(model) : getStatementTypeComponent(model);

    return (
        <span>
            {component}
        </span>
    );
}
