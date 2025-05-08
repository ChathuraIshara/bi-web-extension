/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";

import { MuiThemeProvider } from "@material-ui/core";
import { BallerinaProjectComponents, FileListEntry, Uri } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition, STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";

import { Provider as ViewManagerProvider } from "../Contexts/Diagram";
import { Diagram } from "../Diagram";
import { DataMapperOverlay } from "../Diagram/components/DataMapperOverlay";
import { GraphqlDiagramOverlay } from "../Diagram/components/GraphqlDiagramOverlay";
import { ServiceDesignOverlay } from "../Diagram/components/ServiceDesignOverlay";
import { ServiceInvalidOverlay } from "../Diagram/components/ServiceInvalidOverlay";
import { ServiceUnsupportedOverlay } from "../Diagram/components/ServiceUnsupported";
import { FindConstructByIndexVisitor } from "../Diagram/visitors/find-construct-by-index-visitor";
import { FindConstructByNameVisitor } from "../Diagram/visitors/find-construct-by-name-visitor";
import { FindNodeByUidVisitor } from "../Diagram/visitors/find-node-by-uid";
import { UIDGenerationVisitor } from "../Diagram/visitors/uid-generation-visitor";
import { getConstructBodyString } from "../Diagram/visitors/util";
import {
    getLowcodeST,
    getSyntaxTree
} from "../DiagramGenerator/generatorUtil";
import { addPerformanceData, addPerformanceDataNew } from "../DiagramGenerator/performanceUtil";
import { EditorProps, WorkspaceFolder } from "../DiagramGenerator/vscode/Diagram";
import messages from '../lang/en.json';
import { OverviewDiagram } from "../OverviewDiagram";
import { ComponentViewInfo } from "../OverviewDiagram/util";
import { TextPreLoader } from "../PreLoader/TextPreLoader";

import { Provider as HistoryProvider } from './context/history';
import { useComponentHistory } from "./hooks/history";
import { NavigationBar } from "./NavigationBar";
import { useGeneratorStyles } from './style';
import { theme } from "./theme";
import { extractFilePath, getDiagramProviderProps, getSTNodeForReference, pathIncludesIn } from "./utils";

const debounceTime: number = 5000;
let lastPerfUpdate = 0;

