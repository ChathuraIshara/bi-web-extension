/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: ordered-imports
import { FunctionDefinition, NodePosition, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import {  CompletionItemKind as VSCodeCompletionItemKind, Diagnostic, InsertTextFormat, Range  } from "vscode-languageserver-protocol";
import { ExpEditorExpandSvg, ExpEditorCollapseSvg, ConfigurableIconSvg } from "../../assets";

import * as monaco from 'monaco-editor';

import {
    COLLAPSE_WIDGET_ID,
    DOUBLE_QUOTE_ERR_CODE,
    EXPAND_WIDGET_ID,
    INCOMPATIBLE_TYPE_ERR_CODE,
    INCOMPATIBLE_TYPE_MAP_ERR_CODE,
    IGNORED_DIAGNOSTIC_MESSAGES,
    SUGGEST_DOUBLE_QUOTES_DIAGNOSTICS,
    SUGGEST_TO_STRING_TYPE,
    UNDEFINED_SYMBOL_ERR_CODE,
    DIAGNOSTIC_MAX_LENGTH,
    SUGGEST_CAST_MAP,
    CONFIGURABLE_WIDGET_ID,
    acceptedKind,
    rejectedKinds
} from "./constants";
import "./style.scss";
import { ExpressionEditorHintProps, HintType } from "../ExpressionEditorHint";
import MonacoEditor from "react-monaco-editor";
import { CompletionResponse, ExpressionEditorLangClientInterface, TextEdit,
    FormField, NonPrimitiveBal, PrimitiveBalType, DiagramDiagnostic, InjectableItem, InsertorDelete, getSelectedDiagnostics } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { GetCompletionsParams, SuggestionItem } from "./index";


// return true if there is any diagnostic of severity === 1
export function diagnosticChecker(diagnostics: Diagnostic[]): boolean {
    if (!diagnostics) {
        return false
    }
    // ignore certain codes and check if there are any diagnostics with severity of level 1
    return diagnostics.some(diagnostic => diagnostic.severity === 1)
}

export function addToTargetLine(oldModelValue: string, targetPosition: NodePosition, codeSnippet: string, EOL?: string): string {
    const modelContent: string[] = oldModelValue.split(/\n/g) || [];
    if (targetPosition?.startColumn) {
        // FIXME: The following logic fails completely when inserting code where target position is multiline
        modelContent[targetPosition?.startLine] = addToTargetPosition(modelContent[targetPosition?.startLine], targetPosition?.startColumn, codeSnippet, typeof targetPosition?.endColumn === 'number' ? targetPosition?.endColumn : targetPosition.startColumn);
    } else {
        modelContent.splice(targetPosition?.startLine, 0, codeSnippet);
    }
    return modelContent.join('\n');
}

export function addToZerothLine(oldModelValue: string, codeSnippet: string): string {
    const modelContent: string[] = oldModelValue.split(/\n/g) || [];
    modelContent[0] = codeSnippet + modelContent[0];
    return modelContent.join('\n');
}

export function addToTargetPosition(oldLine: string, targetColumn: number, codeSnippet: string, endColumn?: number): string {
    return oldLine.slice(0, targetColumn) + codeSnippet + oldLine.slice(typeof endColumn === 'number' ? endColumn : targetColumn);
}

export function getDiagnostics(state: any): Diagnostic[] {
    return state?.diagnostics
}

export function getCurrentSyntaxTree(state: any): STNode {
    return state?.syntaxTree
}

export function getTargetPosition(targetPosition: any, syntaxTree: any): NodePosition {
    if (targetPosition?.line) {
        return {
            startLine: targetPosition?.line,
            endLine: targetPosition?.line,
            startColumn: 0,
            endColumn: 0,

        }
    } else if (targetPosition?.startLine) {
        return {
            startLine: targetPosition.startLine,
            endLine: targetPosition.endLine || targetPosition.startLine,
            startColumn: targetPosition.startColumn,
            endColumn: targetPosition.endColumn || targetPosition.startColumn,

        }
    } else {
        if (syntaxTree && STKindChecker.isFunctionDefinition(syntaxTree)) {
            const functionBodyPosition: NodePosition = (syntaxTree as FunctionDefinition).functionBody.position;
            return {
                startLine: functionBodyPosition.endLine,
                endLine: functionBodyPosition.endLine,
                startColumn: 0,
                endColumn: 0,
            }
        } else {
            return {
                startLine: 1,
                endLine: 1,
                startColumn: 0,
                endColumn: 0,
            }
        }
    }
}

export function getInitialValue(defaultValue: string, model: FormField): string {
    if (defaultValue) {
        return defaultValue;
    }
    if (model?.value) {
        return model.value;
    }
    return "";
}

export function diagnosticCheckerExp(diagnostics: Diagnostic[]): boolean {
    // check for severity level == 1
    return diagnosticChecker(diagnostics)
}

export function customErrorMessage(diagnostics: Diagnostic[]): boolean {
    return (Array.isArray(diagnostics) && diagnostics.length === 1 && diagnostics[0].code === "")
}

export function typeCheckerExp(diagnostics: Diagnostic[], varName: string, varType: string): boolean {
    if (!diagnostics) {
        return false
    }
    // check if message contains temp_Expression
    let typeCheck = false;
    Array.from(diagnostics).forEach((diagnostic: Diagnostic) => {
        if ((diagnostic.message).includes(varName) && varType === "var") {
            typeCheck = true;
            return
        }
    });
    return typeCheck;
}

/** Check if double quotes needs to be appended to input based on the diagnostics */
export function addQuotesChecker(diagnostics: Diagnostic[]) {
    if (!diagnostics) {
        return false;
    }
    if (Array.isArray(diagnostics) && diagnostics.length > 0) {
        // check if message contains incorrect string diagnostic code
        return Array.from(diagnostics).some((diagnostic: Diagnostic) => SUGGEST_DOUBLE_QUOTES_DIAGNOSTICS.includes((diagnostic.code).toString()));
    }
    return false;
}

/** Check if casting would correct `incompatible types` diagnostics */
export function suggestCastChecker(expectedType?: string, foundType?: string) {
    return !!expectedType && !!foundType && SUGGEST_CAST_MAP[expectedType] && SUGGEST_CAST_MAP[expectedType].includes(foundType)
}

/** Check if `.toString()` needs to be appended to given input by checking `incompatible types: expected...` diagnostics */
export function addToStringChecker(diagnostics: Diagnostic[]) {
    if (!diagnostics) {
        return false;
    }
    if (Array.isArray(diagnostics) && diagnostics.length > 0) {
        const selectedDiagnostic: Diagnostic = diagnostics[0];
        if (selectedDiagnostic.code === INCOMPATIBLE_TYPE_ERR_CODE) {
            // Remove "incompatible types: expected 'string', found '" part of the diagnostic message
            const trimmedErrorMessage = selectedDiagnostic.message.replace("incompatible types: expected 'string', found '", "");
            return SUGGEST_TO_STRING_TYPE.some((type: string) => trimmedErrorMessage.startsWith(type));
        } else if (selectedDiagnostic.code === INCOMPATIBLE_TYPE_MAP_ERR_CODE) {
            return true;
        }
    }
    return false;
}

/**
 * Check if the input type is equal to the same but nullable type
 * @example string? === string
 */
export function addElvisChecker(expectedType?: string, foundType?: string) {
    return !!expectedType && !!foundType && `${expectedType}?` === foundType;
}

// FIXME: Use the response of ballerinaSymbol/type instead of below function
function getTypesFromDiagnostics(diagnostics: Diagnostic[]): string[] {
    const incompatibleTypeDiag = diagnostics.find(diagnostic => diagnostic.message.includes("incompatible types: expected"));
    if (incompatibleTypeDiag && incompatibleTypeDiag.code === INCOMPATIBLE_TYPE_ERR_CODE) {
        const trimmedErrorMessage = incompatibleTypeDiag.message.replace("incompatible types: expected ", "");
        return trimmedErrorMessage.replace(/'/g, "").split(", found ");
    } else {
        return [];
    }
}

export function getDefaultValue(expEditorType: string): string {
    switch (expEditorType) {
        case 'var': return `""`;
        case 'string': return `""`;
        case 'int': return `0`;
        case 'float': return `0.0`;
        case 'decimal': return `0d`;
        case 'boolean': return `false`;
        case 'json': return `{}`;
        case 'xml': return `xml \`\``;
        case 'error': return `()`;
        case 'any': return `""`;
        case 'anydata': return `""`;
        default: return '<dafault-value>';
    }
}

/**
 * Helper function to convert the model type into string.
 * Currently simply returns the type name for non primitive types.
 */
export const transformFormFieldTypeToString = (model?: FormField, returnUndefined?: boolean): string => {
    if (model.typeName === "record" || model.typeInfo) {
        if (model.typeInfo) {
            let modName = model.typeInfo.moduleName;
            if (modName.includes('.')) {
                modName = modName.split('.')[1];
            }
            if (model.typeName === PrimitiveBalType.Array) {
                return modName + ":" + model.typeInfo.name + "[]"
            } else {
                return modName + ":" + model.typeInfo.name
            }
        }
    } else if (model.typeName === "union") {
        if (model.members) {
            const allTypes: string[] = [];
            for (const field of model.members) {
                let type;
                if (field.typeName === "record" || field.typeInfo) {
                    if (field.typeInfo) {
                        type = (field.typeName === PrimitiveBalType.Array) ? field.typeInfo.moduleName + ":" + field.typeInfo.name + "[]" : field.typeInfo.moduleName + ":" + field.typeInfo.name;
                    }
                } else if (field.typeName === "tuple") {
                    type = transformFormFieldTypeToString(field);
                } else if (field.typeName === "array") {
                    if (field.memberType?.typeName) {
                        type = field.memberType.typeName + "[]";
                    }
                } else if (field.typeName) {
                    type = field.typeName;
                }

                if (type && !field.noCodeGen && !allTypes.includes(type.toString())) {
                    allTypes.push(type.toString());
                }
            }
            return allTypes.join("|");
        }
    } else if (model.typeName === "tuple") {
        if (model.fields) {
            const allTypes: string[] = [];
            for (const field of model.fields) {
                let type;
                if (field.typeName === "record" && field.typeInfo) {
                    type = field.typeInfo.moduleName + ":" + field.typeInfo.name;
                } else if (field.typeName) {
                    type = field.typeName;
                }
                if (type && !field.noCodeGen) {
                    allTypes.push(type.toString());
                }
            }
            return "[" + allTypes.join(",") + "]";
        }
    } else if (model.typeName === "array") {
        if (model.typeInfo) {
            return model.typeInfo.moduleName + ":" + model.typeInfo.name + "[]";
        } else if (model.memberType) {
            const returnTypeString = transformFormFieldTypeToString(model.memberType);
            if (returnTypeString.length > 2 && returnTypeString.substr(-2) === "[]") {
                return `${returnTypeString}[]`;
            }
            return returnTypeString.includes('|') ? `(${returnTypeString})[]` : `${returnTypeString}[]`;
        }
    } else if (model.typeName === "map") {
        if (model.fields) {
            const returnTypesList: string[] = [];
            model.fields.forEach(field => {
                const fieldTypeString = transformFormFieldTypeToString(field);
                returnTypesList.push(fieldTypeString);
            });
            return `map<${returnTypesList.join(',')}>`;
        }
    } else if (model.typeName) {
        return model.typeName;
    }
    if (returnUndefined && !model.typeName) {
        return undefined;
    }
    return PrimitiveBalType.Var.toString();
}

/** Check if varType is string or a union type containing string */
export function checkIfStringExist(varType: string): boolean {
    if (varType.endsWith(")[]")) {
        // Check for union array
        return false;
    }
    const types: string[] = varType.split("|");
    return types.includes("string")
}

/** Inject StModifications into the expression editor modal  */
export const addInjectables = async (oldModelValue: string, injectables?: InjectableItem[]): Promise<string> => {
    const modelContent: string[] = oldModelValue.split(/\n/g) || [];
    if (injectables) {
        const modifications = await InsertorDelete(injectables.map(item => item.modification))
        for (const item of modifications) {
            const source = item.config?.STATEMENT || ''
            modelContent[item.startLine] = addToTargetPosition(modelContent[item.startLine], item.startColumn, source, item.endColumn);
        }
    }
    return modelContent.join('\n');
}

/**
 * Helper function to add import statements to a given code.
 * Import statements are only added if a given type is a non primitive type and if already not imported.
 * @param codeSnipet Existing code to which the imports will be added
 * @param model formfield model to check the types of the imports
 */
export const addImportModuleToCode = (codeSnipet: string, model: FormField): string => {
    let code = codeSnipet;
    if (model.typeName === "record" || model.typeInfo) {
        if (model.typeInfo) {
            const nonPrimitiveTypeItem = model.typeInfo as NonPrimitiveBal
            const importSnippet = `import ${nonPrimitiveTypeItem.orgName}/${nonPrimitiveTypeItem.moduleName};`;
            const typeDeclarion = `${nonPrimitiveTypeItem.moduleName}:${nonPrimitiveTypeItem.name}`;
            if (!code.includes(importSnippet) && code.includes(typeDeclarion)) {
                // Add import only if its already not imported
                code = addToZerothLine(code, `${importSnippet}`);
            }
        }
    } else if (model.typeName === "union") {
        if (model.fields) {
            for (const field of model.fields) {
                if (field.typeName === "record" || field.typeInfo) {
                    if (field.typeInfo) {
                        const nonPrimitiveTypeItem = field.typeInfo as NonPrimitiveBal
                        const importSnippet = `import ${nonPrimitiveTypeItem.orgName}/${nonPrimitiveTypeItem.moduleName};`;
                        const typeDeclarion = `${nonPrimitiveTypeItem.moduleName}:${nonPrimitiveTypeItem.name}`;
                        if (!code.includes(importSnippet) && code.includes(typeDeclarion)) {
                            // Add import only if its already not imported
                            code = addToZerothLine(code, `${importSnippet}`);
                        }
                    }
                }
            }
        }
    }
    return code;
}

export function createContentWidget(id: string): monaco.editor.IContentWidget {
    return {
        allowEditorOverflow: true,
        getId() {
            return id;
        },
        getDomNode() {
            if (!this.domNode) {
                this.domNode = document.createElement('div');
                if (id === EXPAND_WIDGET_ID) {
                    this.domNode.className = "expand-icon";
                    this.domNode.innerHTML = `<img src="${ExpEditorExpandSvg}"/>`;
                } else if (id === COLLAPSE_WIDGET_ID) {
                    this.domNode.className = "collapse-icon";
                    this.domNode.innerHTML = `<img src="${ExpEditorCollapseSvg}"/>`;
                } else if (id === CONFIGURABLE_WIDGET_ID) {
                    this.domNode.className = "configurable-icon";
                    this.domNode.innerHTML = `<img src="${ConfigurableIconSvg}"/>`;
                }
            }
            return this.domNode;
        },
        getPosition() {
            return {
                position: { lineNumber: 1, column: 1 },
                preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
            };
        }
    }
}

export function createSortText(index: number): string {
    const alpList = "abcdefghijklmnopqrstuvwxyz".split("");
    return "z".repeat(Math.floor(index / 26)) + alpList[index]
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export const truncateDiagnosticMsg = (diagnosticsMessage: string) => {
    if (diagnosticsMessage && diagnosticsMessage.length > DIAGNOSTIC_MAX_LENGTH)
        return diagnosticsMessage.slice(0, DIAGNOSTIC_MAX_LENGTH) + " ..."
    else
        return diagnosticsMessage
}

export const getValueWithoutSemiColon = (currentContent: string) => {
    if (currentContent.endsWith(';')) {
        let semiColonCount = 0;
        // Loop through content and remove if multiple semicolons exist
        for (let i = currentContent.length; i > 0; i--) {
            if (currentContent.charAt(i - 1) === ';') {
                semiColonCount--;
            } else {
                break;
            }
        }
        if (semiColonCount < 0) {
            return currentContent.slice(0, semiColonCount);
        }
    }
    return currentContent;
}

export function getInitialDiagnosticMessage(diagnostics: DiagramDiagnostic[] = []): string {
    return diagnostics.filter(diagnostic => diagnostic.diagnosticInfo.severity.toLowerCase() === 'error').reduce((errArr, diagnostic) => [...errArr, diagnostic.message], []).join(". ");
}

export function diagnosticInRange(diagnosticRange: Range, targetPosition: any, targetColumn: any) {
    const targetLine = targetPosition.line;
    const currentLine = diagnosticRange.start.line;
    const currentColumn = diagnosticRange.start.character;
    return (targetLine === currentLine) && ((targetColumn - 1) <= currentColumn);
}

/** Handlers to handler the click event for hints shown in the expression editor */
const hintHandlers = {
    /** Handle nullable inputs by adding default values via Elvis operator */
    addElvisOperator: (varType: string, monacoRef: React.MutableRefObject<MonacoEditor>) => {
        if (monacoRef.current) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel) {
                const editorContent = editorModel.getValue();
                editorModel.setValue(`${editorContent} ?: ${getDefaultValue(varType)}`);
                monacoRef.current.editor.focus();
            }
        }
    },
    /** Handler to append `.toString` to the input */
    addToString: (monacoRef: React.MutableRefObject<MonacoEditor>) => {
        if (monacoRef.current) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel) {
                const editorContent = editorModel.getValue();
                editorModel.setValue(`(${editorContent}).toString()`);
                monacoRef.current.editor.focus();
            }
        }
    },
    /** Handler to add double quotes to input value in the expression editor */
    addDoubleQuotes: (monacoRef: React.MutableRefObject<MonacoEditor>) => {
        if (monacoRef.current) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel) {
                const editorContent = editorModel.getValue();
                const startQuote = editorContent.trim().startsWith("\"") ? "" : "\"";
                const endQuote = editorContent.trim().endsWith("\"") ? "" : "\"";
                editorModel.setValue(startQuote + editorContent + endQuote);
                monacoRef.current.editor.focus();
            }
        }
    },
    /** Handler to add double quotes to input value in the expression editor */
    addBackTicks: (monacoRef: React.MutableRefObject<MonacoEditor>) => {
        if (monacoRef.current) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel) {
                const editorContent = editorModel.getValue();
                const startQuote = editorContent.trim().startsWith("\`") ? "" : "\`";
                const endQuote = editorContent.trim().endsWith("\`") ? "" : "\`";
                editorModel.setValue(startQuote + editorContent + endQuote);
                monacoRef.current.editor.focus();
            }
        }
    },
    /** Handler to prepend `check` statement to the expression editor input in order to handle expressions that could throw errors */
    addCheck: (monacoRef: React.MutableRefObject<MonacoEditor>) => {
        if (monacoRef.current) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel) {
                editorModel.setValue("check " + editorModel.getValue());
                monacoRef.current.editor.focus();
            }
        }
    },
    /** Handle incompatible types by casting */
    addTypeCast: (foundType: string, varType: string, monacoRef: React.MutableRefObject<MonacoEditor>) => {
        if (monacoRef.current) {
            const editorModel = monacoRef.current.editor.getModel();
            if (editorModel) {
                const editorContent = editorModel.getValue();
                if (foundType === 'string') {
                    editorModel.setValue(`check ${varType}:fromString(${editorContent})`);
                } else {
                    editorModel.setValue(`<${varType}> ${editorContent}`);
                }
                monacoRef.current.editor.focus();
            }
        }
    },
}

