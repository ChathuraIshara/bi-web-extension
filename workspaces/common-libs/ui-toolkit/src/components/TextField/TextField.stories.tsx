/*
 *  Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 *  This software is the property of WSO2 LLC. and its suppliers, if any.
 *  Dissemination of any information or reproduction of any material contained
 *  herein is strictly forbidden, unless permitted by WSO2 in accordance with
 *  the WSO2 Commercial License available at http://wso2.com/licenses.
 *  For specific language governing the permissions and limitations under
 *  this license, please see the license as well as any agreement you’ve
 *  entered into with WSO2 governing the purchase of this software and any
 *  associated services.
 */
import React from "react";
import { ComponentStory } from "@storybook/react";
import { TextField, TextFieldProps } from "./TextField";
import { Codicon } from "../Codicon/Codicon";
import { Icon } from "../Icon/Icon";

const labelAdornment = (
    <div style={{display: "flex", justifyContent: "flex-end", flexGrow: 1}}>
        <Icon isCodicon name="plus"/>
    </div>
)

const Template: ComponentStory<typeof TextField> = (args: TextFieldProps) => <TextField {...args} ref={undefined}/>;

export const TextFieldWithError = Template.bind();
TextFieldWithError.args = { value: "Sample Text", label: "TextField", errorMsg: "Test Error", description: "This is a sample text field component", autoFocus: true, placeholder: "placeholder", onTextChange: (txt: string) => {console.log("Text Changed: ", txt)} };

export const RequiredTextFieldWithError = Template.bind();
RequiredTextFieldWithError.args = { value: "Sample Text", label: "TextField", errorMsg: "Test Error", required: true, placeholder: "placeholder", onChange: null };

export const TextFieldWithoutLabel = Template.bind();
TextFieldWithoutLabel.args = { value: "Sample Text", errorMsg: "Test Error", required: true, placeholder: "placeholder", onChange: null };

const searchIcon = (<Codicon name="search" sx= {{cursor: "auto"}}/>)
export const TextFieldWithIcon = Template.bind();
TextFieldWithIcon.args = { value: "Sample Text", icon: {iconComponent: searchIcon, position: "end"}, placeholder: "Search", onChange: null };

export const TextFieldWithAutoFoucus = Template.bind();
TextFieldWithAutoFoucus.args = { label: "TextField", autoFocus: true, placeholder: "placeholder", onChange: null };
const clickableIcon = (<Codicon name="edit" sx= {{cursor: "pointer"}}/>)

export const TextFieldWithClickableIcon = Template.bind();
TextFieldWithClickableIcon.args = { value: "Sample Text", icon: {iconComponent: clickableIcon, position: "end", onClick: () => {console.log("Icon clicked")}}, placeholder: "Search", onChange: null };

export const TextFieldWithCustomDescription = Template.bind();
TextFieldWithCustomDescription.args = { value: "Sample Text", label: "TextField", errorMsg: "Test Error", description: (
    <div style={{display: "flex", flexDirection: "row"}}>
        <div>Custom Description with a Link</div>
        <div style={{color: "var(--vscode-button-background)", marginLeft: 4}}>Click Here</div>
    </div>
), autoFocus: true, placeholder: "placeholder", onTextChange: (txt: string) => {console.log("Text Changed: ", txt)} };

export const TextFieldWithAdornments = Template.bind();
TextFieldWithAdornments.args = { value: "Sample Text", inputProps: {startAdornment: (<button>S</button>), endAdornment: (<button>E</button>) }, placeholder: "Search", onChange: null };

export const TextFieldWithLabelAdornment = Template.bind();
TextFieldWithLabelAdornment.args = { value: "Sample Text", label: "TextField", errorMsg: "Test Error", description: "This is a sample text field component", autoFocus: true, placeholder: "placeholder", labelAdornment: labelAdornment, onTextChange: (txt: string) => {console.log("Text Changed: ", txt)} };

export default { component: TextField, title: "TextField" };
