/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { MenuItem } from "@wso2-enterprise/ui-toolkit";
import React from "react";

interface BreakpointMenuWidgetProps {
    hasBreakpoint: boolean;
    onAddBreakpoint: () => void;
    onRemoveBreakpoint: () => void;
}

export function BreakpointMenu(props: BreakpointMenuWidgetProps) {
    const { hasBreakpoint, onAddBreakpoint, onRemoveBreakpoint } = props;

    return (
        <>
            {hasBreakpoint ?
                <MenuItem
                    key={'remove-breakpoint-btn'}
                    item={{ label: 'Remove Breakpoint', id: "removeBreakpoint", onClick: () => onRemoveBreakpoint() }}
                /> :
                <MenuItem key={'breakpoint-btn'}
                    item={{ label: 'Add Breakpoint', id: "addBreakpoint", onClick: () => onAddBreakpoint() }}
                />
            }
        </>
    );
}
