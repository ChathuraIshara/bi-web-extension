/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import { LanguageClient } from './lang-service/client';
import path from 'path';
import fs from 'fs';
import { Diagram } from '../components';
import { log } from "console";
import { prettyDOM, waitFor, waitForElementToBeRemoved } from "@testing-library/dom";
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import { MACHINE_VIEW } from '@wso2-enterprise/mi-core';
import { VisualizerContext, Context } from '@wso2-enterprise/mi-rpc-client';
import { generateJsonFromXml } from './testJsonGenerator';

// Error Boundary Component
interface ErrorBoundaryProps {
    children: React.ReactNode; // Define children prop
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        log("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

function DiagramTest({ model, uri }: { model: any, uri: string }) {
    const [visualizerState, setVisualizerState] = useState<VisualizerContext>({
        viewLocation: { view: MACHINE_VIEW.Overview },
        isLoggedIn: false,
        isLoading: true,
        setIsLoading: (isLoading: boolean) => {
            setVisualizerState((prevState: VisualizerContext) => ({
                ...prevState,
                isLoading
            }));
        }
    });

    return (
        <Context.Provider value={visualizerState}>
            <ErrorBoundary>
                <Diagram model={model} documentUri={uri} />
            </ErrorBoundary>
        </Context.Provider>
    );

}

// Enable to generate test data
// describe('Generate Test data', () => {
//     test('Test json', async () => {
//         await generateJsonFromXml();
//     });
// });

describe('Diagram component', () => {
    let langClient: LanguageClient;

    beforeAll(async () => {
        const client = new LanguageClient();
        await client.start();
        langClient = client;

    }, 20000);

    afterAll(async () => {
        langClient.stop();
    });

    describe('renders correctly with valid XML files', () => {
        const dataRoot = path.join(__dirname, 'data', 'input-xml');
        const testJson = path.join(__dirname, 'data', 'files.json');
        const json = JSON.parse(fs.readFileSync(testJson, 'utf-8'));

        const files: any[] = (json.map((file: any) => [file.file, file.resources]));

        describe.each(files)('Diagram work correctly for resource - %s', (file: string, resources: any[]) => {
            resources = resources.map((resource: any) => { return { path: resource.path, methods: resource.methods.toString() } });

            test.each(resources)('- $methods $path', async ({ path: resourcePath, methods }) => {
                const uri = path.join(dataRoot, file);
                const syntaxTree = await langClient.getSyntaxTree({
                    documentIdentifier: {
                        uri
                    }
                });
                const resources = syntaxTree.syntaxTree.api.resource;
                expect(resources).toBeDefined();
                expect(resources.length).toBeGreaterThan(0);
                const resource = resources.find((resource: any) => resource.uriTemplate === resourcePath || resource.urlMapping === resourcePath);
                expect(resource).toBeDefined();

                await renderAndCheckSnapshot(resource, uri);
            }, 20000);
        }, 20000);

        const dssDataRoot = path.join(__dirname, 'data', 'input-xml', 'data-services');
        const dssFiles = fs.readdirSync(dssDataRoot);
        test.each(dssFiles)('Diagram work correctly for data service - %s', async (file) => {
            const uri = path.join(dssDataRoot, file);
            const syntaxTree = await langClient.getSyntaxTree({
                documentIdentifier: {
                    uri
                }
            });

            if (syntaxTree.syntaxTree?.data?.queries && syntaxTree.syntaxTree?.data?.queries.length > 0) {
                const model = syntaxTree.syntaxTree?.data?.queries[0];
                await renderAndCheckSnapshot(model, uri);
            } else {
                throw new Error("Resource is undefined or empty.");
            }
        }, 20000);
    });
});

async function renderAndCheckSnapshot(model: any, uri: string) {
    const dom = render(
        <DiagramTest model={model} uri={uri} />
    );

    await waitFor(async () => {
        expect(await screen.findByTestId(/^diagram-canvas-/)).toBeInTheDocument();
        await waitForElementToBeRemoved(await screen.findByTestId("loading-overlay"));
    }, { timeout: 10000 });

    const prettyDom = prettyDOM(dom.container, 1000000, {
        highlight: false, filterNode(node) {
            return true;
        },
    });

    expect(prettyDom).toBeTruthy();

    const sanitazedDom = (prettyDom as string).replaceAll(/\s+(marker-end|id)="[^"]*"/g, '');
    expect(sanitazedDom).toMatchSnapshot();
}

