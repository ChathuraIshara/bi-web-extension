/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { List, ListItem, Typography } from "@material-ui/core";

import { ServiceTypes } from "..";
import { useStyles as useFormStyles } from "../../../DynamicConnectorForm/style";

interface ServiceTypeSelectorProps {
    onSelect: (type: string) => void;
}

export function ServiceTypeSelector(props: ServiceTypeSelectorProps) {
    const { onSelect } = props;
    const formClasses = useFormStyles();

    const types = Object.keys(ServiceTypes).map((type, i) => {
        const values = Object.values(ServiceTypes);
        const handleOnSelect = () => {
            onSelect(values[i]);
        }

        return (
            <ListItem
                key={`service-type-${type.toLowerCase()}`}
                button={true}
                onClick={handleOnSelect}
            >
                <Typography
                    variant="h4"
                >
                    {type}
                </Typography>
            </ListItem>

        )
    })

    return (
        <div className={formClasses.formContentWrapper}>
            <Typography >
                Select Service Type
            </Typography>
            <List data-testid="service-types-list">
                {types}
            </List>
        </div>
    )
}