/**
 * Handles the rendering of the Diagram views(lowcode, datamapper, service etc.)
 */
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
        getAllFiles,
        gotoSource,
        diagramFocus
    } = props;
    const classes = useGeneratorStyles();
    const [currentFileContent, setCurrentFileContent] = useState<string>();
    const [
        history,
        historyPush,
        historyPop,
        historyClearAndPopulateWith,
        historySelect,
        historyClear,
        updateCurrentEntry
    ] = useComponentHistory();
    const [updatedTimeStamp, setUpdatedTimeStamp] = useState<string>();
    const [currentProject, setCurrentProject] = useState<WorkspaceFolder>();
    const [fileList, setFileList] = useState<FileListEntry[]>();
    const [focusFile, setFocusFile] = useState<string>();
    const [focusedST, setFocusedST] = useState<STNode>();
    const [lowCodeResourcesVersion, setLowCodeResourcesVersion] = React.useState(undefined);
    const [lowCodeEnvInstance, setLowCodeEnvInstance] = React.useState("");
    const [balVersion, setBalVersion] = React.useState("");
    const [completeST, setCompleteST] = useState<STNode>();
    const [serviceTypeSignature, setServiceTypeSignature] = useState<string>();
    const [isLoadingST, setIsLoadingST] = useState<boolean>(false);

    projectPaths.forEach(path => {
        path.uri.path = extractFilePath(path.uri.path);
    })

    useEffect(() => {
        if (diagramFocus) {
            const { filePath: inputPath, position } = diagramFocus;
            const filePath = extractFilePath(inputPath);

            if (filePath && filePath.length > 0 && filePath !== focusFile) {
                if (position) {
                    historyClearAndPopulateWith({ file: filePath, position });
                } else {
                    historyClear();

                    (async () => {
                        const currentProjectPath = projectPaths
                            && projectPaths.find(projectPath => pathIncludesIn(filePath, projectPath.uri.path));
                        const response = await getAllFiles('**/*.bal');
                        const filteredFileList: Uri[] = response
                            .filter(fileUri => {
                                fileUri.path = extractFilePath(fileUri.path);
                                return pathIncludesIn(fileUri.path, currentProjectPath.uri.path);
                            });
                        const projectFiles: FileListEntry[] = filteredFileList.map(fileUri => ({
                            fileName: fileUri.path.replace(`${currentProjectPath.uri.path}/`, ''),
                            uri: fileUri
                        }));
                        const currentFile = projectFiles
                            .find(projectFile => pathIncludesIn(projectFile.uri.path, filePath));
                        setCurrentProject(currentProjectPath);
                        setFocusFile(currentFile.uri.path);
                    })();
                }
            } else if (position) {
                historyClearAndPopulateWith({ file: filePath, position });
            }
        }
    }, [diagramFocus]);

    useEffect(() => {
        if (history.length > 0) {
            const { file, position, uid } = history[history.length - 1];
            fetchST(file, uid ? { uid } : { position });
            const currentProjectPath = projectPaths
                && projectPaths.find(projectPath => pathIncludesIn(file, projectPath.uri.path));

            if (!currentProject || (currentProjectPath && currentProject.name !== currentProjectPath.name)) {
                setCurrentProject(currentProjectPath);
            }
            if (!focusFile || focusFile !== file) setFocusFile(file);
        } else {
            setFocusedST(undefined);
            // setFocusUid(undefined);
        }
    }, [history[history.length - 1]]);

    useEffect(() => {
        if (currentProject) {
            (async () => {
                const response = await getAllFiles('**/*.bal');

                response.forEach((fileUri) => {
                    fileUri.path = extractFilePath(fileUri.path);
                });

                const fileListResponse: Uri[] = response
                    .filter(fileUri => pathIncludesIn(fileUri.path, currentProject.uri.path));
                const projectFiles: FileListEntry[] = fileListResponse.map(fileUri => ({
                    fileName: fileUri.path.replace(`${currentProject.uri.path}/`, ''),
                    uri: fileUri
                }));

                setFileList(projectFiles);
            })();
        }
    }, [currentProject?.name]);

    useEffect(() => {
        setUpdatedTimeStamp(lastUpdatedAt);
    }, [lastUpdatedAt]);

    useEffect(() => {
        if (history.length === 0 || !history[history.length - 1].uid) return;
        fetchST(focusFile, { uid: history[history.length - 1].uid });
    }, [updatedTimeStamp]);

    useEffect(() => {
        (async () => {
            const version: string = await getBallerinaVersion();
            setBalVersion(version);
        })();
    }, []);



    // TODO: move to util file
    const fetchST = (filePath: string, options?: { position?: NodePosition, uid?: string }) => {
        (async () => {
            try {
                setIsLoadingST(true);
                const langClient = await langClientPromise;
                const generatedST = await getSyntaxTree(filePath, langClient);
                let visitedST = await getLowcodeST(generatedST, filePath, langClient, experimentalEnabled);
                const currentTime: number = Date.now();
                if (currentTime - lastPerfUpdate > debounceTime) {
                    visitedST = await addPerformanceDataNew(visitedST, filePath, langClient, props.showPerformanceGraph, props.getPerfDataFromChoreo, setFocusedST);
                    lastPerfUpdate = currentTime;
                }
                const content = await getFileContent(filePath);
                const resourceVersion = await getEnv("BALLERINA_LOW_CODE_RESOURCES_VERSION");
                const envInstance = await getEnv("VSCODE_CHOREO_SENTRY_ENV");
                let selectedST;

                if (options && options.position) {
                    const uidGenVisitor = new UIDGenerationVisitor(options.position);
                    traversNode(visitedST, uidGenVisitor);
                    const generatedUid = uidGenVisitor.getUId();
                    const nodeFindingVisitor = new FindNodeByUidVisitor(generatedUid);
                    traversNode(visitedST, nodeFindingVisitor);
                    selectedST = nodeFindingVisitor.getNode();
                    // setFocusUid(generatedUid);
                    updateCurrentEntry({ ...history[history.length - 1], uid: generatedUid });
                }

                if (options && options.uid) {
                    const nodeFindingVisitor = new FindNodeByUidVisitor(options.uid);
                    traversNode(visitedST, nodeFindingVisitor);
                    if (!nodeFindingVisitor.getNode()) {
                        const visitorToFindConstructByName = new FindConstructByNameVisitor(options.uid);
                        traversNode(visitedST, visitorToFindConstructByName);
                        if (visitorToFindConstructByName.getNode()) {
                            selectedST = visitorToFindConstructByName.getNode();
                            // setFocusUid(visitorToFindConstructByName.getUid());
                            updateCurrentEntry({
                                ...history[history.length - 1], uid: visitorToFindConstructByName.getUid()
                            });
                        } else {
                            const visitorToFindConstructByIndex =
                                new FindConstructByIndexVisitor(options.uid, getConstructBodyString(focusedST));
                            traversNode(visitedST, visitorToFindConstructByIndex);
                            if (visitorToFindConstructByIndex.getNode()) {
                                selectedST = visitorToFindConstructByIndex.getNode();
                                // setFocusUid(visitorToFindConstructByIndex.getUid());
                                updateCurrentEntry({
                                    ...history[history.length - 1], uid: visitorToFindConstructByIndex.getUid()
                                });
                            } else {
                                // TODO:  Add error message saying we can't find the construct
                            }
                        }

                    } else {
                        selectedST = nodeFindingVisitor.getNode();
                    }
                }

                // resolve the service type if the ST is a service
                let listenerSignature: string;
                if (selectedST && STKindChecker.isServiceDeclaration(selectedST)) {
                    const listenerExpression = selectedST.expressions[0];
                    if (STKindChecker.isExplicitNewExpression(listenerExpression)) {
                        const typeData = listenerExpression.typeData;
                        const typeSymbol = typeData?.typeSymbol;
                        listenerSignature = typeSymbol?.signature;
                    } else {
                        try {
                            const listenerSTDecl = await getSTNodeForReference(filePath, listenerExpression.position, langClient);
                            if (listenerSTDecl) {
                                const typeData = listenerExpression.typeData;
                                const typeSymbol = typeData?.typeSymbol;
                                listenerSignature = typeSymbol?.signature;
                            }
                        } catch (err) {
                            // tslint:disable-next-line: no-console
                            console.error(err);
                        }
                    }
                }

                if (options && (options.position || options.uid)) {
                    setFocusedST(selectedST);
                    setServiceTypeSignature(listenerSignature);
                }
                setCompleteST(visitedST);
                setCurrentFileContent(content);
                setLowCodeResourcesVersion(resourceVersion);
                setLowCodeEnvInstance(envInstance);
                setIsLoadingST(false);
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err);
            }
        })();
    }

    const updateSelectedComponent = (componentDetails: ComponentViewInfo) => {
        const { filePath, position, name } = componentDetails;
        historyPush({
            file: filePath,
            position,
            name
        });
    }

    const handleNavigationHome = () => {
        historyClear();
    }

    const updateFileContent = async () => {
        if (focusFile) {
            const content = await getFileContent(focusFile);
            setCurrentFileContent(content);
        }
    }

    let viewComponent: React.ReactElement;

    if (history.length > 0 && history[history.length - 1].position && !focusedST) {
        viewComponent = (<TextPreLoader position={'absolute'} />);
    } else if (!focusedST && fileList) {
        const currentFileName = fileList.find(file => file.uri.path === focusFile)?.fileName;
        viewComponent = (
            <OverviewDiagram
                currentProject={currentProject}
                currentFile={focusFile}
                currentFileName={currentFileName}
                notifyComponentSelection={updateSelectedComponent}
                updateCurrentFile={setFocusFile}
                fileList={fileList}
                lastUpdatedAt={updatedTimeStamp}
                triggerUpdateFileContent={updateFileContent}
            />
        );
    } else if (focusedST) {
        if (STKindChecker.isServiceDeclaration(focusedST)) {
            const listenerExpression = focusedST.expressions[0];
            const typeData = listenerExpression.typeData;
            const typeSymbol = typeData?.typeSymbol;
            const signature = typeSymbol?.signature;
            if (serviceTypeSignature && serviceTypeSignature.includes('http')) {
                viewComponent = (
                    <ServiceDesignOverlay
                        model={focusedST}
                        targetPosition={{ ...focusedST.position, startColumn: 0, endColumn: 0 }}
                        onCancel={handleNavigationHome}
                    />
                );
            } else if (serviceTypeSignature && serviceTypeSignature.includes('graphql')) {
                viewComponent = (
                    <GraphqlDiagramOverlay
                        model={focusedST}
                        targetPosition={focusedST.position}
                        ballerinaVersion={balVersion}
                        onCancel={handleNavigationHome}
                        goToSource={gotoSource}
                        isLoadingST={isLoadingST}
                    />
                );
            } else if (signature && signature === "$CompilationError$") {
                viewComponent = (
                    <ServiceInvalidOverlay />
                );
            } else {
                viewComponent = (
                    <ServiceUnsupportedOverlay />
                )
            }
        } else if (currentFileContent && STKindChecker.isFunctionDefinition(focusedST)
            && STKindChecker.isExpressionFunctionBody(focusedST.functionBody)) {
            viewComponent = (
                <DataMapperOverlay
                    currentProject={currentProject}
                    lastUpdatedAt={updatedTimeStamp}
                    targetPosition={{ ...focusedST.position, startColumn: 0, endColumn: 0 }}
                    model={focusedST}
                    ballerinaVersion={balVersion}
                    onCancel={handleNavigationHome}
                />
            )
        } else if (STKindChecker.isTypeDefinition(focusedST)
            && STKindChecker.isRecordTypeDesc(focusedST.typeDescriptor)) {
            // Navigate to record composition view
            const recordST = { ...focusedST }; // Clone focusedST
            const name = recordST.typeName.value;
            const module = recordST.typeData?.symbol?.moduleID;
            if (!(name && module)) {
                // TODO: Handle error properly
                // tslint:disable-next-line
                console.error('Couldn\'t generate record nodeId to open Architecture view', recordST);
            } else {
                const nodeId = `${module?.orgName}/${module?.moduleName}:${module?.version}:${name}`
                props.openArchitectureView(nodeId);
            }
            // Show file view, clear focus syntax tree
            setFocusedST(undefined);
            // setFocusUid(undefined);
            handleNavigationHome();
        } else {
            viewComponent = (<Diagram />);
        }
    }

    const navigateUptoParent = (position: NodePosition) => {
        if (!position) {
            return;
        }

        const currentHistoryEntry = structuredClone(history[history.length - 1]);
        currentHistoryEntry.position = position;
        currentHistoryEntry.uid = undefined;
        historyPush(currentHistoryEntry);
    }

    const updateActiveFile = (currentFile: FileListEntry) => {
        setFocusFile(currentFile.uri.fsPath);
        fetchST(currentFile.uri.fsPath);
    };

    const handleProjectChange = (project: WorkspaceFolder) => {
        setCurrentProject(project);
        setFocusFile(undefined);
        // setFocusUid(undefined);
        setFocusedST(undefined);
        historyClear();
    }

    const diagramProps = getDiagramProviderProps(
        focusedST,
        lowCodeEnvInstance,
        currentFileContent,
        focusFile,
        fileList,
        history.length > 0 && history[history.length - 1].uid,
        completeST,
        lowCodeResourcesVersion,
        balVersion,
        props,
        setFocusedST,
        setCompleteST,
        setCurrentFileContent,
        updateActiveFile,
        updateSelectedComponent,
        navigateUptoParent,
        setUpdatedTimeStamp
    );

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <div className={classes.lowCodeContainer}>
                    <IntlProvider locale='en' defaultLocale='en' messages={messages}>
                        <ViewManagerProvider
                            {...diagramProps}
                        >
                            <HistoryProvider
                                history={history}
                                historyPush={historyPush}
                                historyPop={historyPop}
                                historyClearAndPopulateWith={historyClearAndPopulateWith}
                                historySelect={historySelect}
                                historyReset={historyClear}
                            >
                                <NavigationBar
                                    workspaceName={workspaceName}
                                    projectList={projectPaths}
                                    currentProject={currentProject}
                                    updateCurrentProject={handleProjectChange}
                                />
                                {viewComponent}
                                <div id={'canvas-overlay'} className={"overlayContainer"} />
                            </HistoryProvider>
                        </ViewManagerProvider>
                    </IntlProvider>
                </div>
            </MuiThemeProvider>
        </div>
    )


    async function addPerfData(filePath: string) {
        const currentTime: number = Date.now();
        const langClient = await langClientPromise;
        if (currentTime - lastPerfUpdate > debounceTime) {
            await addPerformanceData(focusedST, filePath, langClient, props.showPerformanceGraph, props.getPerfDataFromChoreo, setFocusedST);
            lastPerfUpdate = currentTime;
        }
    }
}

