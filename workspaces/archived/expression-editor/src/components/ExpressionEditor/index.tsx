/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-empty jsx-curly-spacing
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";

import { FormHelperText, LinearProgress } from "@material-ui/core";
import {
    CompletionParams,
    configurableTypes,
    DiagramDiagnostic,
    ExpressionEditorLangClientInterface,
    ExpressionEditorState,
    ExpressionInjectablesProps,
    FormElementProps,
    getDiagnosticMessage,
    getFilteredDiagnostics,
    getSelectedDiagnostics,
    PrimitiveBalType
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    TooltipCodeSnippet
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";
import debounce from "lodash.debounce";
import * as monaco from "monaco-editor";
import { Diagnostic } from "vscode-languageserver-protocol";

import grammar from "../../ballerina.monarch.json";
import { useStyles as useFormStyles } from "../../themes";
import { ExpressionEditorHint, ExpressionEditorHintProps } from "../ExpressionEditorHint";
import { ExpressionEditorLabel } from "../ExpressionEditorLabel";

import {
    acceptedKind,
    COLLAPSE_WIDGET_ID,
    CONFIGURABLE_WIDGET_ID,
    DIAGNOSTIC_MAX_LENGTH,
    EDITOR_MAXIMUM_CHARACTERS,
    EXPAND_EDITOR_MAXIMUM_CHARACTERS,
    EXPAND_WIDGET_ID,
    EXPR_SCHEME,
    FILE_SCHEME,
    TRIGGER_CHARACTERS,
} from "./constants";
import "./style.scss";
import {
    addImportModuleToCode,
    addInjectables,
    addToTargetLine,
    addToTargetPosition,
    createContentWidget,
    createSortText,
    customErrorMessage,
    diagnosticCheckerExp,
    diagnosticInRange,
    getHints,
    getInitialDiagnosticMessage,
    getInitialValue,
    getRandomInt,
    getStandardExpCompletions,
    getTargetPosition,
    getValueWithoutSemiColon,
    transformFormFieldTypeToString,
    truncateDiagnosticMsg,
} from "./utils";

const DEBOUNCE_DELAY = 1000;

const MONACO_OPTIONS: monaco.editor.IEditorConstructionOptions = {
    scrollbar: {
        vertical: "hidden",
        horizontal: "hidden",
    },
    overviewRulerLanes: 0,
    autoIndent: "full",
    automaticLayout: true,
    contextmenu: true,
    lineNumbers: "off",
    fontFamily: '"Droid Sans Mono", Monaco, monospace',
    fontSize: 12,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    renderLineHighlight: "none",
    minimap: {
        enabled: false,
    },
    readOnly: false,
    glyphMargin: false,
    wordWrap: "off",
    lineNumbersMinChars: 0,
    overviewRulerBorder: false,
    lineDecorationsWidth: 0,
    folding: false,
    scrollBeyondLastLine: false,
    scrollBeyondLastColumn: 0,
    find: { addExtraSpaceOnTop: false, autoFindInSelection: "never", seedSearchStringFromSelection: false },
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    autoClosingOvertype: "always",
    hover: {
        enabled: false,
    },
};

monaco.editor.defineTheme("exp-theme", {
    base: "vs",
    inherit: true,
    rules: [
        { token: "", foreground: "#8D91A3" },
        { token: "keyword", foreground: "#0095FF" },
        { token: "entity.name.function", foreground: "#8D91A3" },
        { token: "variable.parameter", foreground: "#8D91A3" },
        { token: "type", foreground: "#05A26B" },
        { token: "string", foreground: "#FF9D52" },
        { token: "keyword.operator", foreground: "#0095FF" },
    ],
    colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#8D91A3",
        "editor.errorForeground": "#EA4C4D",
        "editorCursor.foreground": "#3C4141",
        "editor.lineHighlightBackground": "#FFFFFF",
        "editorLineNumber.foreground": "#8D91A3",
        "editor.selectionBackground": "#D0E5FD",
        "editor.inactiveSelectionBackground": "#FFFFFF",
        "peekViewEditor.background": "#333",
        "editorGutter.background": "#F7F8FB",
        "editor.wordHighlightBackground": "#333333",
        "editorLineNumber.activeForeground": "#FFFFFF",
        "editorLineNumber.activeBackground": "#5567d5",
    },
});

const BALLERINA_EXPR = "ballerina-exp";

export interface ExpressionEditorCustomTemplate {
    defaultCodeSnippet: string;
    targetColumn: number;
}

