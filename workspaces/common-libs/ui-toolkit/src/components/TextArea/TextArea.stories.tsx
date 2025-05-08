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
import { TextArea, TextAreaProps } from "./TextArea";

const Template: ComponentStory<typeof TextArea> = (args: TextAreaProps) => <TextArea {...args} ref={undefined} />;

export const TextAreaWithError = Template.bind();
TextAreaWithError.args = { value: "Sample Text", label: "TextField", errorMsg: "Test Error", autoFocus: true, placeholder: "placeholder", onTextChange: (txt: string) => {console.log("Text Changed: ", txt)} };

export const RequiredTextAreaWithError = Template.bind();
RequiredTextAreaWithError.args = { value: "Sample Text", label: "TextField", errorMsg: "Test Error", required: true, placeholder: "placeholder", onChange: null };

export const TextAreaWithoutLabel = Template.bind();
TextAreaWithoutLabel.args = { value: "Sample Text", required: true, placeholder: "placeholder", onChange: null };

export default { component: TextArea, title: "TextArea" };
