/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import { DiagramEngine } from '@projectstorm/react-diagrams';
import { ProgressRing } from '@wso2-enterprise/ui-toolkit';
import classnames from "classnames";

import { LinkConnectorNode } from './LinkConnectorNode';
import { useIntermediateNodeStyles } from '../../../styles';
import { DiagnosticWidget } from '../../Diagnostic/DiagnosticWidget';
import { renderDeleteButton, renderEditButton, renderPortWidget } from './LinkConnectorWidgetComponents';
import { useDMExpressionBarStore } from "../../../../store/store";
import { InputOutputPortModel } from "../../Port";

export interface LinkConnectorNodeWidgetProps {
    node: LinkConnectorNode;
    engine: DiagramEngine;
}

export function LinkConnectorNodeWidget(props: LinkConnectorNodeWidgetProps) {
    const { node, engine } = props;

    const classes = useIntermediateNodeStyles();
    const setExprBarFocusedPort = useDMExpressionBarStore(state => state.setFocusedPort);

    const diagnostic = node.hasError() ? node.diagnostics[0] : null;
    const value = node.value;

    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const onClickEdit = () => {
        const targetPort = node.targetMappedPort;
        setExprBarFocusedPort(targetPort as InputOutputPortModel);
    };

    const onClickDelete = async () => {
        setDeleteInProgress(true);
        if (node.deleteLink) {
            await node.deleteLink();
        }
        setDeleteInProgress(false);
    };

    const loadingScreen = (
        <div className={classnames(classes.element, classes.loadingContainer)}>
            <ProgressRing sx={{ height: '16px', width: '16px' }} />
        </div>
    );

    return (!node.hidden && (
            <div className={classes.root} data-testid={`link-connector-node-${node?.value}`}>
                <div className={classes.header}>
                    {renderPortWidget(engine, node.inPort, `${node?.value}-input`)}
                    {renderEditButton(onClickEdit, node?.value)}
                    {deleteInProgress ? (
                        loadingScreen
                    ) : (
                        <>{renderDeleteButton(onClickDelete, node?.value)}</>
                    )}
                    {diagnostic && (
                        <DiagnosticWidget
                            diagnostic={diagnostic}
                            value={value}
                            onClick={onClickEdit}
                            btnSx={{ margin: "0 2px" }}
                        />
                    )}
                    {renderPortWidget(engine, node.outPort, `${node?.value}-output`)}
                </div>
            </div>
        )
    );
}
