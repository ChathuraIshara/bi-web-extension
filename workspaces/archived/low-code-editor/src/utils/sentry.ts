/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";
import { SentryConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

export const init = (config: SentryConfig) => {
    const sampleRate = 1;
    if (!config.dsn) return;
    try {
        Sentry.init({
            dsn: "",
            release: process.env.APP_VERSION || "Low-code-default",
            environment: config.environment,
            ignoreErrors: [],
            sampleRate,
            integrations: [new BrowserTracing()],
            tracesSampleRate: 1.0,
        });
        Sentry.setContext("Correlation ID", { id : config.correlationID });
    } catch (e) {
        // tslint:disable: no-console
        console.error(e);
    }
};

export const reportErrorWithScope = (error: any, extraInfo?: any) => {
    Sentry.withScope((scope) => {
        if (extraInfo) scope.setExtras(extraInfo);
        Sentry.captureException(error);
    });
};
