/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { ISSUES_URL } from '../../../components/Diagram/utils/constants';

export enum ErrorNodeKind {
    Input,
    Output,
    Intermediate,
    Other
}

export interface DataMapperErrorProps {
    errorNodeKind?: ErrorNodeKind;
}

export function RenderingError(props: DataMapperErrorProps) {
    const { errorNodeKind } = props;

    let errorMessage = "A problem occurred while rendering the ";
    switch (errorNodeKind) {
        case ErrorNodeKind.Input:
            errorMessage += "input(s).";
            break;
        case ErrorNodeKind.Output:
            errorMessage += "output.";
            break;
        default:
            errorMessage += "diagram.";
    }

    return (
        <>
            <p>
                {errorMessage}
            </p>
            <p>
                Please raise an issue with the sample code in our <a href={ISSUES_URL}>issue tracker</a>
            </p>
        </>
    )
}
