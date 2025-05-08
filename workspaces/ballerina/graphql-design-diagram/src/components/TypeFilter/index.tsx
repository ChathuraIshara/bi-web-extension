/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { Dropdown, OptionProps } from "@wso2-enterprise/ui-toolkit";

export enum OperationTypes {
    Queries = "Queries",
    Mutations = "Mutations",
    Subscriptions = "Subscriptions",
    All_Operations = "All Operations"
}

interface TypeFilterProps {
    updateFilter: (type: OperationTypes) => void;
    isFilterDisabled: boolean;
}


export function TypeFilter(props: TypeFilterProps) {
    const { updateFilter, isFilterDisabled } = props;
    const [type, setType] = React.useState<OperationTypes>(OperationTypes.All_Operations);

    const handleChange = (value: string) => {
        setType(value as OperationTypes);
        updateFilter(value as OperationTypes);
    };

    const dropDownItems: OptionProps[] = [
        { id: "All Operations", content: "All Operations", value: OperationTypes.All_Operations },
        { id: "Queries", content: "Queries", value: OperationTypes.Queries },
        { id: "Mutations", content: "Mutations", value: OperationTypes.Mutations },
        { id: "Subscriptions", content: "Subscriptions", value: OperationTypes.Subscriptions }
    ];

    return (
        <Dropdown
            id={`operation-filter`}
            label="Operation Type"
            value={type}
            onValueChange={handleChange}
            items={dropDownItems}
        />
    );
}
