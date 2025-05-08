/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Mustache from "mustache";
import { ARTIFACT_TEMPLATES, DSS_TEMPLATES } from "../../../constants";
import {
    getAddAPIResourceTemplate,
    getEditAPIResourceTemplate,
    getEditProxyTemplate,
    getEditSequenceTemplate,
    getEditAPITemplate,
    getHandlersTemplate,
    getAddAPITemplate
} from "./core/api";
import {
    getAddOperationTemplate,
    getAddResourceTemplate,
    getEditOperationTemplate,
    getEditResourceTemplate,
    getEditDescriptionTemplate,
    getAddQuery
} from "./core/DSS";

export function getXML(name: string, data: { [key: string]: any }) {
    switch (name) {
        case ARTIFACT_TEMPLATES.ADD_API:
            return Mustache.render(getAddAPITemplate(), data);
        case ARTIFACT_TEMPLATES.EDIT_API:
            return Mustache.render(getEditAPITemplate(), data);
        case ARTIFACT_TEMPLATES.ADD_RESOURCE:
            return Mustache.render(getAddAPIResourceTemplate(), data);
        case ARTIFACT_TEMPLATES.EDIT_RESOURCE:
            return Mustache.render(getEditAPIResourceTemplate(), data);
        case ARTIFACT_TEMPLATES.EDIT_SEQUENCE:
            return Mustache.render(getEditSequenceTemplate(), data);
        case ARTIFACT_TEMPLATES.EDIT_PROXY:
            return Mustache.render(getEditProxyTemplate(data.tag), data);    
        case ARTIFACT_TEMPLATES.EDIT_HANDLERS:
            return Mustache.render(getHandlersTemplate(), data);
        case DSS_TEMPLATES.ADD_RESOURCE:
            return Mustache.render(getAddResourceTemplate(), data);
        case DSS_TEMPLATES.EDIT_RESOURCE:
            return Mustache.render(getEditResourceTemplate(), data);
        case DSS_TEMPLATES.ADD_OPERATION:
            return Mustache.render(getAddOperationTemplate(), data);
        case DSS_TEMPLATES.EDIT_OPERATION:
            return Mustache.render(getEditOperationTemplate(), data);
        case DSS_TEMPLATES.EDIT_DESCRIPTION:
            return Mustache.render(getEditDescriptionTemplate(), data);
        case DSS_TEMPLATES.ADD_QUERY:
            return Mustache.render(getAddQuery(), data);
        default:
            return "";
    }
}

