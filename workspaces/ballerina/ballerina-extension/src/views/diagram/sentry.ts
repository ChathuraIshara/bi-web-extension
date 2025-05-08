// /**
//  * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */
//  export interface SentryConfig {
//     environment: string;
//     dsn: string;
//     release: string;
//     correlationID: string;
// }

// export function getSentryConfig(): Promise<SentryConfig | undefined> { 
//     return new Promise((resolve, reject) => {
//         return resolve({dsn : process.env.SENTRY_DSN || "https://92fac883fadc46a49fccc9fe0047e27e@o350818.ingest.sentry.io/6192405", 
//                 environment: process.env.VSCODE_CHOREO_SENTRY_ENV || "dev",
//                 release: "release-1",
//                 correlationID: process.env.VSCODE_CHOREO_CORRELATION_ID || ""
//         });
//     });
// }
