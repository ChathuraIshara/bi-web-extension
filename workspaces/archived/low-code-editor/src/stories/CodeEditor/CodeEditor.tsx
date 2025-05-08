import * as React from "react";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";

import { NodePosition } from "@wso2-enterprise/syntax-tree";
import debounce from "lodash.debounce";
import * as monaco from 'monaco-editor'

import grammar from "../../ballerina.monarch.json";
// import { MonacoServices } from 'monaco-languageclient';


const BALLERINA_LANG = "ballerina";

const MONACO_OPTIONS: monaco.editor.IEditorConstructionOptions = {
    autoIndent: "full",
    automaticLayout: true,
    contextmenu: true,
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
        enabled: false,
    },
    readOnly: false,
    scrollbar: {
        horizontalSliderSize: 4,
        verticalSliderSize: 18,
    },
};

export interface CodeEditorProps {
    content: string,
    filePath: string,
    onChange: (filePath: string, newContent: string) => void;
    selectedArea?: NodePosition;
}

let storeTriggerredChange: boolean = false;
let codeHighlightOldDecoration: string[] = [];

export function CodeEditor(props: CodeEditorProps) {
    const { filePath, content, onChange, selectedArea } = props;

    const debouncedOnChange = debounce(onChange, 1500);

    const monacoRef: React.MutableRefObject<MonacoEditor> = React.useRef<MonacoEditor>(null);

    React.useEffect(() => {
        if (selectedArea && monacoRef?.current){
            // Highlight code when codeLocationToHighlight is changed
            const {startLine, startColumn, endLine, endColumn} = selectedArea;
            codeHighlightOldDecoration = monacoRef?.current?.editor.deltaDecorations(codeHighlightOldDecoration, [
                { range: new monaco.Range(startLine + 1, startColumn + 1, endLine + 1, endColumn + 1),
                  options: { isWholeLine: false, inlineClassName: 'inlineCodeSelectionStyle', linesDecorationsClassName: 'lineCodeSelectionStyle' }},
            ])
            monacoRef?.current?.editor.setPosition({lineNumber: startLine + 1, column: startColumn + 1})
            monacoRef?.current?.editor.revealLinesInCenter(startLine, endLine);
        }
      }, [selectedArea, monacoRef?.current]);


    const handleCodeChange = (newCode: string, event: monaco.editor.IModelContentChangedEvent) => {
        if (!storeTriggerredChange) {
            debouncedOnChange(filePath, newCode);
        }
    };

    const updateEditorModel = () => {
        const editorModel = monaco.editor.getModel(monaco.Uri.file(filePath));
        if (editorModel && content) {
            editorModel.setValue(content);
        }
    }

    const handleStoreCodeUpdate = () => {
        storeTriggerredChange = true;
        updateEditorModel();
        storeTriggerredChange = false;
    }

    React.useEffect(handleStoreCodeUpdate, [content]);

    const handleEditorMount: EditorDidMount = (monacoEditor, { languages, editor }) => {
        languages.register({ id: BALLERINA_LANG });
        languages.setMonarchTokensProvider(BALLERINA_LANG, {
            tokenizer: grammar as any,
        });
        // MonacoServices.install(monaco as any);

        // set model to editor
        const uri = monaco.Uri.file(filePath);
        const existingModel = editor.getModel(uri);
        if (existingModel) {
            existingModel.dispose();
        }
        const editorContent = content ? content : "";
        const model = editor.createModel(editorContent, BALLERINA_LANG, uri);
        monacoEditor.setModel(model);

    };
    return (
        <div className="code-editor" data-testid="code-editor">
            <MonacoEditor
                height={500}
                ref={monacoRef}
                language={BALLERINA_LANG}
                options={MONACO_OPTIONS}
                onChange={handleCodeChange}
                editorDidMount={handleEditorMount}
            />
        </div>
    );
}
