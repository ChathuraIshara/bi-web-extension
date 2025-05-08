/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { monaco } from "react-monaco-editor";

import { MuiThemeProvider } from "@material-ui/core";
import { BallerinaProjectComponents, ComponentViewInfo, ConnectorWizardProps, ConnectorWizardType, FileListEntry, FunctionDefinitionInfo, KeyboardNavigationManager } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ModulePart, ModuleVarDecl, NodePosition, STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";

import { Provider as ViewManagerProvider } from "../Contexts/Diagram";
import { ConnectorWizard } from "../Diagram/components/FormComponents/ConfigForms/ConnectorWizard";
import { FormGenerator, FormGeneratorProps } from "../Diagram/components/FormComponents/FormGenerator";
import { UndoRedoManager } from "../Diagram/components/FormComponents/UndoRedoManager";
import { FindConstructByIndexVisitor } from "../Diagram/visitors/find-construct-by-index-visitor";
import { FindConstructByNameVisitor } from "../Diagram/visitors/find-construct-by-name-visitor";
import { FindNodeByUidVisitor } from "../Diagram/visitors/find-node-by-uid";
import { UIDGenerationVisitor } from "../Diagram/visitors/uid-generation-visitor";
import { getConstructBodyString } from "../Diagram/visitors/util";
import { getLowcodeST, getSyntaxTree } from "../DiagramGenerator/generatorUtil";
import { addPerformanceDataNew } from "../DiagramGenerator/performanceUtil";
import { EditorProps, WorkspaceFolder } from "../DiagramGenerator/vscode/Diagram";
import messages from '../lang/en.json';
import { TextPreLoader } from "../PreLoader/TextPreLoader";

import { NavigationBar } from "./components/NavigationBar";
import { Provider as HistoryProvider } from './context/history';
import { useComponentHistory } from "./hooks/history";
import { useGeneratorStyles } from "./style";
import { theme } from './theme';
import { extractFilePath, generateClientInfo, getDiagramProviderProps, getFormTypeFromST } from "./utils";
import { ComponentListView } from "./views";
import { DiagramView } from "./views/DiagramView";
import { FailedToIdentifyMessageOverlay } from "./views/FailedToIdentifyView";

const debounceTime: number = 5000;
let lastPerfUpdate = 0;

const undoRedoManager = new UndoRedoManager();

