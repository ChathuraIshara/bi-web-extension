/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, useContext } from 'react';
import { Type } from '@wso2-enterprise/ballerina-core';
import { CtrlClickWrapper } from '@wso2-enterprise/ballerina-core';
import { DiagramContext } from '../DiagramContext/DiagramContext';

interface CtrlClickProps {
    node: Type;
}

export function CtrlClickGo2Source(props: PropsWithChildren<CtrlClickProps>) {
    const { node, children } = props;
    const { goToSource } = useContext(DiagramContext);
    const handleOnClick = () => {
        goToSource(node);
    };

    return (
        <CtrlClickWrapper onClick={handleOnClick}>
            {children}
        </CtrlClickWrapper>
    )
}
