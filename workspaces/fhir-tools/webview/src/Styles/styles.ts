/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createGlobalStyle } from "styled-components";

export const themes = {
    dark: {
        punctuation: '#4667f9',
        function_name: '#9cdcfe',
        symbol: '#9cdcfe',
        variable: '#ce9178',
        url: '#cccccc',
    },
    light: {
        punctuation: '#4667f9',
        function_name: '#8ab5e0',
        symbol: '#0451a5',
        variable: '#a31515',
        url: '#3b3b3b',
    }
};

export const GlobalStyle = createGlobalStyle`
    code[class*="language-"],
    pre[class*="language-"] {
    color: #ccc;
    background: 0 0;
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    }
    pre[class*="language-"] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    }
    :not(pre) > code[class*="language-"],
    pre[class*="language-"] {
    background: var(--vscode-editor-background);
    }
    :not(pre) > code[class*="language-"] {
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
    }
    .token.block-comment,
    .token.cdata,
    .token.comment,
    .token.doctype,
    .token.prolog {
    color: #999;
    }
    .token.punctuation {
    color: ${({ theme }) => theme.punctuation};
    }
    .token.attr-name,
    .token.deleted,
    .token.namespace,
    .token.tag {
    color: #e2777a;
    }
    .token.function-name {
    color: ${({ theme }) => theme.function_name};
    }
    .token.boolean,
    .token.function,
    .token.number {
    color: #f08d49;
    }
    .token.class-name,
    .token.constant,
    .token.property,
    .token.symbol {
    color: ${({ theme }) => theme.symbol};
    }
    .token.atrule,
    .token.builtin,
    .token.important,
    .token.keyword,
    .token.selector {
    color: #cc99cd;
    }
    .token.attr-value,
    .token.char,
    .token.regex,
    .token.string,
    .token.variable {
    color: ${({ theme }) => theme.variable};
    }
    .token.entity,
    .token.operator,
    .token.url {
    color: ${({ theme }) => theme.url};
    }
    .token.bold,
    .token.important {
    font-weight: 700;
    }
    .token.italic {
    font-style: italic;
    }
    .token.entity {
    cursor: help;
    }
    .token.inserted {
    color: green;
    }
    pre[class*="language-"].line-numbers {
    position: relative;
    padding-left: 3.8em;
    counter-reset: linenumber;
    }
    pre[class*="language-"].line-numbers > code {
    position: relative;
    white-space: inherit;
    }
    .line-numbers .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 0;
    font-size: 100%;
    left: -3.8em;
    width: 3em;
    letter-spacing: -1px;
    border-right: 1px solid #999;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    }
    .line-numbers-rows > span {
    display: block;
    counter-increment: linenumber;
    }
    .line-numbers-rows > span:before {
    content: counter(linenumber);
    color: #999;
    display: block;
    padding-right: 0.8em;
    text-align: right;
    }
`;
