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
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";

import { FormHelperText, LinearProgress } from "@material-ui/core";
import {
    configurableTypes,
    DiagramDiagnostic,
    ExpressionEditorState
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    TooltipCodeSnippet
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";
import debounce from "lodash.debounce";
import * as monaco from "monaco-editor";
import { Diagnostic } from "vscode-languageserver-protocol";

import grammar from "../../ballerina.monarch.json";
import { useStyles as useFormStyles } from "../../themes";
import { ExpressionEditorHint, ExpressionEditorHintProps } from "../ExpressionEditorHint";

import {
    COLLAPSE_WIDGET_ID,
    CONFIGURABLE_WIDGET_ID,
    DIAGNOSTIC_MAX_LENGTH,
    EXPAND_WIDGET_ID,
    TRIGGER_CHARACTERS,
} from "./constants";
import "./style.scss";
import {
    createContentWidget,
    getHints,
    getRandomInt,
    getStandardExpCompletions,
    getValueWithoutSemiColon,
    truncateDiagnosticMsg,
} from "./utils";

const DEBOUNCE_DELAY = 300;

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
    occurrencesHighlight: false
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

export interface SuggestionItem {
    value: string;
    label?: string,
    kind?: string;
    insertText?: string;
    completionKind?: number;
    suggestionType?: number;
    sortText?: string,
    insertTextFormat?: number,
    detail?: string
}

export interface LiteExpressionEditorCustomTemplate {
    defaultCodeSnippet: string;
    targetColumn: number;
}

export interface GetCompletionsParams {
    model: any; // FIXME: Assign proper type once model prop in exp editor has been updated,
    targetPosition?: NodePosition;
    completions?: SuggestionItem[];
}

export interface LiteExpressionEditorProps {
    defaultValue?: string;
    externalChangedValue?: string;
    focus?: boolean;
    targetPosition?: any;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    completions?: SuggestionItem[];
    hideSuggestions?: boolean;
    getCompletions?: (completionProps: GetCompletionsParams) => Promise<monaco.languages.CompletionList>;
    disabled?: boolean;
    initialDiagnostics?: DiagramDiagnostic[];
    diagnostics?: Diagnostic[];
    model?: {
        value?: string;
        name?: string;
        optional?: boolean;
    },
    customProps?: {
        index?: number;
        isErrored?: boolean;
        optional?: boolean;
        name?: string;
    },
    stModel?: STNode;
    testId?: string;
}

export function LiteExpressionEditor(props: LiteExpressionEditorProps) {
    const [disposableTriggers] = useState([]);
    const {
        defaultValue,
        focus,
        targetPosition,
        onChange,
        onFocus,
        hideSuggestions,
        getCompletions = getStandardExpCompletions,
        completions,
        disabled,
        initialDiagnostics = [],
        diagnostics,
        model,
        customProps,
        stModel,
        testId,
        externalChangedValue
    } = props;

    const [expressionEditorState, setExpressionEditorState] = useState<ExpressionEditorState>({
        name: undefined,
        content: undefined,
        uri: undefined,
        diagnostic: diagnostics,
        isFirstSelect: true
    });

    const initialValue = defaultValue;

    // (self as any).MonacoEnvironment = {
    //     getWorkerUrl: () =>
    //         `data:text/javascript;charset=utf-8,${encodeURIComponent(`
    //         importScripts('https://choreo-shared-codeserver-cdne.azureedge.net/ballerina-low-code-resources@${lowCodeResourcesVersion}/jslibs/editor.worker.js');`)}`
    // };

    // const targetPosition = targetPosition;//getTargetPosition(targetPositionDraft, syntaxTree); // editPosition ||
    const [invalidSourceCode, setInvalidSourceCode] = useState(false);
    const [expand, setExpand] = useState(false); // expandDefault ||
    const [superExpand, setSuperExpand] = useState(false);
    const [cursorOnEditor, setCursorOnEditor] = useState(false);

    const formClasses = useFormStyles();
    const monacoRef: React.MutableRefObject<MonacoEditor> = React.useRef<MonacoEditor>(null);
    const [hints, setHints] = useState<ExpressionEditorHintProps[]>([]);
    const [validating, setValidating] = useState<boolean>(false);
    const [showConfigurableView, setShowConfigurableView] = useState(false);
    const [expressionDiagnosticMsg, setExpressionDiagnosticMsg] = useState(""); // getInitialDiagnosticMessage(diagnostics)

    const [editorConfig] = useState({ onChange, diagnostics });

    useEffect(() => {
        editorConfig.onChange = onChange;
    }, [onChange])

    // Configurable insertion icon will be displayed only when originalValue is empty
    // const [originalValue, setOriginalValue] = useState(model?.value || "");
    // const isEmpty = (model.value ?? "") === "";
    // const canIgnore = (model.optional || model.defaultable) ?? false;

    const validExpEditor = () => {
        const monacoModel = monacoRef.current?.editor?.getModel();
        const monacoValue = monacoModel?.getValue();
        // xvalidate(model.name, canIgnore ? false : monacoValue?.length === 0, isEmpty, canIgnore);
        setValidating(false);
        if (monacoRef.current) {
            monaco.editor.setModelMarkers(monacoModel, "expression editor", []);
            setExpressionDiagnosticMsg("");
        }
    };

    const notValidExpEditor = (message: string, updateState: boolean = true) => {
        const currentContent = monacoRef.current ? monacoRef.current?.editor?.getModel()?.getValue() : model?.value;
        if (model?.optional === true && (currentContent === undefined || currentContent === "") && !invalidSourceCode) {
            validExpEditor();
        } else {
            // validate(model.name, true, isEmpty, canIgnore);
            // setExpressionDiagnosticMsg(message);
            setValidating(false);
            setHints(
                getHints(
                    diagnostics,
                    monacoRef,
                    targetPosition,
                    currentContent
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
                    const monacoModel = monacoRef.current.editor.getModel();
                    monaco.editor.setModelMarkers(
                        monacoModel,
                        "expression editor",
                        editorConfig?.diagnostics?.map((diagnostic: any) => ({
                            startLineNumber: 1,
                            startColumn: diagnostic.range?.start?.character || monacoModel.getFullModelRange().startColumn, // - snippetTargetPosition + 2,
                            endLineNumber: 1,
                            endColumn: diagnostic.range?.end?.character || monacoModel.getFullModelRange().endColumn, // - snippetTargetPosition + 2,
                            message: diagnostic.message,
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
        notValidExpEditor("", false);
    };

    const disposeAllTriggers = () => {
        while (disposableTriggers.length > 0) {
            const disposable: monaco.IDisposable = disposableTriggers.pop();
            disposable.dispose();
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
                    // event.isFlush()
                    if (!event.isFlush) {
                        debouncedContentChange(monacoModel.getValue(), monacoModel.getEOL(), lastPressedKey);
                        setValidating(false);
                    } else {
                        setValidating(false);
                    }
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
                            return getCompletions({
                                model,
                                targetPosition,
                                completions
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
    }, [stModel, completions]); // statementType, expressionInjectables?.list?.length, customTemplate?.defaultCodeSnippet

    useEffect(() => {
        // Programmatically focus exp-editor
        // && customProps?.revertFocus
        if (focus) {
            monacoRef.current.editor.focus();
            // customProps.revertFocus();
        }
    }, [focus]);

    useEffect(() => {
        if (externalChangedValue !== undefined) {
            const monacoModel = monacoRef.current.editor.getModel();
            monacoModel.setValue(externalChangedValue);
        }
    }, [externalChangedValue]);

    useEffect(() => {
        // !hideExpand
        if (monacoRef.current) {
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
    }, [expand]); // hideExpand;

    useEffect(() => {
        if (monacoRef.current) {
            // Show configurable options icon in the expression editor only if following conditions passes
            // - If model type os one of valid configurable types
            // - originalValue is empty (will be empty in create flow, or if user removes the expression during edit flow)
            const configurableWidget: monaco.editor.IContentWidget = createContentWidget(CONFIGURABLE_WIDGET_ID);
            // if (configurableTypes.includes(varType) && !originalValue) { // && expressionInjectables
            //     monacoRef.current.editor.addContentWidget(configurableWidget);
            // } else {
            //     monacoRef.current.editor.removeContentWidget(configurableWidget);
            // }
        }
    }, [configurableTypes]); // originalValue ,expressionInjectables


    useEffect(() => {
        if (monacoRef.current) {
            // FIXME: Need to change the theme when editor is disabled
            monacoRef.current.editor.updateOptions({ readOnly: disabled });
        }
    }, [disabled]);

    useEffect(() => {
        editorConfig.diagnostics = diagnostics;
        if (diagnostics) {
            handleDiagnostic();
            if (diagnostics.length > 0) {
                setExpressionDiagnosticMsg(diagnostics[0].message);
            } else {
                setExpressionDiagnosticMsg("");
            }
        } else {
            setExpressionDiagnosticMsg("");
        }
    }, [diagnostics]);

    // ExpEditor start
    const handleOnFocus = async (currentContent: string, EOL: string) => {
        const lastCharacter = currentContent.length > 0 && currentContent.charAt(currentContent.length - 1);
        if ((currentContent === "" || TRIGGER_CHARACTERS.includes(lastCharacter)) && monacoRef.current.editor.hasTextFocus()) {
            monacoRef.current.editor.trigger("exp_editor", "editor.action.triggerSuggest", {});
        }

        if (expressionEditorState.isFirstSelect) {
            monacoRef.current.editor.setSelection(monacoRef.current.editor.getModel().getFullModelRange());
            expressionEditorState.isFirstSelect = false;
        }

        if (onFocus) {
            onFocus();
        }
    };

    // ExpEditor onChange
    const handleContentChange = async (currentContent: string, EOL: string, lastPressedKey?: string) => {
        if (editorConfig.onChange && monacoRef?.current?.editor?.hasTextFocus()) {
            editorConfig.onChange(currentContent);
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
            if (currentContent.endsWith(";")) { // && !isCustomTemplate
                const contentWithoutSemiColon = getValueWithoutSemiColon(currentContent);
                model.value = contentWithoutSemiColon;
                // if (onChange) {
                //     onChange(contentWithoutSemiColon);
                // }
            }
        }
        if (expressionEditorState?.uri) {
            expressionEditorState.name = model.name;
            // expressionEditorState.content = currentFile.content;
            expressionEditorState.uri = expressionEditorState?.uri;

            if (monacoRef.current) {
                setCursorOnEditor(false);
                // if (subEditor) {
                //     monaco.editor.setModelMarkers(monacoRef.current.editor.getModel(), "expression editor", []);
                // }
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
        // setInvalidSourceCode(diagnosticCheckerExp(mainDiagnostics));

        const MONACO_URI_INMEMO = monaco.Uri.file("inmemory://" + "file" + getRandomInt(100000) + ".bal");
        const existingModel = editor.getModel(MONACO_URI_INMEMO);
        if (existingModel) {
            existingModel.dispose();
        }
        const currentModel = editor.createModel(initialValue, BALLERINA_EXPR, MONACO_URI_INMEMO); // initalValue
        monacoEditor.setModel(currentModel);

        // if (diagnosticCheckerExp(mainDiagnostics)) {
        //     notValidExpEditor("Code has errors, please fix them first.");
        // } else {
        //     // we forecfully set the string to "" when the value is empty. So we have to trigger onChange()
        //     model.value = initalValue;
        //     if (onChange) {
        //         onChange(initalValue);
        //     }
        //     // validExpEditor();
        // }

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
            // if (enterKeyPressed && keyCode === monaco.KeyCode.Enter) {
            //     enterKeyPressed((event.target as any).value);
            // }
        });
    };
    const expEditorStyle = monacoRef?.current?.editor?.hasTextFocus() ? "exp-editor-active" : "exp-editor";
    // const fieldName = model.label || model.displayName || model.name;

    // setDefaultTooltips();
    const index = customProps?.index ? customProps?.index : 1;

    return (
        <>
            {/* <ExpressionEditorLabel {...props} /> */}
            <div
                className={classNames("exp-container", { "hide-suggestion": hideSuggestions })}
                style={{ height: expand ? (superExpand ? "200px" : "100px") : "34px" }}
                field-name={testId}
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
            {/* {
                ExpressionConfigurable !== undefined && (
                    <ExpressionConfigurable
                        model={model}
                        monacoRef={monacoRef}
                        textLabel={textLabel}
                        varType={varType}
                        // expressionInjectables={expressionInjectables}
                        showConfigurableView={showConfigurableView}
                        setShowConfigurableView={setShowConfigurableView}
                    />
                )

            } */
            }

            {/* {invalidSourceCode ? (
                <>
                    {!(subEditor && cursorOnEditor) && <DiagnosticView message={mainDiagnostics[0]?.message} />}
                    <FormHelperText className={formClasses.recordCreateinvalidCode}>
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
            ) : null} */
            }
            {expressionDiagnosticMsg && (
                <>
                    {<DiagnosticView message={expressionDiagnosticMsg} />}
                    {hints.map((hint) => <ExpressionEditorHint key={hint.type} {...hint} />)}
                </>
            )
            }
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

export default LiteExpressionEditor;
