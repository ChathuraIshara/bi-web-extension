/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useState } from "react";

import debounce from "lodash.debounce";

import { S } from "..";
import { FunctionDefinitionInfo } from "@wso2-enterprise/ballerina-core";
import { Typography } from "@wso2-enterprise/ui-toolkit";

interface ActionCardProps {
    action: FunctionDefinitionInfo;
    onSelect: (action: FunctionDefinitionInfo) => void;
}

export function ActionCard(props: ActionCardProps) {
    const { action, onSelect } = props;

    const name = action.displayAnnotation?.label || action.name;

    const [showDocumentation, setShowDocumentation] = useState(false);

    const debouncedHandleMouseEnter = debounce(() => setShowDocumentation(true), 500);

    const handleOnMouseLeave = () => {
        setShowDocumentation(false);
        debouncedHandleMouseEnter.cancel();
    };

    const handleOnSelect = () => {
        onSelect(action);
    };

    return (
        <S.ActionContainer key={`action-${action.name.toLowerCase()}`} onClick={handleOnSelect} onMouseEnter={debouncedHandleMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <S.ComponentTitle>{name}</S.ComponentTitle>
            {showDocumentation && action.documentation && (
                <Typography variant="caption">{action.documentation}</Typography>
            )}
        </S.ActionContainer>
    );
}
