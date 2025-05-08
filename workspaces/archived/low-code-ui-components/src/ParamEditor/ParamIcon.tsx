/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import {
    CallerIcon,
    HeaderIcon,
    PayloadIcon,
    QueryIcon,
    RequestIcon
} from '@wso2-enterprise/ballerina-low-code-edtior-commons';

import { PARAM_TYPES } from "./ParamEditor";

export interface Props {
    option: string;
}


export function ParamIcons(props: {type: string}): JSX.Element {
    switch (props.type) {
        case PARAM_TYPES.DEFAULT:
            return <QueryIcon />;
        case PARAM_TYPES.PAYLOAD:
            return <PayloadIcon />;
        case PARAM_TYPES.REQUEST:
            return <RequestIcon />;
        case PARAM_TYPES.CALLER:
            return <CallerIcon />;
        case PARAM_TYPES.HEADER:
            return <HeaderIcon />;
        default:
            return <></>;
    }
}
