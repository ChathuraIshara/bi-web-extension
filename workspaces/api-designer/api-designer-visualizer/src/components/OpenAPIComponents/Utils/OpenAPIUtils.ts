/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { OpenAPI } from "../../../Definitions/ServiceDefinitions";

export function getSelectedOverviewComponent(openAPIDefinition: OpenAPI): string[] {
    const selectedOptions: string[] = [];
    if (openAPIDefinition?.info?.summary || openAPIDefinition?.info?.summary === "") {
        selectedOptions.push("Summary");
    }
    if (openAPIDefinition?.info?.description || openAPIDefinition?.info?.description === "") {
        selectedOptions.push("Description");
    }
    if (openAPIDefinition?.info?.license) {
        selectedOptions.push("License");
    }
    if (openAPIDefinition?.info?.contact) {
        selectedOptions.push("Contact");
    }
    // TODO: Implement the same for other fields
    // if (openAPIDefinition.servers) {
    //     selectedOptions.push("Servers");
    // }
    // if (openAPIDefinition.security) {
    //     selectedOptions.push("Security");
    // }
    return selectedOptions;
}

export function getChangedOverviewOperationOpenAPI(openAPIDefinition: OpenAPI, options: string[]): OpenAPI {
    const clonedApiDefinition = { ...openAPIDefinition };
    if (options.includes("Summary") && !openAPIDefinition.info?.summary) {
        clonedApiDefinition.info.summary = "";
    } else if (!options.includes("Summary") && (openAPIDefinition.info?.summary || openAPIDefinition.info?.summary === "")) {
        delete clonedApiDefinition.info.summary;
    }
    if (options.includes("License") && !openAPIDefinition.info?.license) {
        clonedApiDefinition.info.license = { name: "", url: "" };
    } else if (!options.includes("License") && openAPIDefinition.info?.license) {
        delete clonedApiDefinition.info.license;
    }
    if (options.includes("Contact") && !openAPIDefinition.info?.contact) {
        clonedApiDefinition.info.contact = { name: "", url: "", email: "" };
    } else if (!options.includes("Contact") && openAPIDefinition.info?.contact) {
        delete clonedApiDefinition.info.contact;
    }
    if (options.includes("Description") && !openAPIDefinition.info?.description) {
        clonedApiDefinition.info.description = "";
    } else if (!options.includes("Description") && (openAPIDefinition.info?.description || openAPIDefinition.info?.description === "")) {
        delete clonedApiDefinition.info.description;
    }
    // TODO: Implement the same for other fields
    // if (options.includes("Servers") && !openAPIDefinition.servers) {
    //     openAPIDefinition.servers = [];
    // } else if (!options.includes("Servers") && openAPIDefinition.servers) {
    //     delete openAPIDefinition.servers;
    // }
    // if (options.includes("Security") && !openAPIDefinition.security) {
    //     openAPIDefinition.security = [];
    // } else if (!options.includes("Security") && openAPIDefinition.security) {
    //     delete openAPIDefinition.security;
    // }
    return openAPIDefinition;
}

export function getUpdatedObjects<T>(existingObjects: T[], values: T): T[] {
    const objectsCopy = existingObjects?.length > 0 ? [...existingObjects] : [];
    objectsCopy.push(values);
    return objectsCopy;
}
