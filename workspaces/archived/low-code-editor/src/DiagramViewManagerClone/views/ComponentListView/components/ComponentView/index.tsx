/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
import React from "react";

import { Typography } from "@material-ui/core";
import { ComponentViewInfo, getConstructIcon } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import classNames from "classnames";


import useStyles from "./style";
import './style.scss';

interface ComponentViewProps {
    type?: string;
    info: ComponentViewInfo;
    updateSelection: (info: ComponentViewInfo) => void;
}


export function ComponentView(props: ComponentViewProps) {
    const { info, updateSelection } = props;
    const classes = useStyles();

    const handleComponentClick = () => {
        updateSelection(info);
    };

    const isComponentAllowed = (type: string) => {
        switch (type) {
            case 'classes':
            case 'objects':
            case 'types':
            case 'enums':
            case 'listeners':
                return false;
            default:
                return true;
        }
    }

    return (
        <div
            className={classNames("component", { 'not-allowed': !isComponentAllowed(props.type) })}
            onClick={isComponentAllowed(props.type) ? handleComponentClick : undefined}
            title={info.name.length ? info.name : '/'}
        >
            <div className="icon">
                {getConstructIcon(`${iconNameTranslator(props.type)}Icon`)}
            </div>
            <Typography className={classes.label} variant="h4">{info.name.length ? info.name : '/'}</Typography>
        </div>
    )
}

function iconNameTranslator(type: string) {
    switch (type) {
        case 'functions':
            return 'Function';
        case 'services':
            return 'Service';
        case 'records':
            return 'TypeDefinition';
        case 'objects':
            return 'Object';
        case 'classes':
            return 'Class';
        case 'types':
            return 'TypeDefinition';
        case 'constants':
            return 'Constant';
        case 'enums':
            return 'Enum';
        case 'listeners':
            return 'Listener';
        case 'moduleVariables':
            return 'Variable';
        default:
            return 'TypeDefinition';
    }
}

