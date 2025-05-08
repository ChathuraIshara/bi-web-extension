/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RequestBodyTreeViewItem } from "./RequestBodyTreeViewItem";

export default {
    component: RequestBodyTreeViewItem,
    title: 'New Request Body TreeView Item',
};

export const RequestBodyTreeViewItemStory = () => {

    return (
        <RequestBodyTreeViewItem
            id="requestBody-tree-view-item"
            requestBody="requestBody"
            onDeleteRequestBody={(r: string) => {
                console.log("Delete Request Body", r);
            }}
        />
    );
};
