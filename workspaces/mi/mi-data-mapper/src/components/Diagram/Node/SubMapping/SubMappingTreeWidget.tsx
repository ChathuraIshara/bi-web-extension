/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode } from 'react';

import styled from "@emotion/styled";
import { Button, Codicon, Icon } from '@wso2-enterprise/ui-toolkit';
import { DiagramEngine } from '@projectstorm/react-diagrams';

import { useDMSearchStore, useDMSubMappingConfigPanelStore } from "../../../../store/store";
import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { InputOutputPortModel } from '../../Port';
import { SUB_MAPPING_INPUT_SOURCE_PORT_PREFIX } from "../../utils/constants";
import { SharedContainer } from '../commons/Tree/Tree';
import { DMSubMapping } from "./index";
import { useIONodesStyles } from '../../../styles';
import { SubMappingItemWidget } from './SubMappingItemWidget';

const SubMappingsHeader = styled.div`
    background: var(--vscode-sideBarSectionHeader-background);
    height: 40px;
    width: 100%;
    line-height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;
`;

const HeaderText = styled.span`
    margin-left: 10px;
    min-width: 280px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vscode-inputOption-activeForeground)
`;

export interface SubMappingTreeWidgetProps {
    subMappings: DMSubMapping[];
    engine: DiagramEngine;
    context: IDataMapperContext;
    getPort: (portId: string) => InputOutputPortModel;
}

export function SubMappingTreeWidget(props: SubMappingTreeWidgetProps) {
    const { engine, subMappings, context, getPort } = props;
    const searchValue = useDMSearchStore.getState().inputSearch;
    const isFocusedView = context.views.length > 1;

    const classes = useIONodesStyles();
    const setSubMappingConfig = useDMSubMappingConfigPanelStore(state => state.setSubMappingConfig);

    const subMappingItems: ReactNode[] = subMappings.map((mapping, index) => {
        return (
            <SubMappingItemWidget
                index={index}
                key={`${SUB_MAPPING_INPUT_SOURCE_PORT_PREFIX}.${mapping.name}`}
                id={`${SUB_MAPPING_INPUT_SOURCE_PORT_PREFIX}.${mapping.name}`}
                engine={engine}
                context={context}
                type={mapping.type}
                subMappings={subMappings}
                getPort={(portId: string) => getPort(portId) as InputOutputPortModel}
                valueLabel={mapping.name}
            />
        );
    }).filter(mapping => !!mapping);

    const onClickAddSubMapping = () => {
        setSubMappingConfig({
            isSMConfigPanelOpen: true,
            nextSubMappingIndex: 0,
            suggestedNextSubMappingName: "subMapping"
        });
    };

    return (
        <>
            {subMappingItems.length > 0 ? (
                <SharedContainer data-testid={"sub-mapping-node"}>
                    <SubMappingsHeader>
                        <HeaderText>Sub Mappings</HeaderText>
                    </SubMappingsHeader>
                    {subMappingItems}
                </SharedContainer>
            ) : !isFocusedView && !searchValue && (
                <Button
                    className={classes.addSubMappingButton}
                    appearance='icon'
                    aria-label="add"
                    onClick={onClickAddSubMapping}
                    data-testid={"add-sub-mappings-btn"}
                >
                    <Codicon name="add" iconSx={{ color: "var(--button-primary-foreground)"}} />
                    <div>Add Sub Mapping</div>
                </Button>
            )}
        </>
    );
}
