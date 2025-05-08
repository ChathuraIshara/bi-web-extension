/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { ReactNode } from "react";

import CloseIcon from '@material-ui/icons/Close';
import { PlusViewState } from "@wso2-enterprise/ballerina-low-code-diagram";
import { BallerinaConnectorInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { LocalVarDecl } from "@wso2-enterprise/syntax-tree";

import { OverlayBackground } from "../../../../OverlayBackground";
import { DiagramOverlay, DiagramOverlayContainer, DiagramOverlayPosition } from '../../../../Portals/Overlay';
import { FormGeneratorProps } from "../../../FormGenerator";
import { StatementOptions } from "../PlusElementOptions/StatementOptions";
import "../style.scss";

export interface PlusElementsProps {
    position?: DiagramOverlayPosition;
    isPlusActive?: boolean;
    onChange?: (type: string, subType: string, connector?: BallerinaConnectorInfo, isExisting?: boolean, selectedConnector?: LocalVarDecl) => void;
    onClose?: () => void;
    // onComponentClick?: (value: string) => void;
    initPlus: boolean,
    viewState: PlusViewState;
    isResource?: boolean;
    isCallerAvailable?: boolean;
    overlayId?: string,
    overlayNode?: HTMLDivElement
    // setAPIholderHeight?: (value: APIHeightStates) => void;
}

export enum APIHeightStates {
    SelectConnectors,
    ExistingConnectors,
    SelectConnectorsColapsed,
    ExistingConnectorsColapsed
}

export const PLUS_HOLDER_WIDTH = 376;
export const PLUS_HOLDER_STATEMENT_HEIGHT = 420;
export const PLUS_HOLDER_API_HEIGHT = 625;
export const EXISTING_PLUS_HOLDER_API_HEIGHT = 612;
export const EXISTING_PLUS_HOLDER_WIDTH = 498;
export const PLUS_HOLDER_API_HEIGHT_COLLAPSED = 321;
export const EXISTING_PLUS_HOLDER_API_HEIGHT_COLLAPSED = 660;

export function PlusElements(props: FormGeneratorProps) {

    const { onCancel } = props;
    const { onChange, viewState, isResource, isCallerAvailable, hasWorkerDecl } = props.configOverlayFormStatus.formArgs;

    const onStatementTypeSelect = (processType: string) => {
        switch (processType) {
            case "Connector":
                onChange("APIS", "New", null);
                break;
            case "Action":
                onChange("APIS", "Existing", null);
                break;
            default:
                onChange("STATEMENT", processType);
                break;
        }
    };

    const plusHolder: ReactNode = (
        <div className="holder-wrapper-large">
            <div className="element-options">
                <StatementOptions
                    onSelect={onStatementTypeSelect}
                    viewState={viewState}
                    isResource={isResource}
                    isCallerAvailable={isCallerAvailable}
                    hasWorkerDecl={hasWorkerDecl}
                />
            </div>
        </div>
    );

    return (
        <>
            <FormHeaderSection
                onCancel={onCancel}
                formTitle={"lowcode.develop.configForms.plusholder.title"}
                defaultMessage={"Add Constructs"}
            />
            {plusHolder}
        </>
    );
}
