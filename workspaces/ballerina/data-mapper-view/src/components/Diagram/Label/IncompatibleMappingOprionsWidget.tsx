/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

import { Codicon, Item, Menu, MenuItem } from '@wso2-enterprise/ui-toolkit';
import { css } from '@emotion/css';

import { RecordFieldPortModel, ValueType } from '../Port';
import {
    createSourceForMapping,
    getValueType,
    mapUsingCustomFunction,
    modifySpecificFieldSource,
    updateExistingValue
} from '../utils/dm-utils';
import { ExpressionLabelModel } from './ExpressionLabelModel';

export const useStyles = () => ({
    arrayMappingMenu: css({
        pointerEvents: 'auto'
    }),
    itemContainer: css({
        display: 'flex',
        width: '100%',
        alignItems: 'center'
    }),
});

const menuStyles = {
    backgroundColor: "var(--vscode-quickInput-background)",
    boxShadow: "none",
    padding: "0px",
    border: "1px solid var(--vscode-debugIcon-breakpointDisabledForeground)"
};

const codiconStyles = {
    color: 'var(--vscode-editorLightBulb-foreground)',
    marginRight: '10px'
}

export interface IncompatibleMappingOprionsWidgetProps {
    model: ExpressionLabelModel;
}

export function IncompatibleMappingOprionsWidget(props: IncompatibleMappingOprionsWidgetProps) {
    const classes = useStyles();
    const { link, context } = props.model;

    const sourcePort = link.getSourcePort() as RecordFieldPortModel;
    const targetPort = link?.getTargetPort() as RecordFieldPortModel;
    const valueType = getValueType(link);

    const onClickMapDirectly = async () => {
        if (valueType === ValueType.Default) {
            await updateExistingValue(sourcePort, targetPort);
        } else if (valueType === ValueType.NonEmpty) {
            await modifySpecificFieldSource(sourcePort, targetPort, link.getID());
        } else {
            await createSourceForMapping(sourcePort, targetPort);
        }
    }

    const onClickMapUsingCustomFunction = async () => {
        await mapUsingCustomFunction(sourcePort, targetPort, link.getID(), context, valueType);
    };

    const getItemElement = (id: string, label: string) => {
        return (
            <div
                className={classes.itemContainer}
                key={id}
            >
                <Codicon name="lightbulb" sx={codiconStyles} />
                {label}
            </div>
        );
    }

    const o2oMenuItems: Item[] = [
        {
            id: "incompatible-direct",
            label: getItemElement("incompatible-direct", "Map Directly"),
            onClick: onClickMapDirectly
        },
        {
            id: "incompatible-func",
            label: getItemElement("incompatible-func", "Map Using Custom Function"),
            onClick: onClickMapUsingCustomFunction
        }
    ];

    return (
        <div className={classes.arrayMappingMenu}>
            <Menu sx={menuStyles}>
                {o2oMenuItems.map((item: Item) =>
                    <MenuItem
                        key={`item ${item.id}`}
                        item={item}
                    />
                )}
            </Menu>
        </div>
    );
}
