/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ResponseViewItem } from "./ResponsesViewItem";

export default {
    component: ResponseViewItem,
    title: 'New Response TreeView Item',
};

export const ResponseTreeViewItemStory = () => {

    return (
        <ResponseViewItem
            id="response"
            response="requestBody"
            onDeleteResponse={(r: string) => {
                console.log("Delete Response", r);
            }}
        />
    );
};
