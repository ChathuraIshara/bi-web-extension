/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RpcClient } from "@wso2-enterprise/mi-rpc-client";
import { MenuItem } from "@wso2-enterprise/ui-toolkit";
import React from "react";
import { BaseNodeModel } from "../nodes/BaseNodeModel";

interface BreakpointMenuWidgetProps {
    hasBreakpoint: boolean;
    node: BaseNodeModel;
    rpcClient: RpcClient;
}

export function BreakpointMenu(props: BreakpointMenuWidgetProps) {
    const { hasBreakpoint, node, rpcClient } = props;

    return (
        <>
            {hasBreakpoint ?
                <MenuItem key={'remove-breakpoint-btn'} item={{ label: 'Remove Breakpoint', id: "removeBreakpoint", onClick: () => node.removeBreakpoint(rpcClient) }} /> :
                <MenuItem key={'breakpoint-btn'} item={{ label: 'Add Breakpoint', id: "addBreakpoint", onClick: () => node.addBreakpoint(rpcClient) }} />
            }
        </>
    );
}
