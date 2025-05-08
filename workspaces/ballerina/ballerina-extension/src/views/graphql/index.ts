/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { showGraphqlView } from "./graphqlViewPanel";
import { MESSAGE_TYPE, showMessage } from "../../utils/showMessage";
import { RUN_PROJECT_TO_TRYIT } from "../../core";

export async function createGraphqlView(serviceAPI: string) {
    showMessage(RUN_PROJECT_TO_TRYIT, MESSAGE_TYPE.INFO, true);
    showGraphqlView(serviceAPI);
}
