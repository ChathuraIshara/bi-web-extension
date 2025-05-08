/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import { Position } from 'vscode-languageserver-types';
import { Divider, HelperPane } from '@wso2-enterprise/ui-toolkit';
import { FunctionsPage } from './FunctionsPage';
import { ConfigsPage } from './ConfigsPage';

type PanelPageProps = {
    setCurrentPage: (page: number) => void;
};

type CategoryPageProps = {
    position: Position;
    setCurrentPage: (page: number) => void;
    onClose: () => void;
    onChange: (value: string) => void;
    addFunction?: (value: string) => void;
};

const DataPanel = ({ setCurrentPage }: PanelPageProps) => {
    return (
        <>
            <HelperPane.CategoryItem label="Payload" onClick={() => setCurrentPage(1)} />
            <HelperPane.CategoryItem label="Variables" onClick={() => setCurrentPage(2)} />
            <HelperPane.CategoryItem label="Headers" onClick={() => setCurrentPage(3)} />
            <Divider />
            <HelperPane.CategoryItem label="Params" onClick={() => setCurrentPage(4)} />
            <HelperPane.CategoryItem label="Properties" onClick={() => setCurrentPage(5)} />
        </>
    );
};

export const CategoryPage = ({
    position,
    setCurrentPage,
    onChange,
    addFunction
}: CategoryPageProps) => {
    return (
        <>
            <HelperPane.Body>
                <HelperPane.Panels>
                    <HelperPane.PanelTab id={0} title="Data" />
                    <HelperPane.PanelTab id={1} title="Functions" />
                    <HelperPane.PanelTab id={2} title="Configs" />
                    <HelperPane.PanelView id={0}>
                        <DataPanel setCurrentPage={setCurrentPage} />
                    </HelperPane.PanelView>
                    <HelperPane.PanelView id={1}>
                        <FunctionsPage position={position} onChange={onChange} addFunction={addFunction} />
                    </HelperPane.PanelView>
                    <HelperPane.PanelView id={2}>
                        <ConfigsPage position={position} onChange={onChange} />
                    </HelperPane.PanelView>
                </HelperPane.Panels>
            </HelperPane.Body>
        </>
    );
};
