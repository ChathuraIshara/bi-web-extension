/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { ReactNode } from "react";

import { css } from "@emotion/css";
import { Node } from "ts-morph";

import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { TreeContainer } from "../commons/Tree/Tree";
import { Divider, Icon } from "@wso2-enterprise/ui-toolkit";
import { getEditorLineAndColumn } from "../../utils/common-utils";

interface UnsupportedIOProp {
    children: ReactNode
}

interface UnsupportedExprProps {
    unsupportedExpr: Node;
    context: IDataMapperContext;
}

interface UnsupportedIOProps {
    message: string;
}

const useStyles = () => ({
    treeContainer: css({
        cursor: "default"
    }),
    unsupportedIOBanner: css({
        width: "320px"
    }),
    infoContainer: css({
        display: 'flex',
        lineHeight: 'initial',
        fontSize: '13.5px',
        padding: '5px'
    }),
    unsupportedFile: css({
        color: "var(--vscode-button-background)",
        backgroundColor: "var(--vscode-input-background)",
        fontFamily: "monospace",
        fontWeight: 100,
        cursor: "pointer",
        '&:hover': {
            textDecoration: "underline"
        }
    })
});

function UnsupportedIOWidget({ children }: UnsupportedIOProp) {
    const classes = useStyles();
    return (
        <TreeContainer className={classes.treeContainer}>
            <span className={classes.unsupportedIOBanner}>
                {children}
            </span>
        </TreeContainer>
    );
}

export function UnsupportedIO({ message }: UnsupportedIOProps) {
    const classes = useStyles();

    return (
        <UnsupportedIOWidget>
            <div className={classes.infoContainer}>
                <Icon name="error-outline" />
                <span>{message}</span>
            </div>
        </UnsupportedIOWidget>
    );
}

export function UnsupportedExpr({ unsupportedExpr, context }: UnsupportedExprProps) {
    const classes = useStyles();

    const handleGoToSource = () => {
        const range = getEditorLineAndColumn(unsupportedExpr);
        context.goToSource(range);
    }


    return (
        <UnsupportedIOWidget>
            <div className={classes.infoContainer}>
                <Icon name="error-outline" />
                <span>{`Unsupported Expression`}</span>
            </div>
            <Divider />
            <a
                onClick={handleGoToSource}
                className={classes.unsupportedFile}
            >
                {unsupportedExpr?.getText()}
            </a>
            <div>{`Conditional outputs are not supported by the Data Mapper.`}</div>
            <span>{`Please change the source and try again.`}</span>
        </UnsupportedIOWidget>
    );
}
