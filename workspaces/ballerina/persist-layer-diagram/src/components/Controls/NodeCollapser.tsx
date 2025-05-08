/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import { Button, Icon } from '@wso2-enterprise/ui-toolkit';

interface NodeCollapserProps {
    collapsedMode: boolean;
    setIsCollapsedMode: (collapsedMode: boolean) => void;
}

export function NodeCollapser(props: NodeCollapserProps) {
    const { collapsedMode, setIsCollapsedMode } = props;

    return (
        <Button
            onClick={() => setIsCollapsedMode(!collapsedMode)}
            appearance='icon'
        >
            {collapsedMode ?
                <Icon name="unfold-more" sx={{ marginRight: '10px' }} /> :
                <Icon name='unfold-less' sx={{ marginRight: '10px' }} />
            }
            {collapsedMode ? 'Expand' : 'Collapse'}
        </Button>
    );
}
