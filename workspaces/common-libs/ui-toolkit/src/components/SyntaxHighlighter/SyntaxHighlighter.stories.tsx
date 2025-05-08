/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { ComponentStory } from "@storybook/react";
import { SyntaxHighlighter, SyntaxHighlighterProps } from "./SyntaxHighlighter";

const xmlCode = `<note>
<to city="Colombo">User</to>
<from>WSO2</from>
<heading>Reminder</heading>
<body>Don't forget to subscribe!</body>
</note>`;

const jsonCode = '{"name":"John", "age":30, "car":null}';
const javaScriptCode = `function add(a, b) {
    // This is a comment
    return a + b;
}`;
const cssCode = `body {
    background-color: lightblue;
}`;
const htmlCode = `<!DOCTYPE html>
<html>
<body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
</body>
</html>`;

const Template: ComponentStory<typeof SyntaxHighlighter> = (args: SyntaxHighlighterProps) => <SyntaxHighlighter {...args} />;

export const SampleXML = Template.bind();
SampleXML.args = { code: xmlCode, language: "xml" };

export const SampleJSON = Template.bind();
SampleJSON.args = { code: jsonCode, language: "json" };

export const SampleJS = Template.bind();
SampleJS.args = { code: javaScriptCode, language: "javascript" };

export const SampleCSS = Template.bind();
SampleCSS.args = { code: cssCode, language: "css" };

export const SampleHTML = Template.bind();
SampleHTML.args = { code: htmlCode, language: "html" };

export default { component: SyntaxHighlighter, title: "Syntax Highlighter" };
