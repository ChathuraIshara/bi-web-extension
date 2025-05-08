/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useEffect, useMemo, useState } from "react";

import { STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import { ClickAwayListener } from "@wso2-enterprise/ui-toolkit";
import debounce from "lodash.debounce";

import { CALL_CONFIG_TYPE, DEFAULT_INTERMEDIATE_CLAUSE, FUNCTION_CALL, PARAM_CONSTRUCTOR } from "../../constants";
import { InputEditorContext } from "../../store/input-editor-context";
import { StatementEditorContext } from "../../store/statement-editor-context";
import { getFunctionParamPlaceholders, isPositionsEquals } from "../../utils";
import { EXPR_PLACEHOLDER, FUNCTION_CALL_PLACEHOLDER, STMT_PLACEHOLDER, TYPE_DESC_PLACEHOLDER } from "../../utils/expressions";
import { ModelType, StatementEditorViewState } from "../../utils/statement-editor-viewstate";
import { useStatementRendererStyles } from "../styles";

import {
    INPUT_EDITOR_PLACEHOLDERS
} from "./constants";

export interface InputEditorProps {
    model?: STNode;
    classNames?: string;
    notEditable?: boolean;
}

export function InputEditor(props: InputEditorProps) {

    const { model, classNames, notEditable } = props;

    const {
        modelCtx: {
            initialSource,
            statementModel,
            updateModel,
            handleChange,
            hasSyntaxDiagnostics,
            updateSyntaxDiagnostics,
            currentModel,
            updateEditing
        },
        targetPosition,
        config,
        isExpressionMode
    } = useContext(StatementEditorContext);

    const inputEditorCtx = useContext(InputEditorContext);

    const statementRendererClasses = useStatementRendererStyles();

    const originalValue = React.useMemo(() => {
        let source: string;

        if (!model) {
            source = initialSource ? initialSource : '';
        } else if (model?.value) {
            source = model.value;
        } else if (model.source === FUNCTION_CALL && STKindChecker.isFunctionCall(model)) {
            source = model.functionName.source;
        } else {
            source = model.source;
        }

        // Remove comments in statements
        const lines = source.split('\n');
        source = lines.filter((line) => !line.trim().startsWith('//')).join('\n');

        inputEditorCtx.onInputChange(source.trim());
        return source.trim();
    }, [model]);

    const [isEditing, setIsEditing] = useState(false);
    const [userInput, setUserInput] = useState<string>(originalValue);
    const [prevUserInput, setPrevUserInput] = useState<string>(userInput);

    const placeHolder = useMemo(() => {
        const trimmedInput = !!userInput ?
                                (config.type === CALL_CONFIG_TYPE && userInput === FUNCTION_CALL) ? FUNCTION_CALL_PLACEHOLDER :
                                    userInput.trim() :
                                EXPR_PLACEHOLDER;
        const isFunctionParam = trimmedInput.substring(0, 10) === PARAM_CONSTRUCTOR;
        if (statementModel && (INPUT_EDITOR_PLACEHOLDERS.has(trimmedInput) || isFunctionParam)) {
            if (isPositionsEquals(statementModel.position, model.position) && !isExpressionMode) {
                // override the placeholder when the statement is empty
                return INPUT_EDITOR_PLACEHOLDERS.get(STMT_PLACEHOLDER);
            } else {
                if (isFunctionParam) {
                    return getFunctionParamPlaceholders(trimmedInput);
                }
                return INPUT_EDITOR_PLACEHOLDERS.get(trimmedInput);
            }
        } else {
            return trimmedInput;
        }
    }, [userInput]);

    useEffect(() => {
        setUserInput(originalValue);
    }, [originalValue]);

    useEffect(() => {
        if (currentModel.model && isPositionsEquals(currentModel.model.position, model.position)){
            setIsEditing(currentModel.isEntered ? currentModel.isEntered : false);
        }
    }, [currentModel]);

    useEffect(() => {
        if (userInput === '') {
            setIsEditing(true);
        }
    }, [userInput]);

    useEffect(() => {
        const suggestion = inputEditorCtx.suggestionInput
        if (hasSyntaxDiagnostics) {
            setIsEditing(false);
            if (currentModel.model === model && suggestion) {
                setUserInput(suggestion);
            } else if (currentModel.model && STKindChecker.isFunctionCall(currentModel.model)
                        && currentModel.model.functionName === model && suggestion) {
                setUserInput(suggestion);
            }
        } else {
            setUserInput(originalValue)
        }
    }, [hasSyntaxDiagnostics]);

    useEffect(() => {
        updateEditing(isEditing);
    }, [isEditing]);

    const inputEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === "Tab") {
            handleEditEnd();
        } else if (event.key === "Escape") {
            setIsEditing(false);
            // reset input editor value to original value
            changeInput(prevUserInput);
        }
    };

    const clickAwayHandler = (event: any) => {
        const path = event?.path || (event?.composedPath && event?.composedPath());
        if (path && !path[0].className.includes("suggestion")){
            handleEditEnd();
        }
        setIsEditing(false);
    };


    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeInput(event.target.value);
    };

    const changeInput = (newValue: string) => {
        let input = newValue;
        if (!newValue) {
            if (isPositionsEquals(statementModel.position, model.position)) {
                // placeholder for empty custom statements
                input = STMT_PLACEHOLDER;
            } else {
                input = (model.viewState as StatementEditorViewState).modelType === ModelType.TYPE_DESCRIPTOR
                    ? TYPE_DESC_PLACEHOLDER : EXPR_PLACEHOLDER;
            }
        }
        setUserInput(input);
        inputEditorCtx.onInputChange(input);
        inputEditorCtx.onSuggestionSelection('');
        debouncedContentChange(newValue, true);
    }

    const debouncedContentChange = debounce(handleChange, 500);

    const handleDoubleClick = () => {
        if (!notEditable && !hasSyntaxDiagnostics) {
            setIsEditing(true);
        } else if (!notEditable && hasSyntaxDiagnostics && (currentModel.model === model)) {
            setIsEditing(true);
        }
    };

    const handleEditEnd = () => {
        setPrevUserInput(userInput);
        if (userInput !== "") {
            // Check syntax diagnostics
            let isIncorrectSyntax = false;
            const semicolonRegex = new RegExp('(;)(?=(?:[^"]|"[^"]*")*$)');
            if (model && userInput.includes(";") && !STKindChecker.isLocalVarDecl(model) && !STKindChecker.isReturnStatement(model)) {
                isIncorrectSyntax = semicolonRegex.test(userInput);
            }
            if (isIncorrectSyntax) {
                updateSyntaxDiagnostics(true);
            } else {
                setUserInput(userInput);
                const input = (userInput === FUNCTION_CALL_PLACEHOLDER && config.type === CALL_CONFIG_TYPE) ?
                    FUNCTION_CALL : userInput;
                // Replace empty interpolation with placeholder value
                const codeSnippet = input.replaceAll('${}', "${" + EXPR_PLACEHOLDER + "}");
                originalValue === DEFAULT_INTERMEDIATE_CLAUSE ? updateModel(codeSnippet, model ? model.parent.parent.position : targetPosition) :
                updateModel(codeSnippet, model ? model.position : targetPosition);
            }
        }
        setIsEditing(false);
    }

    return isEditing ?
        (
            <ClickAwayListener onClickAway={clickAwayHandler}>
                <input
                    data-testid="input-editor"
                    value={INPUT_EDITOR_PLACEHOLDERS.has(userInput) || userInput.substring(0, 10) === PARAM_CONSTRUCTOR ? "" : userInput}
                    className={statementRendererClasses.inputEditorEditingState + ' ' + classNames}
                    onKeyDown={inputEnterHandler}
                    onInput={inputChangeHandler}
                    size={userInput.length}
                    autoFocus={true}
                    style={{ maxWidth: userInput === '' ? '10px' : 'fit-content' }}
                    spellCheck="false"
                />
            </ClickAwayListener>
        ) : (
            <span
                data-testid="input-editor-span"
                className={statementRendererClasses.inputEditorTemplate + ' ' + classNames}
                onDoubleClick={handleDoubleClick}
            >
                {placeHolder}
            </span>
        );
}
