/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { useEffect, useState } from "react";

import { Codicon } from "@wso2-enterprise/ui-toolkit";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useVisualizerContext } from "@wso2-enterprise/api-designer-rpc-client";
import { MACHINE_VIEW, VisualizerLocation } from "@wso2-enterprise/api-designer-core";
import { HierachicalPath } from "./HierachicalPath";

interface NavButtonGroupProps {
    currentProjectPath?: string;
}

export function NavButtonGroup(props: NavButtonGroupProps) {

    const { rpcClient } = useVisualizerContext();

    const [machineView, setMachineView] = useState<VisualizerLocation>(null);

    useEffect(() => {
        try {
            rpcClient.getVisualizerState().then((mState) => {
                setMachineView(mState);
            });
        } catch (error) {

        }
    }, []);

    const handleBackButtonClick = () => {
        rpcClient.getApiDesignerVisualizerRpcClient().goBack();
    }

    const handleHomeButtonClick = () => {
        rpcClient.getApiDesignerVisualizerRpcClient().goHome();
    }

    return (
        <>
            <>
                {machineView?.view !== MACHINE_VIEW.Overview && (
                    <>
                        <VSCodeButton appearance="icon" title="Go Back" onClick={handleBackButtonClick}>
                            <Codicon name="arrow-left" />
                        </VSCodeButton>
                        <VSCodeButton appearance="icon" title="Home" onClick={handleHomeButtonClick}>
                            <Codicon name="home" />
                        </VSCodeButton>
                    </>
                )}
                <HierachicalPath />
            </>

        </>
    );
}
