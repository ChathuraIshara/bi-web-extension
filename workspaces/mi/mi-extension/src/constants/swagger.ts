/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
/* eslint-disable @typescript-eslint/naming-convention */

import * as path from "path";

export const SWAGGER_LANG_ID = "yaml";
export const SWAGGER_REL_DIR = path.join("src", "main", "wso2mi", "resources", "api-definitions");

export const SWAGGER_PATH_TEMPLATE = {
    type: "object",
    body: {
        // Resources
        "*": {
            type: "object",
            body: {
                // Methods
                "*": {
                    type: "object",
                    body: {
                        parameters: {
                            type: "array",
                            primaryKey: ["name", "in"],
                            body: {},
                        },
                    },
                },
            },
        },
    },
};
