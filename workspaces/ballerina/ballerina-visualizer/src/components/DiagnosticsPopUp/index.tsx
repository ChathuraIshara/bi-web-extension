/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";
import styled from "@emotion/styled";
import { Icon, Popover, ThemeColors } from "@wso2-enterprise/ui-toolkit";
import { DiagnosticMessage, FlowNode, Property } from "@wso2-enterprise/ballerina-core";

interface NodeProperties {
    [key: string]: Property;
}
import { NODE_WIDTH } from "../../resources/constants";

const IconBtn = styled.div`
    width: 20px;
    height: 20px;
    font-size: 16px;
    color: ${ThemeColors.ERROR};
`;

const PopupContainer = styled.div`
    max-width: ${NODE_WIDTH}px;
    font-family: "GilmerMedium";
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;

    background-color: ${ThemeColors.SURFACE_DIM};
    color: ${ThemeColors.ON_SURFACE};
    padding: 8px;
    ul {
        margin: 0;
        padding-left: 20px;
    }
`;

export interface DiagnosticsPopUpProps {
    node: FlowNode;
}

export function DiagnosticsPopUp(props: DiagnosticsPopUpProps) {
    const { node } = props;

    const [diagnosticsAnchorEl, setDiagnosticsAnchorEl] = useState<HTMLElement | SVGSVGElement>(null);
    const isDiagnosticsOpen = Boolean(diagnosticsAnchorEl);
    const diagnosticMessages: DiagnosticMessage[] = node.diagnostics?.diagnostics || [];

    const handleOnDiagnosticsClick = (event: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
        setDiagnosticsAnchorEl(event.currentTarget);
    };

    const handleOnDiagnosticsClose = () => {
        setDiagnosticsAnchorEl(null);
    };

    const getPropertyDiagnostics = (properties: NodeProperties) => {
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                const property = properties[key] as Property;
                if (property.diagnostics && property.diagnostics.hasDiagnostics) {
                    diagnosticMessages.push(...property.diagnostics.diagnostics);
                }
            }
        }
    };

    if (node.properties) {
        getPropertyDiagnostics(node.properties);
    }
    if (node.branches?.length > 0) {
        node.branches.forEach((branch) => {
            getPropertyDiagnostics(branch.properties);
        });
    }

    return (
        <>
            <IconBtn onClick={handleOnDiagnosticsClick}>
                <Icon name="error-outline-rounded" />
            </IconBtn>
            <Popover
                open={isDiagnosticsOpen}
                anchorEl={diagnosticsAnchorEl}
                handleClose={handleOnDiagnosticsClose}
                sx={{
                    backgroundColor: ThemeColors.SURFACE_DIM,
                }}
            >
                <PopupContainer>
                    <ul>
                        {diagnosticMessages?.map((diagnostic) => (
                            <li key={diagnostic.message}>{diagnostic.message}</li>
                        ))}
                    </ul>
                </PopupContainer>
            </Popover>
        </>
    );
}