export function DiagramViewManager(props: EditorProps) {
    const {
        lastUpdatedAt,
        langClientPromise,
        experimentalEnabled,
        projectPaths,
        getFileContent,
        getEnv,
        getBallerinaVersion,
        workspaceName,
        diagramFocus
    } = props;

    const [
        history,
        historyPush,
        historyPop,
        historyClearAndPopulateWith,
        historySelect,
        historyClear,
        updateCurrentEntry
    ] = useComponentHistory();

    const classes = useGeneratorStyles();
    const [formConfig, setFormConfig] = useState<FormGeneratorProps>();
    const [connectorConfig, setConnectorConfig] = useState<ConnectorWizardProps>();
    const [updatedTimeStamp, setUpdatedTimeStamp] = useState<string>();
    const [lowCodeResourcesVersion, setLowCodeResourcesVersion] = React.useState(undefined);
    const [lowCodeEnvInstance, setLowCodeEnvInstance] = React.useState("");
    const [balVersion, setBalVersion] = React.useState("");
    const [projectComponents, setProjectComponents] = React.useState<BallerinaProjectComponents>();
    const [fileList, setFileList] = React.useState([]);
    const [focusedST, setFocusedST] = useState<STNode>();
    const [completeST, setCompleteST] = useState<STNode>();
    const [currentFileContent, setCurrentFileContent] = useState<string>();
    const [isLoadingST, setIsLoadingST] = useState<boolean>(false);
    const [showIdentificationFailureMessage, setShowIdentificationFailureMessage] = useState<boolean>(false);

    projectPaths.forEach(path => {
        path.uri.path = extractFilePath(path.uri.path);
    })

    useEffect(() => {
        const mouseTrapClient = KeyboardNavigationManager.getClient();
        mouseTrapClient.bindNewKey(['command+z', 'ctrl+z'], async () => {
            const lastsource = undoRedoManager.undo();
            if (lastsource) {
                props.updateFileContent(history[history.length - 1].file, lastsource);
                setUpdatedTimeStamp(new Date().getTime().toString());
            }
        });

        mouseTrapClient.bindNewKey(['command+shift+z', 'ctrl+y'], async () => {
            const lastsource = undoRedoManager.redo();
            if (lastsource) {
                props.updateFileContent(history[history.length - 1].file, lastsource);
                setUpdatedTimeStamp(new Date().getTime().toString());
            }
        });

        return () => {
            mouseTrapClient.resetMouseTrapInstance();
        }
    }, [focusedST]);

    useEffect(() => {
        (async () => {
            const version: string = await getBallerinaVersion();
            setBalVersion(version);
        })();
    }, []);

    useEffect(() => {
        if (diagramFocus) {
            const { filePath, position } = diagramFocus;
            if (position) historyPush({ file: extractFilePath(filePath), position });
            else historyPush({ file: extractFilePath(filePath) });
        }
    }, [diagramFocus]);

    useEffect(() => {
        setUpdatedTimeStamp(lastUpdatedAt);
    }, [lastUpdatedAt]);

    useEffect(() => {
        if (history.length > 0) {
            (async () => {
                const { file: filePath, position, uid } = history[history.length - 1];
                const file = extractFilePath(filePath);
                const langClient = await langClientPromise;

                const componentResponse: BallerinaProjectComponents = await langClient.getBallerinaProjectComponents({
                    documentIdentifiers: [
                        {
                            uri: monaco.Uri.file(file).toString(),
                        }
                    ]
                });

                componentResponse?.packages?.forEach((pkg: any) => {
                    pkg.filePath = decodeURI(pkg.filePath);
                });

                if (file.endsWith(".bal")) {
                    setIsLoadingST(true);
                    const generatedST = await getSyntaxTree(file, langClient);
                    let visitedST = await getLowcodeST(generatedST, file, langClient, experimentalEnabled);
                    const currentTime: number = Date.now();
                    if (currentTime - lastPerfUpdate > debounceTime) {
                        visitedST = await addPerformanceDataNew(visitedST, file, langClient, props.showPerformanceGraph, props.getPerfDataFromChoreo, setFocusedST);
                        lastPerfUpdate = currentTime;
                    }
                    const content = await getFileContent(file);
                    const resourceVersion = await getEnv("BALLERINA_LOW_CODE_RESOURCES_VERSION");
                    const envInstance = await getEnv("VSCODE_CHOREO_SENTRY_ENV");

                    let selectedST;

                    if (!uid && position) {
                        const uidGenVisitor = new UIDGenerationVisitor(position);
                        traversNode(visitedST, uidGenVisitor);
                        const generatedUid = uidGenVisitor.getUId();
                        const nodeFindingVisitor = new FindNodeByUidVisitor(generatedUid);
                        traversNode(visitedST, nodeFindingVisitor);
                        selectedST = nodeFindingVisitor.getNode();

                        if (generatedUid) {
                            updateCurrentEntry({ ...history[history.length - 1], uid: generatedUid });
                        } else {
                            setShowIdentificationFailureMessage(true);
                        }
                    }

                    if (uid && position) {
                        const nodeFindingVisitor = new FindNodeByUidVisitor(uid);
                        traversNode(visitedST, nodeFindingVisitor);

                        if (!nodeFindingVisitor.getNode()) {
                            const visitorToFindConstructByName = new FindConstructByNameVisitor(uid);
                            traversNode(visitedST, visitorToFindConstructByName);

                            if (visitorToFindConstructByName.getNode()) {
                                selectedST = visitorToFindConstructByName.getNode();

                                updateCurrentEntry({
                                    ...history[history.length - 1], uid: visitorToFindConstructByName.getUid()
                                });
                            } else {
                                const visitorToFindConstructByIndex =
                                    new FindConstructByIndexVisitor(uid, getConstructBodyString(focusedST));
                                traversNode(visitedST, visitorToFindConstructByIndex);
                                if (visitorToFindConstructByIndex.getNode()) {
                                    selectedST = visitorToFindConstructByIndex.getNode();

                                    updateCurrentEntry({
                                        ...history[history.length - 1], uid: visitorToFindConstructByIndex.getUid()
                                    });
                                } else {
                                    setShowIdentificationFailureMessage(true);
                                }
                            }

                        } else {
                            selectedST = nodeFindingVisitor.getNode();
                        }
                    }

                    if (selectedST && STKindChecker.isFunctionDefinition(selectedST)
                        && STKindChecker.isExpressionFunctionBody(selectedST.functionBody)) {
                        if (!history[history.length - 1].fromDataMapper) {
                            updateCurrentEntry({
                                ...history[history.length - 1],
                                fromDataMapper: true,
                                dataMapperDepth: 0,
                                name: selectedST.functionName.value
                            });
                        }
                    }

                    undoRedoManager.updateContent(file, content);
                    if (selectedST
                        && (STKindChecker.isModuleVarDecl(selectedST)
                            || STKindChecker.isConstDeclaration(selectedST))) {

                        if (selectedST.typeData && selectedST.typeData.isEndpoint) {
                            // historyPop();
                            // TODO: Fix connector editing scenario
                            const config = {
                                model: selectedST,
                                connectorInfo: generateClientInfo(selectedST as ModuleVarDecl),
                                wizardType: ConnectorWizardType.ENDPOINT,
                                diagramPosition: { x: 0, y: 0 },
                                targetPosition: selectedST.position,
                                onClose: () => {
                                    setConnectorConfig(undefined);
                                    historyPop();
                                },
                                onSave: () => {
                                    setConnectorConfig(undefined);
                                    historyPop();
                                },
                                isModuleType: true
                            }

                            setCompleteST(visitedST);
                            setConnectorConfig({
                                ...config
                            });
                        } else {
                            setFormConfig({
                                model: selectedST,
                                configOverlayFormStatus: {
                                    isLoading: false,
                                    formArgs: {
                                        model: selectedST,
                                        targetPosition: selectedST.position,
                                        type: getFormTypeFromST(selectedST)
                                    },
                                    formType: getFormTypeFromST(selectedST)
                                },
                                onCancel: () => {
                                    setFormConfig(undefined);
                                    historyPop();
                                },
                                onSave: () => {
                                    setFormConfig(undefined);
                                    historyPop();
                                },
                                targetPosition: selectedST.position,
                            });
                        }
                    } else {
                        setFocusedST(selectedST);
                        setCompleteST(visitedST);
                    }
                    setLowCodeResourcesVersion(resourceVersion);
                    setLowCodeEnvInstance(envInstance);
                    setCurrentFileContent(content);
                    setIsLoadingST(false);

                } else {
                    setFocusedST(undefined);
                    setCompleteST(undefined);
                    setCurrentFileContent(undefined);
                }

                setProjectComponents(componentResponse);
            })();
            setShowIdentificationFailureMessage(false);
        }
    }, [history[history.length - 1], updatedTimeStamp]);

    const updateActiveFile = (currentFile: FileListEntry) => {
        historyPush({ file: currentFile.uri.fsPath });
    };

    const navigateUptoParent = (position: NodePosition): void => {
        const { file } = history[history.length - 1];
        historyPush({ file, position });
    }

    const updateSelectedComponent = (info: ComponentViewInfo): void => {
        const { filePath, position } = info;
        historyPush({ file: filePath, position });
    }

    const showOverviewMode: boolean = history.length > 0 && history[history.length - 1].file !== undefined
        && focusedST === undefined;
    const showSTMode: boolean = history.length > 0 && history[history.length - 1].file !== undefined
        && history[history.length - 1].position !== undefined && focusedST !== undefined;


    const diagramProps = getDiagramProviderProps(
        focusedST,
        lowCodeEnvInstance,
        currentFileContent,
        history.length > 0 && history[history.length - 1].file,
        fileList,
        history.length > 0 && history[history.length - 1].uid,
        completeST,
        lowCodeResourcesVersion,
        balVersion,
        props,
        undoRedoManager,
        setFocusedST,
        setCompleteST,
        setCurrentFileContent,
        updateActiveFile,
        updateSelectedComponent,
        navigateUptoParent,
        setUpdatedTimeStamp
    );


    const handleNavigationHome = () => {
        historyClearAndPopulateWith({
            file: extractFilePath(history[history.length - 1].file)
        });
    }

    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.lowCodeContainer}>
                <IntlProvider locale='en' defaultLocale='en' messages={messages}>
                    <HistoryProvider
                        history={history}
                        historyPush={historyPush}
                        historyPop={historyPop}
                        historyClearAndPopulateWith={historyClearAndPopulateWith}
                        historySelect={historySelect}
                        historyReset={historyClear}
                        historyUpdateCurrentEntry={updateCurrentEntry}
                    >
                        <ViewManagerProvider
                            {...diagramProps}
                        >
                            <NavigationBar
                                workspaceName={workspaceName}
                                projectList={projectPaths}
                                projectInfo={projectComponents}
                            />
                            {!showOverviewMode && !showSTMode && !showIdentificationFailureMessage && <TextPreLoader position={'absolute'} />}
                            {!showOverviewMode && !showSTMode && showIdentificationFailureMessage && <FailedToIdentifyMessageOverlay onResetClick={handleNavigationHome} />}
                            {showOverviewMode && <ComponentListView lastUpdatedAt={updatedTimeStamp} projectComponents={projectComponents} />}
                            {showSTMode && <DiagramView projectComponents={projectComponents} isLoading={isLoadingST} />}
                            {!!formConfig && <FormGenerator {...formConfig} />}
                            {!!connectorConfig && <ConnectorWizard {...connectorConfig} />}
                            <div id={'canvas-overlay'} className={"overlayContainer"} />
                        </ViewManagerProvider>
                    </HistoryProvider>
                </IntlProvider>
            </div>
        </MuiThemeProvider>
    )
}

