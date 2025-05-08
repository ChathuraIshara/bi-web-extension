/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-lambda  jsx-no-multiline-js
import React from 'react';

import { css } from '@emotion/css';
import { Button, ContextMenu, Icon, Item, Typography } from '@wso2-enterprise/ui-toolkit';

const useStyles = () => ({
    itemContainer: css({
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    }),
});

export enum ValueConfigOption {
    InitializeWithValue = "Initialize With Default Value",
    EditValue = "Edit Value",
    InitializeArray = "Initialize Array",
    DeleteValue = "Delete Value",
    DeleteElement = "Delete Element",
    DeleteArray = "Delete Array",
	MakeChildFieldsOptional = "MakeChildFieldsOptional"
}

export interface ValueConfigMenuItem {
    title: string;
    onClick: () => void;
    onClose?: () => void;
    warningMsg?: string;
    level?: number;
}

export interface ValueConfigMenuProps {
    menuItems: ValueConfigMenuItem[]
    isDisabled?: boolean;
    portName?: string
}

export function ValueConfigMenu(props: ValueConfigMenuProps) {
    const { menuItems, portName } = props;
    const classes = useStyles();

    const items: Item[] = []
    menuItems.forEach((menuItem: ValueConfigMenuItem) => {
        if (menuItem) {
            const itemElement = (
                <div
                    className={classes.itemContainer}
                    key={menuItem.title}
                    data-testid={`value-config-${portName}-item-${menuItem.title}`}
                >
                    <Typography variant='body3'>{menuItem.title}</Typography>
                    {menuItem?.warningMsg && (
                        <Button
                            appearance="icon"
                            tooltip={menuItem?.warningMsg}
                        >
                            <Icon
                                name="error-icon"
                                iconSx={{ fontSize: "16px", color: "var(--vscode-errorForeground)" }}
                            />
                        </Button>
                    )}
                </div>
            );
            const item: Item = { id: menuItem.title, label: itemElement, onClick: menuItem.onClick }
            items.push(item);
        }
    });

    return (
        <ContextMenu
            id={`value-config-${portName}`}
            iconSx={{ transform: "rotate(90deg)" }}
            menuItems={items} position='bottom-left'
        />
    );
}
