/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Header as H } from "../../../Definitions/ServiceDefinitions";
import { Header } from "./Header";

export default {
    component: Header,
    title: 'New Header',
};

const parameter: H = {
    name: "name",
    in: "query",
    description: "description",
    required: true,
    schema: {
        type: "string",
    },
};

export const HeaderStory = () => {
    return (
        <Header id={1} name="Header1"  header={parameter} onRemoveHeader={null} onHeaderChange={() => {}} />
    );
};