export interface GetExpCompletionsParams {
    getExpressionEditorLangClient: (url: string) => Promise<ExpressionEditorLangClientInterface>;
    langServerURL: string;
    completionParams: CompletionParams;
    model: any; // FIXME: Assign proper type once model prop in exp editor has been updated,
    monacoRef: React.MutableRefObject<MonacoEditor>;
    varType: string;
    varName: string;
    snippetTargetPosition: number;
    disableFiltering?: boolean;
    targetPosition?: NodePosition;
}

export interface ExpressionEditorProps {
    validate?: (field: string, isInvalid: boolean, isEmpty: boolean, canIgnore?: boolean) => void;
    clearInput?: boolean;
    tooltipTitle?: any;
    tooltipActionText?: string;
    tooltipActionLink?: string;
    interactive?: boolean;
    focus?: boolean;
    revertFocus?: () => void;
    statementType?: PrimitiveBalType | any;
    customTemplate?: ExpressionEditorCustomTemplate;
    expandDefault?: boolean;
    revertClearInput?: () => void;
    onFocus?: (value: string) => void;
    hideTextLabel?: boolean;
    changed?: boolean | string;
    subEditor?: boolean;
    editPosition?: any;
    expressionInjectables?: ExpressionInjectablesProps;
    hideSuggestions?: boolean;
    hideExpand?: boolean;
    getCompletions?: (completionProps: GetExpCompletionsParams) => Promise<monaco.languages.CompletionList>;
    showHints?: boolean;
    disabled?: boolean;
    hideTypeLabel?: boolean;
    enterKeyPressed?: (value: string) => void;
    initialDiagnostics?: DiagramDiagnostic[];
    diagnosticsFilterExtraColumns?: {
        start?: number;
        end?: number;
    };
    diagnosticsFilterExtraRows?: {
        start?: number;
        end?: number;
    };
    disableFiltering?: boolean;
    customTemplateVarName?: string;
}

