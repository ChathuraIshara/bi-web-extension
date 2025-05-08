/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import { BallerinaConnectorInfo, ConnectorWizardType } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { ConnectorWizard } from "../ConnectorWizard";

interface AddModuleFromProps {
    model?: STNode;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    formType: string;
}

export function AddModuleFrom(props: AddModuleFromProps) {
    const { model, targetPosition, onCancel, onSave } = props;
    const [connector, setConnector] = useState<BallerinaConnectorInfo>();

    return (
        <>
            <ConnectorWizard
                wizardType={ConnectorWizardType.ENDPOINT}
                diagramPosition={{ x: 0, y: 0 }}
                targetPosition={
                    model
                        ? targetPosition
                        : { startLine: targetPosition.startLine, startColumn: targetPosition.startColumn }
                }
                connectorInfo={connector}
                model={model}
                onClose={onCancel}
                onSave={onSave}
                isModuleType={true}
            />
        </>
    );
}
