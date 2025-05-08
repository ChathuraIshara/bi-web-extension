/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { ActionButtonsProps } from './types/actionButton';
import { Button } from '../../../Button/Button';
import { Codicon } from '../../../Codicon/Codicon';
import { Icon } from '../../../Icon/Icon';

const ActionButtonsContainer = styled.div`
    position: absolute;
    top: -14px;
    right: 0;
    display: flex;
    gap: 4px;
`;

export const ActionButtons = forwardRef<HTMLDivElement, ActionButtonsProps>(
    ({ isHelperPaneOpen, actionButtons }, ref) => {
        return (
            <ActionButtonsContainer ref={ref}>
                {actionButtons.map((actBtn, index) => {
                    let icon: React.ReactNode;
                    if (actBtn.iconType === 'codicon') {
                        icon = (
                            <Codicon
                                key={index}
                                name={actBtn.name}
                                iconSx={{
                                    fontSize: '12px',
                                    color: 'var(--vscode-button-foreground)'
                                }}
                                sx={{ height: '14px', width: '16px' }}
                            />
                        );
                    } else {
                        icon = (
                            <Icon
                                key={index}
                                name={actBtn.name}
                                iconSx={{
                                    fontSize: '12px',
                                    color: 'var(--vscode-button-foreground)'
                                }}
                                sx={{ height: '14px', width: '16px' }}
                            />
                        );
                    }

                    return (
                        <Button
                            key={index}
                            tooltip={actBtn.tooltip}
                            onClick={actBtn.onClick}
                            appearance="icon"
                            sx={{
                                'vscode-button:hover': {
                                    backgroundColor: 'var(--button-primary-hover-background) !important'
                                }
                            }}
                            buttonSx={{
                                height: '16px',
                                width: '22px',
                                borderRadius: '2px',
                                backgroundColor: 'var(--vscode-button-background)',
                                ...(isHelperPaneOpen && {
                                    backgroundColor: 'var(--button-primary-hover-background)'
                                })
                            }}
                        >
                            {icon}
                        </Button>
                    );
                })}
            </ActionButtonsContainer>
        );
    }
);
ActionButtons.displayName = 'ActionButtons';