export function ExpressionEditor(props: FormElementProps<ExpressionEditorProps>) {

    const [expressionEditorState, setExpressionEditorState] = useState<ExpressionEditorState>({
        name: undefined,
        content: undefined,
        uri: undefined,
        diagnostic: [],
        isFirstSelect: true
    });

    const [disposableTriggers] = useState([]);

    const { index, defaultValue, model, onChange, customProps,
            expressionConfigurable : ExpressionConfigurable,
            targetPositionDraft,
            currentFile,
            langServerURL,
            syntaxTree,
            mainDiagnostics, // FIXME: REMOVE mainDiagnostics as it doesn't seem to be used anymore
            getExpressionEditorLangClient,
            lowCodeResourcesVersion
        } = props;
    const {
        validate,
        statementType,
        customTemplate,
        focus,
        expandDefault,
        clearInput,
        revertClearInput,
        changed,
        subEditor,
        editPosition,
        expressionInjectables,
        hideSuggestions,
        hideExpand,
        getCompletions = getStandardExpCompletions,
        showHints = true,
        disabled,
        enterKeyPressed,
        onFocus,
        initialDiagnostics = [],
        diagnosticsFilterExtraColumns,
        diagnosticsFilterExtraRows,
        disableFiltering,
        customTemplateVarName
    } = customProps;

    (self as any).MonacoEnvironment = {
        getWorkerUrl: () =>
            `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            importScripts('https://choreo-shared-codeserver-cdne.azureedge.net/ballerina-low-code-resources@${lowCodeResourcesVersion}/jslibs/editor.worker.js');`)}`
    };

    const targetPosition = getTargetPosition(editPosition || targetPositionDraft, syntaxTree);
    const [invalidSourceCode, setInvalidSourceCode] = useState(false);
    const [expand, setExpand] = useState(expandDefault || false);
    const [superExpand, setSuperExpand] = useState(false);
    const [cursorOnEditor, setCursorOnEditor] = useState(false);

    const textLabel = model?.displayAnnotation?.label || model?.name || model.typeName;
    const varName = customTemplateVarName ? customTemplateVarName : "temp_" + textLabel.replace(/[^A-Z0-9]+/gi, "");
    const varType = transformFormFieldTypeToString(model);
    const initalValue = getInitialValue(defaultValue, model);
    const defaultCodeSnippet = customTemplate ? customTemplate.defaultCodeSnippet || "" : varType + " " + varName + " = ;";
    const snippetTargetPosition = customTemplate?.targetColumn || defaultCodeSnippet.length;
    const isCustomTemplate = !!customTemplate;
    const formClasses = useFormStyles();
    const monacoRef: React.MutableRefObject<MonacoEditor> = React.useRef<MonacoEditor>(null);
    const [hints, setHints] = useState<ExpressionEditorHintProps[]>([]);
    const [validating, setValidating] = useState<boolean>(false);
    const [showConfigurableView, setShowConfigurableView] = useState(false);
    const [expressionDiagnosticMsg, setExpressionDiagnosticMsg] = useState(getInitialDiagnosticMessage(initialDiagnostics));
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Configurable insertion icon will be displayed only when originalValue is empty
    const [originalValue, setOriginalValue] = useState(model?.value || "");
    const isEmpty = (model.value ?? "") === "";
    const canIgnore = (model.optional || model.defaultable) ?? false;

    const validExpEditor = () => {
        const monacoModel = monacoRef.current?.editor?.getModel();
        const monacoValue = monacoModel?.getValue();
        validate(model.name, canIgnore ? false : monacoValue?.length === 0, isEmpty, canIgnore);
        setValidating(false);
        if (monacoRef.current) {
            monaco.editor.setModelMarkers(monacoModel, "expression editor", []);
            setExpressionDiagnosticMsg("");
        }
    };

    const notValidExpEditor = (message: string, updateState: boolean = true) => {
        const currentContent = monacoRef.current ? monacoRef.current?.editor?.getModel()?.getValue() : model.value;
        if (model.optional === true && (currentContent === undefined || currentContent === "") && !invalidSourceCode) {
            validExpEditor();
        } else {
            validate(model.name, true, isEmpty, canIgnore);
            setExpressionDiagnosticMsg(message);
            setValidating(false);
            setHints(
                getHints(
                    expressionEditorState.diagnostic,
                    varType,
                    varName,
                    monacoRef,
                    targetPosition,
                    snippetTargetPosition,
                    diagnosticsFilterExtraColumns?.start,
                    diagnosticsFilterExtraColumns?.end,
                    diagnosticsFilterExtraRows?.start,
                    diagnosticsFilterExtraRows?.end,
                )
            );
            if (monacoRef.current) {
                if (updateState) {
                    monaco.editor.setModelMarkers(monacoRef.current.editor.getModel(), "expression editor", [
                        {
                            startLineNumber: 1,
                            startColumn: 1,
                            endLineNumber: 2,
                            endColumn: 1000,
                            message,
                            severity: monaco.MarkerSeverity.Error,
                        },
                    ]);
                    setExpressionEditorState({
                        ...expressionEditorState,
                        diagnostic: [
                            {
                                message,
                                code: "",
                                range: {
                                    start: { line: 1, character: 1 },
                                    end: { line: 2, character: 1000 },
                                },
                            },
                        ],
                    });
                } else {
                    const inputLength = typeof model?.value === "string" ? model?.value?.length : monacoRef.current.editor.getPosition().column - 1;
                    const diagnostics = getSelectedDiagnostics(
                        expressionEditorState.diagnostic,
                        targetPosition,
                        snippetTargetPosition,
                        inputLength,
                        diagnosticsFilterExtraColumns?.start,
                        diagnosticsFilterExtraColumns?.end
                    );

                    monaco.editor.setModelMarkers(
                        monacoRef.current.editor.getModel(),
                        "expression editor",
                        diagnostics.map((diagnostic: Diagnostic) => ({
                            startLineNumber: 1,
                            startColumn: diagnostic.range.start.character - snippetTargetPosition + 2,
                            endLineNumber: 1,
                            endColumn: diagnostic.range.end.character - snippetTargetPosition + 2,
                            message,
                            severity: monaco.MarkerSeverity.Error,
                        }))
                    );
                }
            }
        }
    };

    // FIXME: Uncomment this once the ballerinaSymbol/type request is enabled in LS
    // const handleTypeInfo = (typeInfo: string[]) => {
    //     if (typeInfo && typeInfo.length > 1 && typeInfo.includes("error")) {
    //         // expression can resolve to an error
    //         setAddCheck(true)
    //     } else {
    //         setAddCheck(false)
    //     }
    // }

    const handleDiagnostic = () => {
        if (invalidSourceCode) {
            notValidExpEditor("Code has errors, please fix them first.");
        } else if (expressionEditorState?.name === model.name) {
            if (!expressionEditorState.diagnostic) {
                return;
            } else if (monacoRef.current) {
                const inputLength = typeof model?.value === "string" ? model?.value?.length : monacoRef.current.editor.getPosition().column - 1;
                const diagnosticMsg = getDiagnosticMessage(
                    expressionEditorState.diagnostic,
                    targetPosition,
                    snippetTargetPosition,
                    inputLength,
                    diagnosticsFilterExtraColumns?.start,
                    diagnosticsFilterExtraColumns?.end,
                    diagnosticsFilterExtraRows?.start,
                    diagnosticsFilterExtraRows?.end,
                );
                if (diagnosticMsg) {
                    notValidExpEditor(diagnosticMsg, false);
                } else if (customErrorMessage(expressionEditorState.diagnostic)) {
                    return;
                } else {
                    // FIXME: Fix this function getting called when expression editor mount
                    validExpEditor();
                }
            }
        }
    };

    const disposeAllTriggers = () => {
        while (disposableTriggers.length > 0) {
            const disposable: monaco.IDisposable = disposableTriggers.pop();
            disposable.dispose();
        }
    };

    const setDefaultTooltips = () => {
        // add default tooltip if not given by explicitly
        if (textLabel && model && !(customProps?.tooltipTitle || model?.tooltip) && model?.description) {
            model.tooltip = model.description.substring(model.description.indexOf("-") + 1).trim();
        }
    };

    useEffect(() => {
        disposeAllTriggers();

        if (monacoRef.current) {
            const monacoModel = monacoRef.current.editor.getModel();
            // event emitted when the text inside this editor gained focus (i.e. cursor starts blinking)
            disposableTriggers.push(
                monacoRef.current.editor.onDidFocusEditorText(async () => {
                    setCursorOnEditor(true);
                    handleOnFocus(monacoModel.getValue(), monacoModel.getEOL());
                })
            );

            // event emitted when the content of the editor has changed
            disposableTriggers.push(
                monacoRef.current.editor.onDidChangeModelContent((event: monaco.editor.IModelContentChangedEvent) => {
                    const lastPressedKey = event.changes && event.changes.length > 0 && event.changes[0].text;
                    setValidating(true);

                    if (monacoModel.getValue().includes(monacoModel.getEOL())) {
                        // Trim EOL chars onPasteEvent
                        const trimmedContent = monacoModel.getValue().replace(monacoModel.getEOL(), "");
                        monacoModel.setValue(trimmedContent);
                        return;
                    }

                    debouncedContentChange(monacoModel.getValue(), monacoModel.getEOL(), lastPressedKey);
                })
            );

            // event emitted when the text inside this editor lost focus (i.e. cursor stops blinking)
            disposableTriggers.push(
                monacoRef.current.editor.onDidBlurEditorText(() => {
                    handleOnOutFocus();
                })
            );

            // completion of expression Editor
            disposableTriggers.push(
                monaco.languages.registerCompletionItemProvider(BALLERINA_EXPR, {
                    provideCompletionItems(): monaco.Thenable<monaco.languages.CompletionList> {
                        if (monacoRef.current.editor.hasTextFocus()) {
                            const completionParams: CompletionParams = {
                                textDocument: { uri: expressionEditorState?.uri },
                                context: { triggerKind: 1 },
                                position: {
                                    character: targetPosition.startColumn + monacoRef.current.editor.getPosition().column - 1 + (snippetTargetPosition - 1),
                                    line: targetPosition.startLine,
                                },
                            };

                            return getCompletions({
                                getExpressionEditorLangClient,
                                langServerURL,
                                completionParams,
                                model,
                                monacoRef,
                                varType,
                                varName,
                                snippetTargetPosition,
                                disableFiltering,
                                targetPosition
                            });
                        }
                    },
                })
            );

            // event emitted when the editor has been disposed
            disposableTriggers.push(
                monacoRef.current.editor.onDidDispose(() => {
                    monaco.editor.setTheme("choreoLightTheme");
                    handleOnOutFocus();
                    disposeAllTriggers();
                })
            );
        }
    }, [statementType, expressionInjectables?.list?.length, customTemplate?.defaultCodeSnippet]);

    useEffect(() => {
        // Revalidate the input, if template has changed
        if (
          customTemplate?.defaultCodeSnippet &&
          monacoRef.current &&
          monacoRef.current.editor.hasTextFocus()
        ) {
          const monacoModel = monacoRef.current.editor.getModel();
          handleContentChange(monacoModel.getValue(), monacoModel.getEOL());
        }
    }, [customTemplate?.defaultCodeSnippet]);

    useEffect(() => {
        // Programmatically focus exp-editor
        if (focus && customProps?.revertFocus) {
            monacoRef.current.editor.focus();
            customProps.revertFocus();
        }
    }, [focus]);

    useEffect(() => {
        if (monacoRef.current && !hideExpand) {
            const expandWidget: monaco.editor.IContentWidget = createContentWidget(EXPAND_WIDGET_ID);
            const collapseWidget: monaco.editor.IContentWidget = createContentWidget(COLLAPSE_WIDGET_ID);

            if (expand) {
                monacoRef.current.editor.updateOptions({ wordWrap: "bounded" });
                monacoRef.current.editor.removeContentWidget(expandWidget);
                monacoRef.current.editor.addContentWidget(collapseWidget);
            } else {
                monacoRef.current.editor.updateOptions({ wordWrap: "off" });
                monacoRef.current.editor.removeContentWidget(collapseWidget);
                monacoRef.current.editor.addContentWidget(expandWidget);
            }
        }
    }, [expand, hideExpand]);

    useEffect(() => {
        if (monacoRef.current) {
            // Show configurable options icon in the expression editor only if following conditions passes
            // - If model type os one of valid configurable types
            // - originalValue is empty (will be empty in create flow, or if user removes the expression during edit flow)
            const configurableWidget: monaco.editor.IContentWidget = createContentWidget(CONFIGURABLE_WIDGET_ID);
            if (configurableTypes.includes(varType) && expressionInjectables && !originalValue) {
                monacoRef.current.editor.addContentWidget(configurableWidget);
            } else {
                monacoRef.current.editor.removeContentWidget(configurableWidget);
            }
        }
    }, [configurableTypes, expressionInjectables, originalValue]);

    useEffect(() => {
        // Programatically clear exp-editor
        if (clearInput && revertClearInput) {
            if (monacoRef.current) {
                const editorModel = monacoRef.current.editor.getModel();
                if (editorModel) {
                    editorModel.setValue("");

                    // update the change of the field
                    model.value = "";
                    if (onChange) {
                        onChange("");
                    }

                    revertClearInput();
                }
            }
        }
    }, [clearInput]);

    useEffect(() => {
        if (monacoRef.current) {
            // FIXME: Need to change the theme when editor is disabled
            monacoRef.current.editor.updateOptions({ readOnly: disabled });
        }
    }, [disabled]);

    useEffect(() => {
        handleDiagnostic();
    }, [expressionEditorState.diagnostic]);

    useEffect(() => {
        if (monacoRef.current && changed !== undefined && initialLoaded) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel && model.value) {
                editorModel.setValue(model.value);
                debouncedValidateAndRevert(model.value, editorModel.getEOL());
            }
        } else if (!initialLoaded) {
            setInitialLoaded(true);
        }
    }, [changed]);

    useEffect(() => {
        if (expandDefault !== undefined) {
            setExpand(expandDefault);
        }
    }, [expandDefault]);

    // Use this function to validate the expression editor from another component. File content will revert after validating
    const validateAndRevert = async (currentContent: string, EOL: string) => {
        let initContent: string = null;
        if (model.optional === true && (currentContent === undefined || currentContent === "")) {
            // No need to send didChange with the template because this is an optional field and empty content is allowed.
            return;
        } else {
            const newCodeSnippet: string = addToTargetPosition(defaultCodeSnippet, snippetTargetPosition - 1, currentContent);
            initContent = addToTargetLine(currentFile.content, targetPosition, newCodeSnippet, EOL);
            initContent = await addInjectables(initContent, expressionInjectables?.list);
            initContent = addImportModuleToCode(initContent, model);
        }

        expressionEditorState.name = model.name;
        expressionEditorState.content = initContent;
        expressionEditorState.uri = monaco.Uri.file(currentFile.path).toString().replace(FILE_SCHEME, EXPR_SCHEME);

        const langClient: ExpressionEditorLangClientInterface = await getExpressionEditorLangClient();
        langClient.didChange({
            contentChanges: [
                {
                    text: expressionEditorState.content
                }
            ],
            textDocument: {
                uri: expressionEditorState.uri,
                version: 1
            }
        });

        const diagResp = await langClient.getDiagnostics({
            documentIdentifier: { uri: expressionEditorState.uri },
        });
        setExpressionEditorState({
            ...expressionEditorState,
            diagnostic: diagResp[0]?.diagnostics ? getFilteredDiagnostics(diagResp[0]?.diagnostics, isCustomTemplate) : [],
        });

        // Revert the file content
        expressionEditorState.content = currentFile.content;

        langClient.didChange({
            contentChanges: [{ text: expressionEditorState.content }],
            textDocument: { uri: expressionEditorState.uri, version: 1 },
        });
    };
    const debouncedValidateAndRevert = debounce(validateAndRevert, DEBOUNCE_DELAY);

    // ExpEditor start
    const handleOnFocus = async (currentContent: string, EOL: string) => {
        let initContent: string = null;
        let newCodeSnippet: string = "";
        // tslint:disable-next-line:prefer-conditional-expression
        if (model.optional === true && (currentContent === undefined || currentContent === "")) {
            // No need to send didChange with the template because this is an optional field and empty content is allowed.
            // Replacing the templates lenght with space char to get the LS completions correctly
            newCodeSnippet = " ".repeat(snippetTargetPosition);
        } else {
            newCodeSnippet = addToTargetPosition(defaultCodeSnippet, snippetTargetPosition - 1, currentContent);
        }

        initContent = addToTargetLine(currentFile.content, targetPosition, newCodeSnippet, EOL);
        initContent = await addInjectables(initContent, expressionInjectables?.list);
        initContent = addImportModuleToCode(initContent, model);

        expressionEditorState.name = model.name;
        expressionEditorState.content = initContent;
        expressionEditorState.uri = monaco.Uri.file(currentFile.path).toString().replace(FILE_SCHEME, EXPR_SCHEME);

        const langClient: ExpressionEditorLangClientInterface = await getExpressionEditorLangClient();
        langClient.didOpen({
            textDocument: {
                uri: expressionEditorState.uri,
                languageId: "ballerina",
                text: currentFile.content,
                version: 1
            }
        });
        langClient.didChange({
            contentChanges: [
                {
                    text: expressionEditorState.content
                }
            ],
            textDocument: {
                uri: expressionEditorState.uri,
                version: 1
            }
        });

        const diagResp = await langClient.getDiagnostics({
            documentIdentifier: { uri: expressionEditorState.uri },
        });
        setExpressionEditorState({
            ...expressionEditorState,
            diagnostic: diagResp[0]?.diagnostics ? getFilteredDiagnostics(diagResp[0]?.diagnostics, isCustomTemplate) : [],
        });

        // FIXME: Uncomment this once the ballerinaSymbol/type request is enabled in LS
        // const offset = varType.length + 1;
        // const resp = await langClient.getType({
        //     documentIdentifier: { uri: expressionEditorState.uri },
        //     position: { line: targetPosition.startLine, offset }
        // })
        // const typeInfo: string[] = (resp as ExpressionTypeResponse).types;
        // handleTypeInfo(typeInfo);

        const lastCharacter = currentContent.length > 0 && currentContent.charAt(currentContent.length - 1);
        if ((currentContent === "" || TRIGGER_CHARACTERS.includes(lastCharacter)) && monacoRef.current.editor.hasTextFocus()) {
            monacoRef.current.editor.trigger("exp_editor", "editor.action.triggerSuggest", {});
        }

        if (onFocus) {
            onFocus(currentContent);
        }
    };

    // ExpEditor onChange
    const handleContentChange = async (currentContent: string, EOL: string, lastPressedKey?: string) => {
        if (onChange) {
            onChange(currentContent);
        }
        // Mark content as valid - if not empty - and set model value directly.
        // Later when the validations from LS side are done,
        // validate callback will be invoked again with actual validity.
        // This is a optimisitc validation to handle several edge cases where
        // users quickly fills the field and jumps to other fields using Tab keypress, etc.
        model.value = currentContent;
        validate(model.name, false, currentContent.length === 0, canIgnore);

        if (expressionEditorState?.name === model.name && monacoRef.current && monacoRef.current.editor.hasTextFocus()) {
            let newModel: string = null;
            let newCodeSnippet: string = "";
            const isStartWithSlash: boolean = currentContent?.startsWith("/");
            // tslint:disable-next-line:prefer-conditional-expression
            if (model.optional === true && (currentContent === undefined || currentContent === "")) {
                // No need to send didChange with the template because this is an optional field and empty content is allowed.
                // Replacing the templates lenght with space char to get the LS completions correctly
                newCodeSnippet = " ".repeat(snippetTargetPosition);
            } else {
                // set the new model for the file
                newCodeSnippet = addToTargetPosition(defaultCodeSnippet, snippetTargetPosition - 1, currentContent);
            }

            newModel = addToTargetLine(currentFile.content, targetPosition, newCodeSnippet, EOL);
            newModel = await addInjectables(newModel, expressionInjectables?.list);
            newModel = addImportModuleToCode(newModel, model);

            expressionEditorState.name = model.name;
            expressionEditorState.content = newModel;
            expressionEditorState.uri = expressionEditorState?.uri;

            // update the change of the field
            model.value = currentContent;
            const langClient = await getExpressionEditorLangClient();
            langClient.didChange({
                contentChanges: [{ text: expressionEditorState.content }],
                textDocument: { uri: expressionEditorState.uri, version: 1 },
            });
            const diagResp = await langClient.getDiagnostics({
                documentIdentifier: { uri: expressionEditorState.uri },
            });
            setExpressionEditorState({
                ...expressionEditorState,
                diagnostic: diagResp[0]?.diagnostics ? getFilteredDiagnostics(diagResp[0]?.diagnostics, isCustomTemplate, isStartWithSlash) : [],
            });

            // FIXME: Uncomment this once the ballerinaSymbol/type request is enabled in LS
            // const offset = varType.length + 1;
            // const resp = await langClient.getType({
            //     documentIdentifier: { uri: expressionEditorState.uri },
            //     position: { line: targetPosition.startLine, offset }
            // });
            // const typeInfo: string[] = (resp as ExpressionTypeResponse).types;
            // handleTypeInfo(typeInfo);

            if ((currentContent === "" || TRIGGER_CHARACTERS.includes(lastPressedKey)) && monacoRef.current.editor.hasTextFocus()) {
                monacoRef.current.editor.trigger("exp_editor", "editor.action.triggerSuggest", {});
            }

            if (currentContent.length >= EDITOR_MAXIMUM_CHARACTERS && monacoRef.current.editor.hasTextFocus() && !hideExpand) {
                setExpand(true);
                if (currentContent.length >= EXPAND_EDITOR_MAXIMUM_CHARACTERS) {
                    setSuperExpand(true);
                }
            }

            if (!!originalValue && !currentContent) {
                // Enable configurable insertion icon when user deletes the whole expression
                setOriginalValue("");
            }
        } else {
            setValidating(false);
        }
    };
    const debouncedContentChange = debounce(handleContentChange, DEBOUNCE_DELAY);

    // ExpEditor close
    const handleOnOutFocus = async () => {
        // remove additional semicolon if present
        const monacoModel = monacoRef?.current?.editor.getModel();
        if (monacoModel) {
            const currentContent = monacoModel.getValue();
            // Remove semicolon only if the content ends with a semicolon and if its not a custom template
            if (currentContent.endsWith(";") && !isCustomTemplate) {
                const contentWithoutSemiColon = getValueWithoutSemiColon(currentContent);
                model.value = contentWithoutSemiColon;
                if (onChange) {
                    onChange(contentWithoutSemiColon);
                }
            }
        }
        if (expressionEditorState?.uri) {
            expressionEditorState.name = model.name;
            expressionEditorState.content = currentFile.content;
            expressionEditorState.uri = expressionEditorState?.uri;

            const langClient: ExpressionEditorLangClientInterface = await getExpressionEditorLangClient();
            langClient.didClose({
                textDocument: {
                    uri: expressionEditorState.uri
                }
            });

            if (monacoRef.current) {
                setCursorOnEditor(false);
                if (subEditor) {
                    monaco.editor.setModelMarkers(monacoRef.current.editor.getModel(), "expression editor", []);
                }
            }
        }
    };

    const handleEditorMount: EditorDidMount = (monacoEditor, { languages, editor }) => {
        languages.register({ id: BALLERINA_EXPR });
        languages.setLanguageConfiguration(BALLERINA_EXPR, {
            autoClosingPairs: [
                { open: "'", close: "'" },
                { open: '"', close: '"' },
                { open: "(", close: ")" },
                { open: "{", close: "}" },
                { open: "[", close: "]" },
            ],
        });
        languages.setMonarchTokensProvider(BALLERINA_EXPR, {
            tokenizer: grammar as any,
        });

        // Block expression editor if there are diagnostics in the source code
        setInvalidSourceCode(diagnosticCheckerExp(mainDiagnostics));

        const MONACO_URI_INMEMO = monaco.Uri.file("inmemory://" + varName + getRandomInt(100000) + ".bal");
        const existingModel = editor.getModel(MONACO_URI_INMEMO);
        if (existingModel) {
            existingModel.dispose();
        }
        const currentModel = editor.createModel(initalValue, BALLERINA_EXPR, MONACO_URI_INMEMO);
        monacoEditor.setModel(currentModel);

        if (diagnosticCheckerExp(mainDiagnostics)) {
            notValidExpEditor("Code has errors, please fix them first.");
        } else {
            // we forecfully set the string to "" when the value is empty. So we have to trigger onChange()
            model.value = initalValue;
            if (onChange) {
                onChange(initalValue);
            }
            validExpEditor();
        }

        // tslint:disable-next-line: no-bitwise
        const prohibitedKeyBindings: number[] = [monaco.KeyCode.Enter, monaco.KeyCode.Enter | monaco.KeyMod.CtrlCmd, monaco.KeyCode.Enter | monaco.KeyMod.Shift];
        prohibitedKeyBindings.forEach((bindings: number) => {
            monacoEditor.addCommand(
                bindings,
                () => {
                    // Disable pressing enter except when suggestions drop down is visible
                },
                "!suggestWidgetVisible"
            );
        });

        // onClick of collapse and expand icons
        monacoEditor.onMouseDown((e: monaco.editor.IEditorMouseEvent) => {
            if (e.target?.detail === EXPAND_WIDGET_ID) {
                setExpand(true);
            } else if (e.target?.detail === COLLAPSE_WIDGET_ID) {
                setExpand(false);
            } else if (e.target?.detail === CONFIGURABLE_WIDGET_ID) {
                setShowConfigurableView(true);
            }
        });

        // Disabling certain key events
        monacoEditor.onKeyDown((event: monaco.IKeyboardEvent) => {
            const { keyCode, ctrlKey, metaKey } = event;
            if ([36, 37].includes(keyCode) && (metaKey || ctrlKey)) {
                // Disabling ctrl/cmd + (f || g)
                event.stopPropagation();
            }
            const suggestWidgetStatus = (monacoEditor as any)._contentWidgets["editor.widget.suggestWidget"]?.widget?._widget?._state;
            // When suggest widget is open => suggestWidgetStatus = 3
            if (keyCode === monaco.KeyCode.Tab && suggestWidgetStatus !== 3) {
                event.stopPropagation();
            }
            if (enterKeyPressed && keyCode === monaco.KeyCode.Enter) {
                enterKeyPressed((event.target as any).value);
            }
        });
    };
    const expEditorStyle = monacoRef?.current?.editor?.hasTextFocus() ? "exp-editor-active" : "exp-editor";
    const fieldName = model.label || model.displayName || model.name;

    setDefaultTooltips();

    return (
        <>
            <ExpressionEditorLabel {...props} />
            <div
                className={classNames("exp-container", { "hide-suggestion": hideSuggestions })}
                style={{ height: expand ? (superExpand ? "200px" : "100px") : "34px" }}
                field-name={fieldName}
            >
                <div className="exp-absolute-wrapper">
                    <div
                        className={expEditorStyle}
                        style={{
                            height: expand ? (superExpand ? "200px" : "100px") : "34px",
                            opacity: disabled ? 0.5 : 1,
                        }}
                    >
                        <MonacoEditor
                            key={index}
                            theme="exp-theme"
                            ref={monacoRef}
                            language={BALLERINA_EXPR}
                            options={MONACO_OPTIONS}
                            editorDidMount={handleEditorMount}
                        />
                        {validating && <LinearProgress data-testid="expr-validating-loader" className="exp-linear-loader" />}
                    </div>
                </div>
            </div>
            {
                ExpressionConfigurable !== undefined && (
                    <ExpressionConfigurable
                        model={model}
                        monacoRef={monacoRef}
                        textLabel={textLabel}
                        varType={varType}
                        expressionInjectables={expressionInjectables}
                        showConfigurableView={showConfigurableView}
                        setShowConfigurableView={setShowConfigurableView}
                    />
                )

            }

            {invalidSourceCode ? (
                <>
                    {!(subEditor && cursorOnEditor) && <DiagnosticView message={mainDiagnostics[0]?.message} />}
                    <FormHelperText className={formClasses.invalidCode}>
                        <FormattedMessage
                            id="lowcode.develop.elements.expressionEditor.invalidSourceCode.errorMessage"
                            defaultMessage="Error occurred in the code-editor. Please fix it first to continue."
                        />
                    </FormHelperText>
                </>
            ) : !disabled && !validating && expressionDiagnosticMsg ? (
                <>
                    {!(subEditor && cursorOnEditor) && <DiagnosticView message={expressionDiagnosticMsg} />}
                    {showHints && hints.map((hint) => <ExpressionEditorHint key={hint.type} {...hint} />)}
                </>
            ) : null}
        </>
    );
}

function DiagnosticView(props: { message: string }) {
    const { message } = props;
    const formClasses = useFormStyles();

    return (
        <TooltipCodeSnippet disabled={message.length <= DIAGNOSTIC_MAX_LENGTH} content={message} placement="right" arrow={true}>
            <FormHelperText className={formClasses.invalidCode} data-testid="expr-diagnostics">
                {truncateDiagnosticMsg(message)}
            </FormHelperText>
        </TooltipCodeSnippet>
    );
}

export default ExpressionEditor;
