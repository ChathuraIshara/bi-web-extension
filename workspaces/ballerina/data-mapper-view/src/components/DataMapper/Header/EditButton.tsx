/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { Button, Icon, Tooltip } from "@wso2-enterprise/ui-toolkit";

import { useMediaQuery } from "../utils";

interface AutoMapButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function EditButton(props: AutoMapButtonProps) {
    const { onClick, disabled } = props;
    const showText = useMediaQuery('(min-width:800px)');

    return (
        <Tooltip content={"Edit data mapping name, inputs and output"} position="bottom-start">
            <Button
                onClick={onClick}
                appearance="secondary"
                disabled={disabled}
            >
                <Icon name="bi-edit" sx={{ marginRight: 5, width: 16, height: 16, fontSize: 14 }} />
                {showText ? 'Edit' : null}
            </Button>
        </Tooltip>
    );
}
