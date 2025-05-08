import React, { useState } from "react";
import { ComponentStory } from "@storybook/react";
import { PromptTextField, PromptTextFieldProps } from "./PromptTextField";

const Template: ComponentStory<typeof PromptTextField> = (args: PromptTextFieldProps) => {
    const [value, setValue] = useState("");

    return (
        <PromptTextField
            {...args}
            ref={undefined}
            value={value}
            onTextChange={text => {
                setValue(text);
                console.log("Text changed:", text);
            }}
            onEnter={text => {
                console.log("Enter pressed:", text);
            }}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    label: "Prompt",
    placeholder: "Type your prompt here...",
    description: "Press Enter to submit, Ctrl+Enter for new line",
    required: true,
    autoFocus: true,
};

export const WithError = Template.bind({});
WithError.args = {
    label: "Prompt with Error",
    placeholder: "Type your prompt here...",
    description: "Press Enter to submit, Ctrl+Enter for new line",
    errorMsg: "This field is required",
    required: true,
};

export default {
    component: PromptTextField,
    title: "PromptTextField",
};
