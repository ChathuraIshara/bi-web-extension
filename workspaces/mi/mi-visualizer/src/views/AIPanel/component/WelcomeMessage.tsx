/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import { Welcome } from '../styles';
import { Icon, Typography } from "@wso2-enterprise/ui-toolkit";
import { useMICopilotContext } from './MICopilotContext';
import { PreviewContainerDefault, WelcomeStyles } from "../styles";

export const WelcomeMessage: React.FC = () => { 
    const { isRuntimeVersionThresholdReached } = useMICopilotContext();
    return (
        <Welcome>
            <div style={WelcomeStyles.container}>
                <Icon
                    name="bi-ai-agent"
                    sx={{ width: 60, height: 50 }}
                    iconSx={{ fontSize: "60px", color: "var(--vscode-foreground)", cursor: "default" }}
                />
                <div style={WelcomeStyles.title}>
                    <h2>WSO2 MI Copilot</h2>
                    {isRuntimeVersionThresholdReached ? (
                        <PreviewContainerDefault>V2-Preview</PreviewContainerDefault>
                    ) : null}
                </div>
                <Typography variant="body1" sx={WelcomeStyles.description}>
                    AI assistant at your service!
                    <br />
                    Please review generated code before adding to your integration.
                </Typography>
                <Typography variant="body1" sx={WelcomeStyles.attachContext}>
                    <Icon isCodicon={true} name="new-file" iconSx={{ cursor: "default" }} /> to attach context
                </Typography>
            </div>
        </Welcome>
    );};
