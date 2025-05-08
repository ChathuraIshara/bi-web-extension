/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React from 'react';


import { AutoMapError } from './AutoMapError';
import { ErrorNodeKind, RenderingError } from './RenderingError';
import { WarningBanner } from '../Warning/DataMapperWarning';
import { DataMapperInputParam, DataMapperOutputParam } from '../ConfigPanel/InputParamsPanel/types';

// Function to render WarningBanner with error message
const renderWarningBanner = (classes: any, message: React.ReactNode) => (
    <WarningBanner
        message={message}
        className={classes.errorBanner}
    />
);

// Function to render error message with overlay
const renderErrorMessage = (classes: any, errorMessage: React.ReactNode) => (
    <>
        <div className={classes.overlay} />
        <div className={classes.errorMessage}>
            {errorMessage}
        </div>
    </>
);

// Component to render error based on error kind
export const IOErrorComponent: React.FC<{
    errorKind: ErrorNodeKind;
    classes: any
}> = ({ errorKind, classes }) => {
    if (errorKind) {
        const errorMessage = <RenderingError errorNodeKind={errorKind} />;
        return renderErrorMessage(classes, renderWarningBanner(classes, errorMessage));
    }
    return null;
};

// Component to render auto map error
export const AutoMapErrorComponent: React.FC<{
    autoMapError: AutoMapError;
    classes: any
}> = ({ autoMapError, classes }) => {
    if (autoMapError) {
        const errorMessage = <AutoMapError {...autoMapError} />;
        return renderErrorMessage(classes, renderWarningBanner(classes, errorMessage));
    }
    return null;
};

// Component to render error for unsupported IO
export const UnsupportedIOErrorComponent: React.FC<{
    inputs: DataMapperInputParam[];
    output: DataMapperOutputParam;
    classes: any;
}> = ({ inputs, output, classes }) => {
    const hasInvalidInputs = inputs.some(input => input.isUnsupported);
    const hasInvalidOutput = output.isUnsupported;

    let errorMsg = `The Data Mapper does not support the selected `;
    if (hasInvalidInputs) {
        errorMsg += 'input type(s)';
    }
    if (hasInvalidOutput) {
        errorMsg += `${hasInvalidInputs ? ' and output type.' : 'output type.'}`;
    } else {
        errorMsg += '.';
    }
    errorMsg += ' Please ensure you are using compatible Record Types or Primitive Types.';

    const errorMessage = <p>{errorMsg}</p>;
    return renderErrorMessage( classes, renderWarningBanner(classes, errorMessage));
};
