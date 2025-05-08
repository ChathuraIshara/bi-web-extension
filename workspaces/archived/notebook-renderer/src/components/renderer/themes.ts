/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export const DEFAULT_FONT_STYLE = {
    fontFamily: `var(--vscode-editor-font-family, monospace)`,
    fontWeight: `var(--vscode-editor-font-weight)`,
    fontSize: `var(--vscode-editor-font-size)`
}

export const CODE_EDITOR_COLORS = {
    GREEN: '#05A26B',
    BLUE: '#0095FF',
    ORANGE: '#FF9D52',
    RED: '#EA4C4D',
    PURPLE: '#E040FB',
    DARKER: '#1D2028',
    DARK: '#40404B',
    GREY: '#8D91A3',
    LIGHT: '#CBCEDB',
    LIGHTER: '#E6E7EC',
    LIGHTEST: '#F7F8FB',
    WHITE: '#FFFFFF'
}

const FILL_COLORS = {
    BACKGROUND_LIGHT: '#F7F8FB',
    BACKGROUND_DARK: '#1D2028',
    DIVIDER: '#EDEEF1',
    TRANSPARENT: 'transparent'
}

/**
 * Themes for Json
 *  
 * followed base16 style guide - https://github.com/chriskempson/base16/blob/master/styling.md
 * 
 * - background - base00
 * - side lines & background for null - base02
 * - item count - base04
 * - object keys & brackets - base07
 * - strings & dots - base09
 * - null - base0A
 * - float - base0B
 * - array indexes - base0C
 * - triangle - base0D
 * - bool & collapsed triangle - base0E
 * - int - base0F
 */
export const JSON_LIGHT_THEME = {
    base00: FILL_COLORS.TRANSPARENT, // background
    base01: CODE_EDITOR_COLORS.LIGHT,
    base02: FILL_COLORS.DIVIDER, // side lines and background for null
    base03: CODE_EDITOR_COLORS.LIGHT,
    base04: CODE_EDITOR_COLORS.GREY, // item count
    base05: CODE_EDITOR_COLORS.LIGHT,
    base06: CODE_EDITOR_COLORS.LIGHT,
    base07: CODE_EDITOR_COLORS.DARKER, // keys & brackets
    base08: CODE_EDITOR_COLORS.LIGHTER,
    base09: CODE_EDITOR_COLORS.ORANGE, // strings & dots
    base0A: CODE_EDITOR_COLORS.GREEN, // null
    base0B: CODE_EDITOR_COLORS.ORANGE, // float
    base0C: CODE_EDITOR_COLORS.DARK, // array indexes
    base0D: CODE_EDITOR_COLORS.DARKER, // triangle
    base0E: CODE_EDITOR_COLORS.DARKER, // bool & collapsed triangle
    base0F: CODE_EDITOR_COLORS.ORANGE // int
};

export const JSON_DARK_THEME = {
    base00: FILL_COLORS.TRANSPARENT, // background
    base01: CODE_EDITOR_COLORS.DARK,
    base02: CODE_EDITOR_COLORS.DARK, // side lines and background for null
    base03: CODE_EDITOR_COLORS.DARK,
    base04: CODE_EDITOR_COLORS.GREY, // item count
    base05: CODE_EDITOR_COLORS.DARK,
    base06: CODE_EDITOR_COLORS.DARK,
    base07: CODE_EDITOR_COLORS.WHITE, // keys & brackets
    base08: CODE_EDITOR_COLORS.DARKER,
    base09: CODE_EDITOR_COLORS.ORANGE, // strings & dots
    base0A: CODE_EDITOR_COLORS.GREEN, // null
    base0B: CODE_EDITOR_COLORS.ORANGE, // float
    base0C: CODE_EDITOR_COLORS.LIGHTER, // array indexes
    base0D: CODE_EDITOR_COLORS.LIGHT, // triangle
    base0E: CODE_EDITOR_COLORS.LIGHT, // bool & collapsed triangle
    base0F: CODE_EDITOR_COLORS.ORANGE // int
};

export const XML_LIGHT_THEME = {
    "attributeKeyColor": CODE_EDITOR_COLORS.RED,
    "attributeValueColor": CODE_EDITOR_COLORS.PURPLE,
    "cdataColor": CODE_EDITOR_COLORS.GREEN,
    "commentColor": CODE_EDITOR_COLORS.GREY,
    "separatorColor": CODE_EDITOR_COLORS.DARK,
    "tagColor": CODE_EDITOR_COLORS.DARKER,
    "textColor": CODE_EDITOR_COLORS.ORANGE
};

export const XML_DARK_THEME = {
    "attributeKeyColor": CODE_EDITOR_COLORS.RED,
    "attributeValueColor": CODE_EDITOR_COLORS.PURPLE,
    "cdataColor": CODE_EDITOR_COLORS.GREEN,
    "commentColor": CODE_EDITOR_COLORS.GREY,
    "separatorColor": CODE_EDITOR_COLORS.LIGHTER,
    "tagColor": CODE_EDITOR_COLORS.LIGHTER,
    "textColor": CODE_EDITOR_COLORS.ORANGE
};
