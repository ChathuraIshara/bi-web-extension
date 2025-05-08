/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useMemo } from 'react';

import { Breadcrumbs, Codicon } from '@wso2-enterprise/ui-toolkit';
import { STKindChecker } from "@wso2-enterprise/syntax-tree";

import { SelectionState, ViewOption } from "../DataMapper";
import { css } from '@emotion/css';

const useStyles = () => {
    const baseStyle = {
        color: "inherit",
        fontFamily: "var(--vscode-editor-font-family)",
        fontSize: "13px"
    };

    return {
        active: css({
            ...baseStyle,
            cursor: "default"
        }),
        link: css({
            ...baseStyle,
            cursor: "pointer",
            "&:hover": {
                color: "var(--vscode-textLink-activeForeground)"
            }
        })
    };
};

export interface HeaderBreadcrumbProps {
    selection: SelectionState;
    changeSelection: (mode: ViewOption, selection?: SelectionState, navIndex?: number) => void;
}

export default function HeaderBreadcrumb(props: HeaderBreadcrumbProps) {
    const { selection, changeSelection } = props;
    const classes = useStyles();

    const [activeLink, links] = useMemo(() => {
        if (selection.selectedST.stNode) {
            let isFnDef = STKindChecker.isFunctionDefinition(selection.selectedST.stNode);
            let label = selection.selectedST.fieldPath;
            const selectedLink = (
                <div className={classes.active}>
                    {isFnDef ? label : `${label}:query`}
                </div>
            );

            const restLinks = selection.prevST.length > 0 && (
                selection.prevST.map((node, index) => {
                    label = node.fieldPath;
                    isFnDef = STKindChecker.isFunctionDefinition(node.stNode);
                    return (
                        <a
                            data-index={index}
                            key={index}
                            onClick={handleClick}
                            className={classes.link}
                            data-testid={`dm-header-breadcrumb-${index}`}
                        >
                            {isFnDef ? label : `${label}:query`}
                        </a>
                    );
                })
            );

            return [selectedLink, restLinks];
        }
        return [undefined, undefined];
    }, [selection]);

    function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        const index: number = +event.currentTarget.getAttribute('data-index');
        changeSelection(ViewOption.NAVIGATE, undefined, index);
    }

    return (
        <Breadcrumbs
            maxItems={3}
            separator={<Codicon name="chevron-right" />}
        >
            {/* <div className={classes.path}> */}
                {links}
                {activeLink}
            {/* </div> */}
        </Breadcrumbs>
    );
}
