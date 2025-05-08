import { Views } from "../constants";
import { OpenAPI } from "./ServiceDefinitions";

/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface APIDesignerContext {
    props: {
        openAPIVersion: string;
        openAPI: OpenAPI;
        selectedComponentID?: string | undefined;
        components?: string[];
        pathInitiated?: boolean;
        view?: Views;
        currentView?: Views;
    };
    api: {
        onSelectedComponentIDChange?: (component: string) => void;
        onCurrentViewChange?: (currentView: Views) => void;
        onPathInitiatedChange?: (pathInitiated: boolean) => void;
    };
}