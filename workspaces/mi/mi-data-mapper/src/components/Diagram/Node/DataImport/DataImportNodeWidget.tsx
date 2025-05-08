/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { useDMIOConfigPanelStore } from "../../../../store/store";
import { Codicon } from "@wso2-enterprise/ui-toolkit";
import { Label } from "../../OverriddenLinkLayer/LabelWidget";
import { IOType } from "@wso2-enterprise/mi-core";
import styled from "@emotion/styled";
import { IO_NODE_DEFAULT_WIDTH } from "../../utils/constants";

const DataImportContainer = styled.div`
    align-items: flex-start;
    background: var(--vscode-sideBar-background);
    border: 1px solid var(--vscode-welcomePage-tileBorder);
    width: ${IO_NODE_DEFAULT_WIDTH}px;
    cursor: pointer;
`;

export interface DataImportNodeWidgetProps {
    configName: string;
    ioType: IOType;
}

export function DataImportNodeWidget(props: DataImportNodeWidgetProps) {
    const { ioType } = props;

    const { setIsIOConfigPanelOpen, setIOConfigPanelType, setIsSchemaOverridden } = useDMIOConfigPanelStore(state => ({
		setIsIOConfigPanelOpen: state.setIsIOConfigPanelOpen,
		setIOConfigPanelType: state.setIOConfigPanelType,
        setIsSchemaOverridden: state.setIsSchemaOverridden
	}));

    const handleOnClick = () => {
        setIsIOConfigPanelOpen(true);
        setIOConfigPanelType(ioType);
        setIsSchemaOverridden(false);
    };

    return (
        <DataImportContainer onClick={handleOnClick}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', backgroundColor: 'var(--vscode-activityBarTop.activeForeground' }}>
            <div style={{padding: '100px', justifyContent: 'space-between'}}>
                <Codicon sx={{ margin: 5, zoom: 5}}  name="new-file" />
                <Label style={{fontSize:15}}>Import {ioType} schema</Label>
            </div>
            </div>
        </DataImportContainer>
    );
}
