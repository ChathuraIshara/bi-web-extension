/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { CSSProperties, useState } from 'react';
import { Position } from 'vscode-languageserver-types';
import { HelperPane, HelperPaneHeight } from '@wso2-enterprise/ui-toolkit';
import { CategoryPage } from './CategoryPage';
import { VariablesPage } from './VariablesPage';
import { PayloadPage } from './PayloadPage';
import { PropertiesPage } from './PropertiesPage';
import { HeadersPage } from './HeadersPage';
import { ParamsPage } from './ParamsPage';

export type HelperPaneProps = {
    position: Position;
    helperPaneHeight: HelperPaneHeight;
    onClose: () => void;
    onChange: (value: string) => void;
    addFunction?: (value: string) => void;
    sx?: CSSProperties;
};

const HelperPaneEl = ({ position, helperPaneHeight, sx, onClose, onChange, addFunction }: HelperPaneProps) => {
    const [currentPage, setCurrentPage] = useState<number>(0);

    return (
        <HelperPane helperPaneHeight={helperPaneHeight} sx={{ ' *': { boxSizing: 'border-box' }, ...sx }}>
            {currentPage === 0 && (
                <CategoryPage
                    position={position}
                    setCurrentPage={setCurrentPage}
                    onClose={onClose}
                    onChange={onChange}
                    addFunction={addFunction}
                />
            )}
            {currentPage === 1 && (
                <PayloadPage
                    position={position}
                    setCurrentPage={setCurrentPage}
                    onClose={onClose}
                    onChange={onChange}
                />
            )}
            {currentPage === 2 && (
                <VariablesPage
                    position={position}
                    setCurrentPage={setCurrentPage}
                    onClose={onClose}
                    onChange={onChange}
                />
            )}
            {currentPage === 3 && (
                <HeadersPage
                    position={position}
                    setCurrentPage={setCurrentPage}
                    onClose={onClose}
                    onChange={onChange}
                />
            )}
            {currentPage === 4 && (
                <ParamsPage position={position} setCurrentPage={setCurrentPage} onClose={onClose} onChange={onChange} />
            )}
            {currentPage === 5 && (
                <PropertiesPage
                    position={position}
                    setCurrentPage={setCurrentPage}
                    onClose={onClose}
                    onChange={onChange}
                />
            )}
        </HelperPane>
    );
};

export const getHelperPane = (
    position: Position,
    helperPaneHeight: HelperPaneHeight,
    onClose: () => void,
    onChange: (value: string) => void,
    addFunction?: (value: string) => void,
    sx?: CSSProperties
) => {
    return (
        <HelperPaneEl
            position={position}
            helperPaneHeight={helperPaneHeight}
            sx={sx}
            onClose={onClose}
            onChange={onChange}
            addFunction={addFunction}
        />
    );
};
