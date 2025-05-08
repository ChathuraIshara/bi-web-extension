/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactNode } from "react";
import { useIntl } from "react-intl";

import { FormHelperText } from "@material-ui/core";
import * as MonacoEditor from 'monaco-editor';

import { ErrorSvg } from "../../assets";
import { useStyles as useFormStyles } from "../../themes/DynamicConnectorForm/style";

import { truncateText } from "./utils";

export enum HintType {
    ADD_CHECK,
    ADD_DOUBLE_QUOTES,
    ADD_BACK_TICKS,
    ADD_DOUBLE_QUOTES_EMPTY,
    ADD_BACK_TICKS_EMPTY,
    ADD_TO_STRING,
    ADD_ELVIS_OPERATOR,
    SUGGEST_CAST,
    CONFIGURABLE,
}

export interface ExpressionEditorHintProps {
    onClickHere: () => void;
    type: HintType;
    editorContent?: string;
    expressionType?: string;
}

export function ExpressionEditorHint(props: ExpressionEditorHintProps) {
    const { type, onClickHere, editorContent, expressionType } = props;

    const formClasses = useFormStyles();
    const intl = useIntl();

    const clickHereText = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.clickHere.text",
        defaultMessage: "Click here"
    })

    const expressionHasError = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.expressionError.errorMessage",
        defaultMessage: "This expression could cause an error. "
    })

    const toHandleItText = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.toHandleIt.text",
        defaultMessage: " to handle it"
    })

    const addDoubleQuotes = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.addDoubleQuotes.text",
        defaultMessage: " to change to "
    })

    const addBackTicks = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.addBackTicks.text",
        defaultMessage: " to change to "
    })

    const addDoubleQuotesToEmptyExpr = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.addDoubleQuotesToEmptyExpr.text",
        defaultMessage: " to make an empty string"
    })

    const addBackTicksToEmptyExpr = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.addBackTicksToEmptyExpr.text",
        defaultMessage: " to make an empty query"
    })

    const addToString = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.addToString.text",
        defaultMessage: " to make a string using "
    })

    const codeSnippetToString = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.codeSnippetToString.text",
        defaultMessage: "toString()"
    })

    const addElvisOperator = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.addElvisOperator.text",
        defaultMessage: " to handle the optional value"
    })

    const suggetCast = intl.formatMessage({
        id: "lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage.suggetCast.text",
        defaultMessage: " to convert to "
    })

    let component: ReactNode;
    switch (type) {
        case HintType.ADD_CHECK: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {expressionHasError}
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {toHandleItText}
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.ADD_DOUBLE_QUOTES: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {addDoubleQuotes}
                        <CodeSnippet content={`"${truncateText(editorContent)}"`} />
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.ADD_DOUBLE_QUOTES_EMPTY: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {addDoubleQuotesToEmptyExpr}
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.ADD_BACK_TICKS: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {addBackTicks}
                        <CodeSnippet content={`\`${truncateText(editorContent)}\``} />
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.ADD_BACK_TICKS_EMPTY: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {addBackTicksToEmptyExpr}
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.ADD_TO_STRING: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {addToString}
                        <CodeSnippet content={codeSnippetToString} />
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.ADD_ELVIS_OPERATOR: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {addElvisOperator}
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.SUGGEST_CAST: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <img className={formClasses.suggestionsIcon} src={ErrorSvg} />
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextError} onClick={onClickHere}>{clickHereText} </a>}
                        {suggetCast}
                        <CodeSnippet content={expressionType} />
                    </FormHelperText>
                </div>
            )
            break;
        }
        case HintType.CONFIGURABLE: {
            component = (
                <div className={formClasses.suggestionsWrapper} >
                    <FormHelperText className={formClasses.suggestionsText}>
                        {<a className={formClasses.suggestionsTextInfo} onClick={onClickHere}>{clickHereText} </a>}
                        {editorContent}
                        <CodeSnippet content={'configurable'} />
                    </FormHelperText>
                </div>
            )
            break;
        }
        default: {
            component = null
            break;
        }
    }

    return (
        <>
            {component}
        </>
    )
}

function CodeSnippet(props: { content: string }) {
    const { content } = props;
    const formClasses = useFormStyles();

    const codeRef = (ref: HTMLPreElement) => {
        if (ref) {
            MonacoEditor.editor.colorizeElement(ref, { theme: 'exp-theme' });
        }
    };

    const Code = () => (
        <code ref={codeRef} data-lang="ballerina" className={formClasses.suggestionsTextCodeSnippet} >
            {content}
        </code>
    )
    return (
        <pre className={formClasses.pre}>
            {content && <Code/>}
        </pre>
    )
}
