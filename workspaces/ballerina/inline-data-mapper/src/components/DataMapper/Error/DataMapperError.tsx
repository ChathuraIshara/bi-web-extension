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

import { ErrorNodeKind, RenderingError } from './RenderingError';
import { WarningBanner } from '../Warning/DataMapperWarning';

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
export const IOErrorComponent: React.FC<{ errorKind: ErrorNodeKind; classes: any }> = ({ errorKind, classes }) => {
    if (errorKind) {
        const errorMessage = <RenderingError errorNodeKind={errorKind} />;
        return renderErrorMessage(classes, renderWarningBanner(classes, errorMessage));
    }
    return null;
};