/** Get list of hints to be shown below the expression editor, for given diagnostics */
export const getHints = (
    diagnostics: Diagnostic[],
    monacoRef: React.MutableRefObject<MonacoEditor>,
    targetPosition: NodePosition,
    currentContent: string,
    varType?: string
): ExpressionEditorHintProps[] => {
    if (monacoRef.current) {
        const inputLength = monacoRef.current.editor.getPosition().column - 1;
        const hints: ExpressionEditorHintProps[] = [];
        if (diagnostics && Array.isArray(diagnostics) && diagnostics.length > 0) {
            const [expectedType, foundType] = getTypesFromDiagnostics(diagnostics);

            // if (typeCheckerExp(diagnostics, varName, varType)) {
            //     // Prepend `check` to input in order to handle expressions that could throw an error
            //     hints.push({ type: HintType.ADD_CHECK, onClickHere: () => hintHandlers.addCheck(monacoRef) });
            // } else

            if (addElvisChecker(expectedType, foundType)) {
                // Add a default value for nullable inputs via Elvis operator
                hints.push({ type: HintType.ADD_ELVIS_OPERATOR, onClickHere: () => hintHandlers.addElvisOperator(varType, monacoRef) });
            } else if (varType && checkIfStringExist(varType)) {
                // handle string or string|other_types
                if (addToStringChecker(diagnostics)) {
                    // Add .toString to the input
                    hints.push({ type: HintType.ADD_TO_STRING, onClickHere: () => hintHandlers.addToString(monacoRef) });
                } else if (addQuotesChecker(diagnostics)) {
                    const editorContent = monacoRef.current.editor.getModel().getValue();
                    if (editorContent === "") {
                        // Add empty double quotes if the input field is empty for string type
                        hints.push({ type: HintType.ADD_DOUBLE_QUOTES_EMPTY, onClickHere: () => hintHandlers.addDoubleQuotes(monacoRef) });
                    } else {
                        // Add double quotes around the input, if its string input type
                        hints.push({ type: HintType.ADD_DOUBLE_QUOTES, onClickHere: () => hintHandlers.addDoubleQuotes(monacoRef), editorContent });
                    }
                }
            } else if (varType && suggestCastChecker(expectedType, foundType)) {
                hints.push({
                    type: HintType.SUGGEST_CAST,
                    onClickHere: () => hintHandlers.addTypeCast(foundType, varType, monacoRef),
                    expressionType: varType,
                });
            } else if (varType === "sql:ParameterizedQuery" || varType === "sql:ParameterizedCallQuery") {
                if (monacoRef.current) {
                    const editorContent = monacoRef.current.editor.getModel().getValue();
                    // Check if the editor content already has backticks at the start and end positions
                    if (editorContent.charAt(0) !== "`" || editorContent.charAt(editorContent.length - 1) !== "`") {
                        if (editorContent === "") {
                            // Add empty back ticks if the input field is empty for string type
                            hints.push({ type: HintType.ADD_BACK_TICKS_EMPTY, onClickHere: () => hintHandlers.addBackTicks(monacoRef) });
                        } else {
                            // Add back ticks around the input, if its parameterized query input type
                            hints.push({ type: HintType.ADD_BACK_TICKS, onClickHere: () => hintHandlers.addBackTicks(monacoRef), editorContent });
                        }
                    }
                }
            }
        }
        return hints;
    } else {
        return [];
    }
};


