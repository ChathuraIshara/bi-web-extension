/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, Codicon, Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { useVisualizerContext } from '@wso2-enterprise/api-designer-rpc-client';
import { OpenAPI } from '../../../Definitions/ServiceDefinitions';
import { getSelectedOverviewComponent, getChangedOverviewOperationOpenAPI } from '../Utils/OpenAPIUtils';
import { useState } from 'react';
import { Info } from '../Info/Info';

const HorizontalFieldWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

export const PanelBody = styled.div`
    height: calc(100% - 87px);
    overflow-y: auto;
    padding: 16px;
    gap: 15px;
    display: flex;
    flex-direction: column;
`;
export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const SubSectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    gap: 5px;
`;

interface OverviewProps {
    openAPIDefinition: OpenAPI;
    isNewFile?: boolean;
    onOpenApiDefinitionChange: (openAPIDefinition: OpenAPI) => void;
}

const moreOptions = ["Summary", "Description", "Contact", "License"];

// Title, Version are mandatory fields
export function Overview(props: OverviewProps) {
    const { openAPIDefinition, isNewFile, onOpenApiDefinitionChange } = props;
    const { rpcClient } = useVisualizerContext();

    const selectedOptions: string[] = getSelectedOverviewComponent(openAPIDefinition);
    const handleOptionChange = (options: string[]) => {
        const newOpenAPI =  getChangedOverviewOperationOpenAPI(openAPIDefinition, options);
        props.onOpenApiDefinitionChange(newOpenAPI);
    };
    const onConfigureClick = () => {
        rpcClient.selectQuickPickItems({
            title: "Select sections",
            items: moreOptions.map(item => ({ label: item, picked: selectedOptions.includes(item) }))
        }).then(resp => {
            if (resp) {
                handleOptionChange(resp.map(item => item.label))
            }
        })
    };

    return (
        <>
            <PanelBody>
                <HorizontalFieldWrapper>
                    <Typography sx={{ margin: 0, marginTop: 0, flex: 1 }} variant="h2">Overview</Typography>
                    <Button tooltip='Select sections' onClick={onConfigureClick} appearance='icon'>
                        <Codicon name='gear' sx={{ marginRight: "4px" }} />
                        Configure
                    </Button>
                </HorizontalFieldWrapper>
                <Info
                    info={openAPIDefinition.info}
                    isNewFile={isNewFile}
                    selectedOptions={selectedOptions}
                    onInfoChange={(info) => {
                        openAPIDefinition.info = info;
                        props.onOpenApiDefinitionChange(openAPIDefinition);
                    }}
                />
            </PanelBody>
        </>
    )
}
