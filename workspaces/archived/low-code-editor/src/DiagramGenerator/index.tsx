/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";
import { IntlProvider } from "react-intl";
import { monaco } from "react-monaco-editor";

import { MuiThemeProvider } from "@material-ui/core/styles";
import {
    CommandResponse,
    DiagramDiagnostic,
    DIAGRAM_MODIFIED,
    FunctionDef,
    getImportStatements,
    LibraryDataResponse,
    LibraryDocResponse,
    LibraryKind,
    LibrarySearchResponse,
    LineRange,
    LowcodeEvent,
    SentryConfig,
    STModification,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FunctionDefinition, ModulePart, NodePosition, STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";
import { WorkspaceEdit } from "vscode-languageserver-protocol";

import LowCodeEditor, { getSymbolInfo, InsertorDelete } from "..";
import "../assets/fonts/Glimer/glimer.css";
import { UndoRedoManager } from "../Diagram/components/FormComponents/UndoRedoManager";
import { STFindingVisitor } from "../Diagram/visitors/st-finder-visitor";
import { DiagramViewManager } from "../DiagramViewManagerClone";
import messages from '../lang/en.json';
import { CirclePreloader } from "../PreLoader/CirclePreloader";
import { MESSAGE_TYPE, SelectedPosition } from "../types";
import { init } from "../utils/sentry";

import { DiagramGenErrorBoundary } from "./ErrorBoundrary";
import ErrorScreen from './ErrorBoundrary/Error';
import {
    getDefaultSelectedPosition, getFunctionSyntaxTree, getLowcodeST, getSelectedPosition, getSyntaxTree, isDeleteModificationAvailable,
    isUnresolvedModulesAvailable
} from "./generatorUtil";
import { addPerformanceData } from "./performanceUtil";
import { useGeneratorStyles } from "./styles";
import { theme } from "./theme";
import { EditorProps, PALETTE_COMMANDS } from "./vscode/Diagram";
export interface DiagramGeneratorProps extends EditorProps {
    scale: string;
    panX: string;
    panY: string;
}

const ZOOM_STEP = 0.1;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.6;
const undoRedo = new UndoRedoManager();
const debounceTime: number = 5000;
let lastPerfUpdate = 0;

export function LowCodeDiagramGenerator(props: DiagramGeneratorProps) {
    const {
        langClientPromise,
        filePath,
        startLine,
        startColumn,
        lastUpdatedAt,
        scale,
        panX,
        panY,
        resolveMissingDependency,
        experimentalEnabled,
        openInDiagram
    } = props;
    const classes = useGeneratorStyles();
    const defaultScale = scale ? Number(scale) : 1;
    const defaultPanX = panX ? Number(panX) : 0;
    const defaultPanY = panY ? Number(panY) : 0;
    const runCommand: (command: PALETTE_COMMANDS, args: any[]) => Promise<boolean> = props.runCommand;
    const runBackgroundTerminalCommand: (command: string) => Promise<CommandResponse> = props.runBackgroundTerminalCommand;
    const openArchitectureView: (nodeId: string) => Promise<boolean> = props.openArchitectureView;
    const showMessage: (message: string, type: MESSAGE_TYPE, isIgnorable: boolean, filePath?: string, fileContent?: string, bypassChecks?: boolean) => Promise<boolean> = props.showMessage;
    const getLibrariesList: (kind?: LibraryKind) => Promise<LibraryDocResponse | undefined> = props.getLibrariesList;
    const getLibrariesData: () => Promise<LibrarySearchResponse | undefined> = props.getLibrariesData;
    const getLibraryData: (orgName: string, moduleName: string, version: string) => Promise<LibraryDataResponse | undefined> = props.getLibraryData;
    const getSentryConfig: () => Promise<SentryConfig | undefined> = props.getSentryConfig;
    const getBalVersion: () => Promise<string | undefined> = props.getBallerinaVersion;
    const getEnv: (name: string) => Promise<any> = props.getEnv;
    const openExternalUrl: (url: string) => Promise<boolean> = props.openExternalUrl;

    const defaultZoomStatus = {
        scale: defaultScale,
        panX: defaultPanX,
        panY: defaultPanY,
    };

    const [fullSyntaxTree, setFullSyntaxTree] = React.useState(undefined);
    const [syntaxTree, setSyntaxTree] = React.useState(undefined);
    // const [zoomStatus, setZoomStatus] = React.useState(defaultZoomStatus);
    const [fileContent, setFileContent] = React.useState("");
    const [isMutationInProgress, setMutationInProgress] = React.useState<boolean>(false);
    const [isModulePullInProgress, setModulePullInProgress] = React.useState<boolean>(false);
    const [loaderText, setLoaderText] = React.useState<string>('Loading...');
    const [lowCodeResourcesVersion, setLowCodeResourcesVersion] = React.useState(undefined);
    const [lowCodeEnvInstance, setLowCodeEnvInstance] = React.useState("");
    const [balVersion, setBalVersion] = React.useState("");
    const [isCodeServer, setCodeServer] = React.useState<boolean>(false);
    const initSelectedPosition = startColumn === 0 && startLine === 0 && syntaxTree ? // TODO: change to use undefined for unselection
        getDefaultSelectedPosition(syntaxTree)
        : { startLine, startColumn }

    const [selectedPosition, setSelectedPosition] = React.useState(initSelectedPosition);
    const [isDiagramError, setIsDiagramError] = React.useState(false);


    React.useEffect(() => {
        // TODO: move this to view manager
        (async () => {
            let showDiagramError = false;
            try {
                const langClient = await langClientPromise;
                const genSyntaxTree: ModulePart = await getSyntaxTree(filePath, langClient);
                const content = await props.getFileContent(filePath);
                // if (genSyntaxTree?.typeData?.diagnostics && genSyntaxTree?.typeData?.diagnostics?.length > 0) {
                //     resolveMissingDependency(filePath, content);
                // }
                const vistedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree, filePath, langClient, experimentalEnabled, showMessage);
                if (!vistedSyntaxTree) {
                    return (<div><h1>Parse error...!</h1></div>);
                }

                if (openInDiagram) {
                    const stFindingVisitor = new STFindingVisitor();
                    stFindingVisitor.setPosition(openInDiagram);
                    traversNode(vistedSyntaxTree, stFindingVisitor);
                    setSyntaxTree(stFindingVisitor.getSTNode());
                } else {
                    setSyntaxTree(vistedSyntaxTree);
                }

                // setSyntaxTree(vistedSyntaxTree);

                undoRedo.updateContent(filePath, content);
                setFileContent(content);
                setLowCodeResourcesVersion(await getEnv("BALLERINA_LOW_CODE_RESOURCES_VERSION"));
                setLowCodeEnvInstance(await getEnv("VSCODE_CHOREO_SENTRY_ENV"));
                // Add performance data
                await addPerfData(vistedSyntaxTree);

                setSelectedPosition(startColumn === 0 && startLine === 0 ?
                    getDefaultSelectedPosition(vistedSyntaxTree as ModulePart)
                    : { startLine, startColumn });
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err)
                showDiagramError = true;
            }

            setIsDiagramError(showDiagramError);
        })();
    }, [lastUpdatedAt]);

    React.useEffect(() => {
        (async () => {
            const version: string = await getBalVersion();
            setBalVersion(version);
            const isCodeServerInstance: string = await getEnv("CODE_SERVER_ENV");
            setCodeServer(isCodeServerInstance === "true");
            const sentryConfig: SentryConfig = await getSentryConfig();
            if (sentryConfig) {
                init(sentryConfig);
            }
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            let showDiagramError = false;
            try {
                const langClient = await langClientPromise;
                const genSyntaxTree: ModulePart = await getSyntaxTree(filePath, langClient);
                const content = await props.getFileContent(filePath);

                // if (genSyntaxTree?.typeData?.diagnostics && genSyntaxTree?.typeData?.diagnostics?.length > 0) {
                //     resolveMissingDependency(filePath, content);
                // }
                const vistedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree, filePath, langClient, experimentalEnabled, showMessage);
                if (!vistedSyntaxTree) {
                    return (<div><h1>Parse error...!</h1></div>);
                }

                if (openInDiagram) {
                    const stFindingVisitor = new STFindingVisitor();
                    stFindingVisitor.setPosition(openInDiagram);
                    traversNode(vistedSyntaxTree, stFindingVisitor);
                    setSyntaxTree(stFindingVisitor.getSTNode());
                } else {
                    setSyntaxTree(vistedSyntaxTree);
                }

                // setFullSyntaxTree(vistedSyntaxTree);

                undoRedo.updateContent(filePath, content);
                setFileContent(content);
                setLowCodeResourcesVersion(await getEnv("BALLERINA_LOW_CODE_RESOURCES_VERSION"));
                setLowCodeEnvInstance(await getEnv("VSCODE_CHOREO_SENTRY_ENV"));
                // Add performance data
                await addPerfData(vistedSyntaxTree);

                setSelectedPosition(startColumn === 0 && startLine === 0 ?
                    getDefaultSelectedPosition(vistedSyntaxTree as ModulePart)
                    : { startLine, startColumn });
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err)
                showDiagramError = true;
            }

            setIsDiagramError(showDiagramError);
        })();
    }, [filePath])

    // React.useEffect(() => {
    //     setSelectedPosition(startColumn === 0 && startLine === 0 && syntaxTree ?
    //         getDefaultSelectedPosition(syntaxTree as ModulePart)
    //         : { startLine, startColumn });

    //     const client = KeyboardNavigationManager.getClient();
    //     client.bindNewKey(['command+z', 'ctrl+z'], undo);
    //     client.bindNewKey(['command+shift+z', 'ctrl+y'], redo);

    //     return () => {
    //         client.resetMouseTrapInstance();
    //     }
    // }, [syntaxTree]);

    // function zoomIn() {
    //     const newZoomStatus = cloneDeep(zoomStatus);
    //     newZoomStatus.scale = (zoomStatus.scale + ZOOM_STEP >= MAX_ZOOM) ? MAX_ZOOM : zoomStatus.scale + ZOOM_STEP;
    //     setZoomStatus(newZoomStatus);
    // }

    // function zoomOut() {
    //     const newZoomStatus = cloneDeep(zoomStatus);
    //     newZoomStatus.scale = (zoomStatus.scale - ZOOM_STEP <= MIN_ZOOM) ? MIN_ZOOM : zoomStatus.scale - ZOOM_STEP;
    //     setZoomStatus(newZoomStatus);
    // }

    // function fitToScreen() {
    //     setZoomStatus(defaultZoomStatus);
    // }

    // function pan(newPanX: number, newPanY: number) {
    //     const newZoomStatus = cloneDeep(zoomStatus);
    //     newZoomStatus.panX = newPanX;
    //     newZoomStatus.panY = newPanY;
    //     setZoomStatus(newZoomStatus);
    // }

    async function showTryitView(serviceName: string, range: LineRange) {
        runCommand(PALETTE_COMMANDS.TRY_IT, [filePath, serviceName, range]);
    }

    async function run(args: any[]) {
        runCommand(PALETTE_COMMANDS.RUN, args);
    }

    const undo = async () => {
        const path = undoRedo.getFilePath();
        const uri = monaco.Uri.file(path).toString();
        const lastsource = undoRedo.undo();
        const langClient = await langClientPromise;
        if (lastsource) {
            langClient.didChange({
                contentChanges: [
                    {
                        text: lastsource
                    }
                ],
                textDocument: {
                    uri,
                    version: 1
                }
            });
            const genSyntaxTree = await getSyntaxTree(path, langClient);
            const vistedSyntaxTree: STNode = await getLowcodeST(genSyntaxTree, path, langClient, experimentalEnabled, showMessage);
            setSyntaxTree(vistedSyntaxTree);
            setFileContent(lastsource);
            props.updateFileContent(path, lastsource);

            await addPerfData(vistedSyntaxTree);

        }
    }

    if (!syntaxTree && !isDiagramError) {
        return (<div className={classes.loaderContainer}><CirclePreloader position="relative" /></div>);
    }

    if (syntaxTree && STKindChecker.isFunctionDefinition(syntaxTree)) {
        const vst: FunctionDefinition = syntaxTree as FunctionDefinition;
        if (STKindChecker.isExternalFunctionBody(vst.functionBody)) {
            return (<div className={classes.errorMessageDialog}><h4>Sorry...! External Function Body is not supported yet.</h4></div>);
        }
    }

    // FIXME: Doing this to make main branch build pass so others can continue merging changes
    // on top of typed context
    const missingProps: any = {};

    const diagramComponent = (
        <DiagramGenErrorBoundary lastUpdatedAt={lastUpdatedAt} >
            <LowCodeEditor
                {...missingProps}
                isReadOnly={false}
                syntaxTree={syntaxTree}
                environment={lowCodeEnvInstance}
                stSymbolInfo={getSymbolInfo()}
                // tslint:disable-next-line: jsx-no-multiline-js
                currentFile={{
                    content: fileContent,
                    path: filePath,
                    size: 1,
                    type: "File"
                }}
                importStatements={getImportStatements(fullSyntaxTree)}
                experimentalEnabled={experimentalEnabled}
                lowCodeResourcesVersion={lowCodeResourcesVersion}
                ballerinaVersion={balVersion}
                isCodeServerInstance={isCodeServer}
                openInDiagram={openInDiagram}
                // tslint:disable-next-line: jsx-no-multiline-js
                api={{
                    ls: {
                        getDiagramEditorLangClient: () => {
                            return langClientPromise;
                        },
                        getExpressionEditorLangClient: () => {
                            return langClientPromise;
                        }
                    },
                    insights: {
                        onEvent: (event: LowcodeEvent) => {
                            props.sendTelemetryEvent(event);
                        }
                    },
                    code: {
                        modifyDiagram: async (mutations: STModification[]) => {
                            const langClient = await langClientPromise;
                            const uri = monaco.Uri.file(filePath).toString();
                            setMutationInProgress(true);
                            setLoaderText('Updating...');
                            const { parseSuccess, source, syntaxTree: newST } = await langClient.stModify({
                                astModifications: await InsertorDelete(mutations),
                                documentIdentifier: {
                                    uri
                                }
                            });
                            let vistedSyntaxTree: STNode;
                            if (parseSuccess) {
                                undoRedo.addModification(source);
                                setFileContent(source);
                                props.updateFileContent(filePath, source);
                                vistedSyntaxTree = await getLowcodeST(newST, filePath, langClient, experimentalEnabled, showMessage);
                                setSyntaxTree(vistedSyntaxTree);
                                if (isDeleteModificationAvailable(mutations)) {
                                    showMessage("Undo your changes by using Ctrl + Z or Cmd + Z", MESSAGE_TYPE.INFO, true);
                                }
                                if (newST?.typeData?.diagnostics && newST?.typeData?.diagnostics?.length > 0) {
                                    const { isAvailable } = isUnresolvedModulesAvailable(newST?.typeData?.diagnostics as DiagramDiagnostic[]);
                                    if (isAvailable) {
                                        setModulePullInProgress(true);
                                        setLoaderText('Pulling packages...');
                                        const { parseSuccess: pullSuccess } = await resolveMissingDependency(filePath, source);
                                        if (pullSuccess) {
                                            // Rebuild the file At backend
                                            langClient.didChange({
                                                textDocument: { uri, version: 1 },
                                                contentChanges: [
                                                    {
                                                        text: source
                                                    }
                                                ],
                                            })
                                            const {
                                                syntaxTree: stWithoutDiagnostics
                                            } = await langClient.getSyntaxTree({ documentIdentifier: { uri } });
                                            vistedSyntaxTree = await getLowcodeST(
                                                stWithoutDiagnostics,
                                                filePath,
                                                langClient,
                                                experimentalEnabled,
                                                showMessage);
                                            setSyntaxTree(vistedSyntaxTree);
                                        }
                                        setModulePullInProgress(false);
                                    }
                                }

                                let newActivePosition: SelectedPosition = { ...selectedPosition };
                                for (const mutation of mutations) {
                                    if (mutation.type.toLowerCase() !== "import" && mutation.type.toLowerCase() !== "delete") {
                                        newActivePosition = getSelectedPosition(vistedSyntaxTree as ModulePart, mutation.startLine, mutation.startColumn);
                                        break;
                                    }
                                }
                                setSelectedPosition(newActivePosition.startColumn === 0 && newActivePosition.startLine === 0 && vistedSyntaxTree
                                    ? getDefaultSelectedPosition(vistedSyntaxTree as ModulePart)
                                    : newActivePosition);
                            } else {
                                // TODO show error
                            }
                            setMutationInProgress(false);
                            if (mutations.length > 0) {
                                const event: LowcodeEvent = {
                                    type: DIAGRAM_MODIFIED,
                                    name: `${mutations[0].type}`
                                };
                                props.sendTelemetryEvent(event);
                            }
                            await addPerfData(vistedSyntaxTree);
                        },
                        gotoSource: (position: { startLine: number, startColumn: number }) => {
                            props.gotoSource(filePath, position);
                        },
                        getFunctionDef: async (lineRange: Range, defFilePath?: string) => {
                            const langClient = await langClientPromise;
                            setMutationInProgress(true);
                            setLoaderText('Fetching...');
                            const res: FunctionDef = await getFunctionSyntaxTree(
                                defFilePath ? defFilePath : monaco.Uri.file(filePath).toString(),
                                lineRange,
                                langClient
                            );
                            setMutationInProgress(false);
                            return res;
                        },
                        updateFileContent: (content: string, skipForceSave?: boolean) => {
                            return props.updateFileContent(filePath, content, skipForceSave);
                        },
                        renameSymbol: (workspaceEdits: WorkspaceEdit) => {
                            return props.renameSymbol(workspaceEdits);
                        },
                        undo,
                        isMutationInProgress,
                        isModulePullInProgress,
                        loaderText,
                    },
                    // FIXME Doesn't make sense to take these methods below from outside
                    // Move these inside and get an external API for pref persistance
                    // against a unique ID (eg AppID) for rerender from prev state
                    // panNZoom: {
                    //     pan,
                    //     fitToScreen,
                    //     zoomIn,
                    //     zoomOut
                    // },
                    webView: {
                        showTryitView
                    },
                    project: {
                        run
                    },
                    library: {
                        getLibrariesList,
                        getLibrariesData,
                        getLibraryData
                    },
                    runBackgroundTerminalCommand,
                    openArchitectureView,
                    openExternalUrl
                }}
            />
        </DiagramGenErrorBoundary>
    )

    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.lowCodeContainer}>
                <IntlProvider locale='en' defaultLocale='en' messages={messages}>
                    {isDiagramError && <ErrorScreen />}
                    {!isDiagramError && diagramComponent}
                </IntlProvider>
            </div>
        </MuiThemeProvider>
    );

    async function addPerfData(vistedSyntaxTree: STNode) {
        const currentTime: number = Date.now();
        const langClient = await langClientPromise;
        if (currentTime - lastPerfUpdate > debounceTime) {
            await addPerformanceData(syntaxTree, filePath, langClient, props.showPerformanceGraph, props.getPerfDataFromChoreo, setSyntaxTree);
            lastPerfUpdate = currentTime;
        }
    }
}


export function OverviewDiagramGenerator(props: EditorProps) {
    return (
        <DiagramViewManager {...props} />
    )
}
