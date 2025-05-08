/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useState } from "react";

import { Box, ListItem, Typography } from "@material-ui/core";
import { FunctionDefinitionInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import debounce from "lodash.debounce";

import useStyles from "../../style";

interface ActionCardProps {
    action: FunctionDefinitionInfo;
    onSelect: (action: FunctionDefinitionInfo) => void;
}

export function ActionCard(props: ActionCardProps) {
    const classes = useStyles();
    const { action, onSelect } = props;

    const name = action.displayAnnotation?.label || action.name;

    const [showDocumentation, setShowDocumentation] = useState(false);

    const debouncedHandleMouseEnter = debounce(() => setShowDocumentation(true), 500);

    const handleOnMouseLeave = () => {
        setShowDocumentation(false);
        debouncedHandleMouseEnter.cancel();
    };

    const handleOnSelect = () => {
        onSelect(action);
    };

    return (
        <ListItem
            key={`action-${action.name.toLowerCase()}`}
            data-testid={`${action.name.toLowerCase().replaceAll(" ", "-")}`}
            className={classes.actionItem}
            button={true}
            onClick={handleOnSelect}
            onMouseEnter={debouncedHandleMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            <Box flex={true} flexDirection="column">
                <Typography className={classes.actionTitle}>{name}</Typography>
                {showDocumentation && action.documentation && (
                    <Typography className={classes.actionSubtitle}>{action.documentation}</Typography>
                )}
            </Box>
        </ListItem>
    );
}
