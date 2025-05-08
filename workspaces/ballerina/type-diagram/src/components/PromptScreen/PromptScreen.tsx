/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import { useStyles } from './style';
import { Button, Codicon } from '@wso2-enterprise/ui-toolkit';

export interface PromptScreenProps {
    userMessage: string;
    showProblemPanel: (() => void) | undefined;
}

export function PromptScreen(props: PromptScreenProps) {
    const { showProblemPanel, userMessage } = props;
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <h3 className={styles.messageBox}>{userMessage}</h3>
            {showProblemPanel &&
                <Button
                    aria-label='add'
                    id={'add-component-btn'}
                    appearance="icon"
                    onClick={showProblemPanel}
                >
                    <Codicon name='search' iconSx={{ marginRight: '5px' }} />
                    View Diagnostics
                </Button>
            }
        </div>
    );
}
