/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { h, FunctionComponent } from 'preact';
// @ts-ignore
import XMLViewer from 'react-xml-viewer';
import { DEFAULT_FONT_STYLE, XML_DARK_THEME, XML_LIGHT_THEME } from '../themes';
import { NotebookCellResult } from '../types';
import { getIsDarkMode } from '../utils';

export const Xml: FunctionComponent<{
    notebookCellOutput: Readonly<NotebookCellResult>
}> = ({ notebookCellOutput }) => {
    const darkMode = getIsDarkMode();
    return <div style={{
        ...DEFAULT_FONT_STYLE,
        letterSpacing: '0.05em',
        padding: 24,
        maxHeight: '600px',
        overflowY: 'scroll',
        backgroundColor: 'transparent'
    }}>
        <XMLViewer
            xml={notebookCellOutput.shellValue.value}
            theme={darkMode ? XML_DARK_THEME : XML_LIGHT_THEME}
        />
    </div>;
}