export function translateCompletionItemKindToMonaco(kind: VSCodeCompletionItemKind) {
    let monacoCompletionItemKind: monaco.languages.CompletionItemKind;
    switch (kind) {
        case VSCodeCompletionItemKind.Class:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Class
            break;
        case VSCodeCompletionItemKind.Color:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Color
            break;
        case VSCodeCompletionItemKind.Constant:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Constant
            break;
        case VSCodeCompletionItemKind.Constructor:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Constructor
            break;
        case VSCodeCompletionItemKind.Enum:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Enum
            break;
        case VSCodeCompletionItemKind.EnumMember:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.EnumMember
            break;
        case VSCodeCompletionItemKind.Event:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Event
            break;
        case VSCodeCompletionItemKind.Field:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Field
            break;
            case VSCodeCompletionItemKind.File:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.File
            break;
        case VSCodeCompletionItemKind.Folder:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Folder
            break;
        case VSCodeCompletionItemKind.Function:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Function
            break;
        case VSCodeCompletionItemKind.Interface:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Interface
            break;
        case VSCodeCompletionItemKind.Keyword:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Keyword
            break;
        case VSCodeCompletionItemKind.Method:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Method
            break;
        case VSCodeCompletionItemKind.Module:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Module
            break;
        case VSCodeCompletionItemKind.Operator:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Operator
            break;
        case VSCodeCompletionItemKind.Property:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Property
            break;
        case VSCodeCompletionItemKind.Reference:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Reference
            break;
        case VSCodeCompletionItemKind.Snippet:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Snippet
            break;
        case VSCodeCompletionItemKind.Struct:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Struct
            break;
        case VSCodeCompletionItemKind.Text:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Text
            break;
        case VSCodeCompletionItemKind.TypeParameter:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.TypeParameter
            break;
        case VSCodeCompletionItemKind.Unit:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Unit
            break;
        case VSCodeCompletionItemKind.Value:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Value
            break;
        case VSCodeCompletionItemKind.Variable:
            monacoCompletionItemKind = monaco.languages.CompletionItemKind.Variable
            break;
        default:
            monacoCompletionItemKind = kind;
    }
    return monacoCompletionItemKind;
}

