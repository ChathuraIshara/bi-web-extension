/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: no-empty jsx-no-multiline-js
import React, { useState } from 'react';

export interface InputEditorCtx {
    userInput: string,
    suggestionInput: string,
    onInputChange: (value: string) => void,
    onSuggestionSelection: (value: string) => void
}

export const InputEditorContext = React.createContext<InputEditorCtx>({
    userInput: "",
    suggestionInput: "",
    onInputChange: (value: string) => {},
    onSuggestionSelection: (value: string) => {}
});

export const InputEditorContextProvider: React.FC = (props) => {
    const [userInput, setUserInput] = useState("");
    const [suggestionInput, setSuggestionInput] = useState("");

    const onInputChange = (value: string) => {
        setUserInput(value);
    };

    const onSuggestionSelection = (value: string) => {
        setSuggestionInput(value);
    };

    return (
        <InputEditorContext.Provider
            value={{
                userInput,
                onInputChange,
                suggestionInput,
                onSuggestionSelection
            }}
        >
            {props.children}
        </InputEditorContext.Provider>
    );
};
