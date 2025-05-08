import { createSortText, GetExpCompletionsParams, translateCompletionItemKindToMonaco } from "@wso2-enterprise/ballerina-expression-editor";
import { CompletionResponse, ExpressionEditorLangClientInterface } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import * as monaco from 'monaco-editor';
import { CompletionItemKind, InsertTextFormat } from "vscode-languageserver-protocol";


export const getVarTypeCompletions = (ignoredCompletions: string[] = [], additionalCompletions: string[] = []) => async ({
    getExpressionEditorLangClient,
    langServerURL,
    completionParams,
}: GetExpCompletionsParams) => {
    const langClient: ExpressionEditorLangClientInterface = await getExpressionEditorLangClient(langServerURL);
    const values: CompletionResponse[] = await langClient.getCompletion(completionParams);

    // Supported Types: Class:7, Interface:8, Module:9, Unit:11, Enum:13, EnumMember:20, Struct:22
    const acceptedKind: CompletionItemKind[] = [7, 8, 9, 11, 13, 20, 22];

    const validModules = (res: CompletionResponse) => {
        if (res.additionalTextEdits && res.additionalTextEdits.length > 0) {
            if (
                res.additionalTextEdits[0].newText.includes("import") &&
                res.additionalTextEdits[0].range.start.line === 0 &&
                res.additionalTextEdits[0].range.end.line === 0) {
                return false;
            }
        } else {
            return true;
        }
    }

    const filteredCompletionItem: CompletionResponse[] = values.filter(
        (completionResponse: CompletionResponse) =>
          (acceptedKind.includes(completionResponse.kind as CompletionItemKind) || completionResponse.label === 'var') &&
          !ignoredCompletions.includes(completionResponse.label) && validModules(completionResponse)
    );

    const sortText: string[] = [];
    const completionItems: monaco.languages.CompletionItem[] = filteredCompletionItem.map((completionResponse: CompletionResponse, order: number) => {
        sortText.push(completionResponse.sortText);
        return {
            range: null,
            label: completionResponse.label,
            detail: completionResponse.detail,
            kind: translateCompletionItemKindToMonaco(completionResponse.kind as CompletionItemKind),
            insertText: completionResponse.insertText.trim(),
            insertTextFormat: completionResponse.insertTextFormat as InsertTextFormat,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: completionResponse.sortText,
            documentation: completionResponse.documentation
        }
    });

    // This is to set the fist completion selected
    const initialSortedText = sortText.sort()[0];
    const sortedItems: string[] = [];
    completionItems.forEach(completion => {
        if (completion.sortText === initialSortedText) {
            sortedItems.push(completion.label as string);
        }
    });
    const sortedText = sortedItems.sort()[0];
    const initialItemCompletionIndex = completionItems.findIndex(item => item.label === sortedText);
    if (initialItemCompletionIndex !== -1) {
        completionItems[initialItemCompletionIndex].preselect = true;
    }

    additionalCompletions.forEach((addition) => {
        const completionItemTemplate: monaco.languages.CompletionItem = {
            range: null,
            label: addition,
            kind: 1 as CompletionItemKind,
            insertText: addition,
        };
        completionItems.push(completionItemTemplate);
    });

    const completionList: monaco.languages.CompletionList = {
        incomplete: false,
        suggestions: completionItems
    };
    return completionList;
}
