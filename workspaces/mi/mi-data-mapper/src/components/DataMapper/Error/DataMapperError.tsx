/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

export enum ErrorNodeKind {
    Input,
    Output,
    Intermediate,
    Other
}

export interface DataMapperErrorProps {
    errorNodeKind?: ErrorNodeKind;
}

export function DataMapperError(props: DataMapperErrorProps) {
    const { errorNodeKind } = props;

    let errorMessage = "A problem occurred while rendering the ";
    switch (errorNodeKind) {
        case ErrorNodeKind.Input:
            errorMessage += "input.";
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
                Please raise an issue with the sample code in our <a href={""}> issue tracker</a>
            </p>
        </>
    )
}
