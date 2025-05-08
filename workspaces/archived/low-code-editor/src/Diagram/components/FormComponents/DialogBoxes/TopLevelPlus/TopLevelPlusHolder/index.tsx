/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { Divider } from '@material-ui/core';
import { getConstructIcon } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import classNames from 'classnames';

import { PlusMenuCategories, PlusMenuEntry } from '../PlusOptionsSelector';

import './style.scss';

interface TopLevelPlusHolderProps {
    entries: PlusMenuEntry[];
    onOptionSelect: (entry: PlusMenuEntry) => void;
}

export function TopLevelPlusHolder(props: TopLevelPlusHolderProps) {

    const { entries, onOptionSelect } = props;

    const entryPoints: JSX.Element[] = [];
    const constructs: JSX.Element[] = [];
    const moduleInit: JSX.Element[] = [];

    entries.forEach(entry => {

        const onEntryClick = () => {
            onOptionSelect(entry);
        }

        switch (entry.category) {
            case PlusMenuCategories.CONSTRUCT:
                constructs.push((
                    <div
                        className={classNames("sub-option enabled", { height: 'unset' })}
                        data-testid="addcustom"
                        onClick={onEntryClick}
                    >
                        <div className="icon-wrapper">
                            {getConstructIcon(entry.type)}
                        </div>
                        <div className="text-label">{entry.name}</div>
                    </div>
                ));
                break;
            case PlusMenuCategories.ENTRY_POINT:
                entryPoints.push((
                    <div
                        className={classNames("sub-option enabled", { height: 'unset' })}
                        data-testid="addcustom"
                        onClick={onEntryClick}
                    >
                        <div className="icon-wrapper">
                            {getConstructIcon(entry.type)}
                        </div>
                        <div className="text-label">{entry.name}</div>
                    </div>
                ));
                break;
            case PlusMenuCategories.MODULE_INIT:
                moduleInit.push((
                    <div
                        className={classNames("sub-option enabled", { height: 'unset' })}
                        data-testid="addcustom"
                        onClick={onEntryClick}
                    >
                        <div className="icon-wrapper">
                            {getConstructIcon(entry.type)}
                        </div>
                        <div className="text-label">{entry.name}</div>
                    </div>
                ));
                break;
        }
    })

    return (
        <div className="plus-holder">
            <div className="holder-wrapper">
                <div className="element-options">
                    <div className="element-option-holder" >
                        <div className='options-title'>
                            <div className='options-title-label'>
                                Entry points
                            </div>
                        </div>
                        <div className='options-wrapper'>
                            {entryPoints}
                        </div>
                        {entryPoints.length > 0 && constructs.length > 0 && <Divider />}
                        <div className='options-title'>
                            <div className='options-title-label'>
                                Constructs
                            </div>
                        </div>
                        <div className='options-wrapper'>
                            {constructs}
                        </div>
                        {moduleInit.length > 0 && constructs.length > 0 && entryPoints.length > 0 && <Divider />}
                        <div className='options-title'>
                            <div className='options-title-label'>
                                Module level variables
                            </div>
                        </div>
                        <div className='options-wrapper'>
                            {moduleInit}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
