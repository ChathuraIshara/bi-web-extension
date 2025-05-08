/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export function isGraphqlVisualizerSupported(version: string): boolean {
    // Version example
    // 2301.0.0
    // major release of next year
    // YYMM.0.0
    if (!version) {
        return false;
    }
    const versionRegex = new RegExp("^[0-9]{4}.[0-9].[0-9]");
    const versionStr = version.match(versionRegex);
    const splittedVersions = versionStr[0]?.split(".");
    if ((parseInt(splittedVersions[0], 10) === 2201)) {
        // 2201.1.x
        return parseInt(splittedVersions[1], 10) >= 5;
    } else  if (parseInt(splittedVersions[0], 10) > 2201) {
        // > 2201 (eg: 2301, 2202)
        return true;
    } else {
        return false;
    }
}
