/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useMemo } from 'react';

import { Breadcrumbs, Codicon } from '@wso2-enterprise/ui-toolkit';
import { css } from '@emotion/css';
import { View } from "../Views/DataMapperView";
import { extractLastPartFromLabel } from './utils';

const useStyles = () => {
    const baseStyle = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    return {
        baseStyle,
        active: css({
            ...baseStyle,
            cursor: "default",
            lineHeight: "unset",
            color: "inherit",
        }),
        link: css({
            ...baseStyle,
            cursor: "pointer",
            color: "inherit",
            "&:hover": {
                color: "inherit"
            },
        })
    };
};

export interface HeaderBreadcrumbProps {
    views: View[];
    switchView: (index: number) => void;
}

export default function HeaderBreadcrumb(props: HeaderBreadcrumbProps) {
    const { views, switchView } = props;
    const classes = useStyles();

    const [activeLink, links] = useMemo(() => {
        if (views) {
            const focusedView = views[views.length - 1];
            const isFocusedOnSubMappingRoot = focusedView.subMappingInfo
                && focusedView.subMappingInfo.focusedOnSubMappingRoot;
            const otherViews = views.slice(0, -1);
            let isFnDef = views.length === 1;
            let label = extractLastPartFromLabel(focusedView.label);

            const selectedLink = (
                <div className={classes.active}>
                    {isFnDef ? label : `${label}:${isFocusedOnSubMappingRoot ? 'SubMapping' : 'Map'}`}
                </div>
            );

            const restLinks = otherViews.length > 0 && (
                otherViews.map((view, index) => {
                    label = view.label;
                    const isSubMappingRoot = view.subMappingInfo && view.subMappingInfo.focusedOnSubMappingRoot;
                    isFnDef = index === 0;
                    return (
                        <a
                            data-index={index}
                            key={index}
                            onClick={handleClick}
                            className={classes.link}
                            data-testid={`dm-header-breadcrumb-${index}`}
                        >
                            {isFnDef ? label : `${label}:${isSubMappingRoot ? 'SubMapping' : 'Map'}`}
                        </a>
                    );
                })
            );

            return [selectedLink, restLinks];
        }
        return [undefined, undefined];
    }, [views]);

    function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        const index: number = +event.currentTarget.getAttribute('data-index');
        switchView(index);
    }

    return (
        <Breadcrumbs
            maxItems={3}
            separator={<Codicon name="chevron-right" />}
            sx={{ width: '82%' }}
        >
            {links}
            {activeLink}
        </Breadcrumbs>
    );
}
