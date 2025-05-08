/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import { Icon } from '@wso2-enterprise/ui-toolkit';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { EVENT_TYPE, MACHINE_VIEW, SCOPE } from '@wso2-enterprise/ballerina-core';

import { CardGrid, PanelViewMore, Title, TitleWrapper } from './styles';
import { BodyText } from '../../styles';
import ButtonCard from '../../../components/ButtonCard';
import { OutOfScopeComponentTooltip } from './componentListUtils';

interface IntegrationAPIPanelProps {
    scope: SCOPE;
};

export function IntegrationAPIPanel(props: IntegrationAPIPanelProps) {
    const { rpcClient } = useRpcContext();
    const isDisabled = props.scope && (props.scope !== SCOPE.INTEGRATION_AS_API && props.scope !== SCOPE.ANY);

    const handleClick = async (serviceType: string) => {
        await rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.BIServiceWizard,
                serviceType: serviceType,
            },
        });
    };

    return (
        <>
            <PanelViewMore disabled={isDisabled}>
                <TitleWrapper>
                    <Title variant="h2">Integration as API</Title>
                    <BodyText>
                        Create an integration that can be exposed as an API in the specified protocol.
                    </BodyText>
                </TitleWrapper>
                <CardGrid>
                    <ButtonCard
                        icon={<Icon name="bi-globe" />}
                        title="HTTP Service"
                        // description="Handle web requests and responses."
                        onClick={() => handleClick("http")}
                        disabled={isDisabled}
                        tooltip={isDisabled ? OutOfScopeComponentTooltip : ""}
                    />
                    <ButtonCard
                        icon={<Icon name="bi-graphql" sx={{ color: "#e535ab" }} />}
                        title="GraphQL Service"
                        // description="Flexible and efficient data queries."
                        onClick={() => handleClick("graphql")}
                        disabled={isDisabled}
                        tooltip={isDisabled ? OutOfScopeComponentTooltip : ""}
                        isBeta
                    />
                    <ButtonCard
                        icon={<Icon name="bi-tcp" />}
                        title="TCP Service"
                        // description="Process connection oriented messages."
                        onClick={() => handleClick("tcp")}
                        disabled={isDisabled}
                        tooltip={isDisabled ? OutOfScopeComponentTooltip : ""}
                        isBeta
                    />
                    {/* TODO: Add this when GRPC is working */}
                    {/* <ButtonCard
                    icon={<Icon name="bi-grpc" />}
                    title="gRPC Service"
                    description="High-performance, cross-platform communication."
                    onClick={() => handleClick("grpc")}
                /> */}
                </CardGrid>
            </PanelViewMore>
        </>
    );
};
