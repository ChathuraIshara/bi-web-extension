/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from 'react';
import { Icon } from '@wso2-enterprise/ui-toolkit';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { DIRECTORY_MAP, EVENT_TYPE, MACHINE_VIEW, SCOPE } from '@wso2-enterprise/ballerina-core';

import { CardGrid, PanelViewMore, Title, TitleWrapper } from './styles';
import { BodyText } from '../../styles';
import ButtonCard from '../../../components/ButtonCard';
import { AutomationAlreadyExistsTooltip, OutOfScopeComponentTooltip } from './componentListUtils';

interface AutomationPanelProps {
    scope: SCOPE;
};

export function AutomationPanel(props: AutomationPanelProps) {
    const [automationExists, setAutomationExists] = useState(false);
    const { rpcClient } = useRpcContext();

    useEffect(() => {
        rpcClient
            .getBIDiagramRpcClient()
            .getProjectStructure()
            .then((res) => {
                setAutomationExists(res.directoryMap[DIRECTORY_MAP.AUTOMATION].length > 0);
            });
    }, []);

    const outOfScope = props.scope && (props.scope !== SCOPE.AUTOMATION && props.scope !== SCOPE.ANY);
    const isDisabled = outOfScope || automationExists;

    const tooltip = outOfScope
        ? OutOfScopeComponentTooltip
        : automationExists
            ? AutomationAlreadyExistsTooltip
            : "";

    const handleClick = async () => {
        await rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.BIMainFunctionForm,
            },
        });
    };

    return (
        <PanelViewMore disabled={isDisabled}>
            <TitleWrapper>
                <Title variant="h2">Automation</Title>
                <BodyText>Create an automation that can be invoked periodically or manually.</BodyText>
            </TitleWrapper>
            <CardGrid>
                <ButtonCard
                    icon={<Icon name="bi-task" />}
                    title="Automation"
                    onClick={handleClick}
                    disabled={isDisabled}
                    tooltip={tooltip}
                />
            </CardGrid>
        </PanelViewMore>
    );
};
