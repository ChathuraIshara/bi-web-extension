/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Codicon, Icon } from "@wso2-enterprise/ui-toolkit";
import React from "react";

export interface Props {
    option: string;
}

export function ParamIcon(props: Props): JSX.Element {

    return (
        <>
            {props.option === "request" ? <Codicon sx={{marginTop: -3}} name="git-pull-request" /> : <Icon name={props.option} />}
        </>
    )
}