export const getStandardExpCompletions = async ({
    model,
    targetPosition,
    completions
}: GetCompletionsParams): Promise<monaco.languages.CompletionList> => {
    // const langClient: ExpressionEditorLangClientInterface = await getExpressionEditorLangClient(langServerURL);
    // const values: CompletionResponse[] = await langClient.getCompletion(completionParams);
    const completionItems: monaco.languages.CompletionItem[] = [];

    if (completions) {
        const completionItemCustom: monaco.languages.CompletionItem[] = Array.from(completions).map((value: SuggestionItem) => {
            return {
                range: null,
                label: value.label,
                kind: monaco.languages.CompletionItemKind.Enum,
                insertText: value.insertText,
                sortText: value.sortText// `0${createSortText(order)}`
            }
        })
        completionItems.push(...completionItemCustom);
    }

    // const filteredCompletionItem: CompletionResponse[] = disableFiltering ? values : values.filter((completionResponse: CompletionResponse) => (
    //     !(completionResponse.kind && rejectedKinds.includes(completionResponse.kind as VSCodeCompletionItemKind)) &&
    //     completionResponse.label !== varName
    // ));

    const sortText: string[] = [];
    // const lsCompletionItems: monaco.languages.CompletionItem[] = filteredCompletionItem.map((completionResponse: CompletionResponse, order: number) => {
    //     sortText.push(completionResponse.sortText);
    //     if (completionResponse.kind === VSCodeCompletionItemKind.Field && completionResponse.additionalTextEdits) {
    //         return {
    //             range: null,
    //             label: completionResponse.label,
    //             detail: completionResponse.detail,
    //             kind: translateCompletionItemKindToMonaco(completionResponse.kind),
    //             insertText: completionResponse.insertText,
    //             insertTextFormat: completionResponse.insertTextFormat as InsertTextFormat,
    //             insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //             sortText: completionResponse.sortText,
    //             documentation: completionResponse.documentation,
    //             command: {
    //                 id: monacoRef.current.editor.addCommand(0, (_: any, args: TextEdit[]) => {
    //                     if (args.length > 0) {
    //                         const startColumn = args[0].range.start.character - snippetTargetPosition -
    //                             targetPosition.startColumn + 2;
    //                         const endColumn = args[0].range.end.character - snippetTargetPosition -
    //                             targetPosition.startColumn + 2;
    //                         const edit: monaco.editor.IIdentifiedSingleEditOperation[] = [{
    //                             text: args[0].newText,
    //                             range: new monaco.Range(1, startColumn, 1, endColumn)
    //                         }];
    //                         monacoRef.current.editor.executeEdits("completion-edit", edit)
    //                     }
    //                 }, ''),
    //                 title: "completion-edit",
    //                 arguments: [completionResponse.additionalTextEdits]
    //             }
    //         }
    //     } else {
    //         return {
    //             range: null,
    //             label: completionResponse.label,
    //             detail: completionResponse.detail,
    //             kind: translateCompletionItemKindToMonaco(completionResponse.kind as VSCodeCompletionItemKind),
    //             insertText: completionResponse.insertText,
    //             insertTextFormat: completionResponse.insertTextFormat as InsertTextFormat,
    //             insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //             sortText: completionResponse.sortText,
    //             documentation: completionResponse.documentation
    //         }
    //     }
    // });

    // This is to sets fist completion selected
    const initialSortedText = sortText.sort()[0];
    const initialSortTextCompletions: monaco.languages.CompletionItem[] = [];
    // lsCompletionItems.forEach(completion => {
    //     if (completion.sortText === initialSortedText) {
    //         initialSortTextCompletions.push(completion);
    //     }
    // });
    const sortedItems: string[] = [];
    initialSortTextCompletions.forEach(completion => {
        sortedItems.push(completion.label as string);
    });
    // const sortedText = sortedItems.sort()[0];
    // const initialItemCompletionIndex = lsCompletionItems.findIndex(item => item.label === sortedText);
    // if (initialItemCompletionIndex !== -1) {
    //     lsCompletionItems[initialItemCompletionIndex].preselect = true;
    // }

    // completionItems.push(...lsCompletionItems);


    const completionList: monaco.languages.CompletionList = {
        incomplete: false,
        suggestions: completionItems
    };
    return completionList;
}

export function withQuotes(fields: string[]) {
    return fields?.map(field => {
        if (field && field.trim() !== ""){
            return `"${field.trim().replaceAll('"', '')}"`;
        }
    });
}
