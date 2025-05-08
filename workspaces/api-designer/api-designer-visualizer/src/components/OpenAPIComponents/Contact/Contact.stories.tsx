/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { OpenAPI } from "../../../Definitions/ServiceDefinitions";
import petstoreJSON from "../../Data/petstoreJSON.json";
import { Contact } from "./Contact";
import { ReadOnlyContact } from "./ReadOnlyContact";

export default {
    component: Contact,
    title: 'New Contact',
};

const apiDefinition: OpenAPI = petstoreJSON as unknown as OpenAPI;

export const ContactStory = () => {
    return (
        <Contact contact={apiDefinition.info.contact} onContactChange={() => {}} />
    );
};

export const ReadOnlyContactStory = () => {
    return (
        <ReadOnlyContact contact={apiDefinition.info.contact} />
    );
}
