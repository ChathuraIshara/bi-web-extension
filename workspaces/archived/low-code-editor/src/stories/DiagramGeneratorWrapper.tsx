import React, { useEffect } from 'react';

import { Uri } from 'monaco-editor';

import { DiagramGeneratorProps, LowCodeDiagramGenerator } from '../DiagramGenerator';

import { CodeEditor } from './CodeEditor/CodeEditor';


export function DiagramGeneratorWrapper(props: DiagramGeneratorProps) {
    const { langClientPromise, getFileContent, filePath, updateFileContent, lastUpdatedAt } = props;
    const [didOpen, setDidOpen ] = React.useState(false);
    const [fileContent, setFileContent ] = React.useState("");
    const [lastUpdated, setLastUpdated ] = React.useState(lastUpdatedAt);

    const updateFileContentOverride = (fPath: string, newContent: string) => {
        setFileContent(newContent);
        return updateFileContent(fPath, newContent);
    }

    const newProps = {
        ...props,
        lastUpdatedAt: lastUpdated,
        updateFileContent: updateFileContentOverride
    }

    useEffect(() => {
        async function openFileInLS() {
            const text = await getFileContent(filePath);
            const langClient = await langClientPromise;
            langClient.didOpen({
                textDocument: {
                  languageId: "ballerina",
                  text,
                  uri: Uri.file(filePath).toString(),
                  version: 1
                }
            });
            setDidOpen(true);
            setFileContent(text)
        }

        async function closeFileInLS() {
            const langClient = await langClientPromise;
            langClient.didClose({
                textDocument: {
                  uri: Uri.file(filePath).toString(),
                }
            });
            setDidOpen(true);
        }
        openFileInLS();
        return () => {
            closeFileInLS();
        }
    }, []);

    return !didOpen ? <>Opening the document...</>
        :
        // tslint:disable-next-line: jsx-wrap-multiline
        <>
            <LowCodeDiagramGenerator {...newProps} />
            <hr/>
            <CodeEditor
                content={fileContent}
                filePath={filePath}
                // tslint:disable-next-line: jsx-no-multiline-js
                onChange={
                    // tslint:disable-next-line: jsx-no-lambda
                    (fPath, newContent) => {
                        updateFileContentOverride(fPath, newContent);
                        langClientPromise.then((langClient) => {
                            langClient.didChange({
                                textDocument: {
                                    uri: Uri.file(filePath).toString(),
                                    version: 1
                                },
                                contentChanges: [
                                    {
                                        text: newContent
                                    }
                                ]
                            });
                            setLastUpdated((new Date()).toISOString());
                        })
                    }
                }
            />
            <code id='file-content-holder' style={{ display: "none" }}>
                {fileContent}
            </code>
        </>;
}
