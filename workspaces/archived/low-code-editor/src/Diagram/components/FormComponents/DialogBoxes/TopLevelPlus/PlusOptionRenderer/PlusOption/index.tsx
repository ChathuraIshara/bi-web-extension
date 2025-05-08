/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { getConstructIcon } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import classNames from "classnames";

import { PlusMenuEntry } from "../../PlusOptionsSelector";

interface PlusOptionProps {
    entry: PlusMenuEntry;
    onOptionSelect: (entry: PlusMenuEntry) => void;
}

export function PlusOption(props: PlusOptionProps) {
    const { entry, onOptionSelect } = props;

    const hasSubMenu = entry.subMenu && entry.subMenu.length > 0;
    const onClick = () => {
        onOptionSelect(entry);
    }
    const subMenuElements: JSX.Element[] =
        hasSubMenu ?
            entry.subMenu.map(subMenuEntry => (
                <PlusOption
                    key={`plus-option-${entry.name.trim()}}`}
                    entry={subMenuEntry}
                    onOptionSelect={onOptionSelect}
                />
            )) : [];

    const subMenu = (
        <ul className="dropdown-menu" >
            {subMenuElements}
        </ul>
    )

    return (
        <li
            className={classNames({ 'dropdown-submenu': hasSubMenu })}
            onClick={!hasSubMenu ? onClick : null}
        >
            <div className="plus-option">
                <div className="plus-option-icon">
                    {getConstructIcon(entry.type)}
                </div>
                <div className="plus-option-text">
                    {entry.name}
                </div>
            </div>
            <div>
                {hasSubMenu && subMenu}
            </div>
        </li>
    )
}
