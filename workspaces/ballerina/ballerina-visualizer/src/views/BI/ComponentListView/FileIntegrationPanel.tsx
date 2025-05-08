/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from 'react';
import { Codicon } from '@wso2-enterprise/ui-toolkit';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { EVENT_TYPE, MACHINE_VIEW, SCOPE, ServiceModel, TriggerModelsResponse } from '@wso2-enterprise/ballerina-core';

import { CardGrid, PanelViewMore, Title, TitleWrapper } from './styles';
import { BodyText } from '../../styles';
import ButtonCard from '../../../components/ButtonCard';
import { OutOfScopeComponentTooltip } from './componentListUtils';
import { RelativeLoader } from '../../../components/RelativeLoader';

interface FileIntegrationPanelProps {
    scope: SCOPE;
    triggers: TriggerModelsResponse;
};

export function FileIntegrationPanel(props: FileIntegrationPanelProps) {
    const { rpcClient } = useRpcContext();

    const isDisabled = props.scope && (props.scope !== SCOPE.FILE_INTEGRATION && props.scope !== SCOPE.ANY);

    const handleOnSelect = async (trigger: ServiceModel) => {
        await rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.BIServiceWizard,
                serviceType: trigger.moduleName,
            },
        });
    };

    return (
        <PanelViewMore disabled={isDisabled}>
            <TitleWrapper>
                <Title variant="h2">File Integration</Title>
                <BodyText>Create an integration that can be triggered by the availability of files in a location.</BodyText>
            </TitleWrapper>
            <CardGrid>
                {props.triggers.local.length === 0 && <RelativeLoader />}
                {props.triggers.local
                    .filter((t) => t.type === "file")
                    .map((item, index) => {
                        return (
                            <ButtonCard
                                key={item.id}
                                title={item.name}
                                icon={
                                    item.icon ? (
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            style={{ width: "40px" }}
                                        />
                                    ) : (
                                        <Codicon name="mail" />
                                    )
                                }
                                onClick={() => {
                                    handleOnSelect(item);
                                }}
                                disabled={isDisabled}
                                tooltip={isDisabled ? OutOfScopeComponentTooltip : ""}
                            />
                        );
                    })}
            </CardGrid>
        </PanelViewMore>
    );
};
