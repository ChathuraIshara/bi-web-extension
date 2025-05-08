/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";

import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";

import { useStmtEditorHelperPanelStyles } from "../../styles";

interface NamedArgIncludedRecordProps {
    isNewRecord: boolean
    addIncludedRecordToModel: (userInput: string) => void
}
// tslint:disable: jsx-no-multiline-js
export function NamedArgIncludedRecord(props: NamedArgIncludedRecordProps){
    const stmtEditorHelperClasses = useStmtEditorHelperPanelStyles();
    const {isNewRecord, addIncludedRecordToModel} = props;
    const defaultNamedArg = "NamedArg";
    const [userInput, setUserInput] = useState<string>(defaultNamedArg);


    const inputEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addIncludedRecordToModel(userInput);
        }
    };

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    return (
        <>
            {isNewRecord && (
                <div className={stmtEditorHelperClasses.docListDefault} data-testid="named-arg">
                    <VSCodeCheckbox
                        checked={true}
                    />
                    <input
                        placeholder={defaultNamedArg}
                        autoFocus={true}
                        onKeyDown={inputEnterHandler}
                        onInput={inputChangeHandler}
                        style={{ padding: '8px'}}
                        data-testid="named-arg-input"
                    />
                </div>
            )}
        </>
    );
}
