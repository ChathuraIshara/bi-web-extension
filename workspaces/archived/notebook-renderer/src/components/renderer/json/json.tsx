/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { h, FunctionComponent } from 'preact';
import ReactJson, { ThemeKeys, ThemeObject } from 'react-json-view';
import { DEFAULT_FONT_STYLE, JSON_DARK_THEME, JSON_LIGHT_THEME } from '../themes';
import { NotebookCellResult } from '../types';
import { getIsDarkMode } from '../utils';

export const JsonForNotebookOutput: FunctionComponent<{
    notebookCellOutput: Readonly<NotebookCellResult>
}> = ({ notebookCellOutput }) => {
    const darkMode = getIsDarkMode();
    return <div style={{
        maxHeight: '600px',
        overflowY: 'scroll'
    }}>
        <Json
            value={JSON.parse(notebookCellOutput.shellValue.value)}
            theme={darkMode ? JSON_DARK_THEME : JSON_LIGHT_THEME}
            collapsed={3}
        />
    </div>;
}

export const Json: FunctionComponent<{
    value: Object, theme: ThemeObject | ThemeKeys, styles?: Object, collapsed?: number
}> = ({ value, theme, styles, collapsed }) => {
    return <ReactJson
        src={value}
        name={false}
        enableClipboard={false}
        displayDataTypes={false}
        groupArraysAfterLength={20}
        theme={theme}
        collapsed={collapsed ?? false}
        style={{
            padding: 24,
            ...DEFAULT_FONT_STYLE,
            ...styles
        }} />;
}
