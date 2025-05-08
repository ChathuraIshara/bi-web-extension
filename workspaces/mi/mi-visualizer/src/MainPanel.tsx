import React, { useEffect, useState } from 'react';
import { EVENT_TYPE, POPUP_EVENT_TYPE, PopupMachineStateValue, MACHINE_VIEW, MachineStateValue, Platform } from '@wso2-enterprise/mi-core';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import { ServiceDesignerView } from './views/ServiceDesigner';
import { DSSServiceDesignerView } from './views/Forms/DataServiceForm/ServiceDesigner';
import { APIWizard, APIWizardProps } from './views/Forms/APIform';
import { EndpointWizard } from './views/Forms/EndpointForm';
import { SequenceWizard } from './views/Forms/SequenceForm';
import { NavigationBar } from './components/NavigationBar';
import { ProjectWizard } from './views/Forms/ProjectForm';
import { ImportProjectWizard } from './views/Forms/ImportProjectForm';
import { TaskForm } from './views/Forms/TaskForm';
import { MessageStoreWizard } from './views/Forms/MessageStoreForm/index';
import { MessageProcessorWizard } from "./views/Forms/MessageProcessorForm";
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import styled from '@emotion/styled';
import { InboundEPWizard } from './views/Forms/InboundEPform';
import { LocalEntryWizard } from './views/Forms/LocalEntryForm';
import { RegistryResourceForm } from './views/Forms/RegistryResourceForm';
import { RegistryMetadataForm } from './views/Forms/RegistryMetadataForm';
import { ProxyServiceWizard } from "./views/Forms/ProxyServiceForm";
import { TemplateWizard } from "./views/Forms/TemplateForm";
import { ClassMediatorForm } from './views/Forms/ClassMediatorForm';
import { BallerinaModuleForm } from './views/Forms/BallerinaModuleForm';
import { DataSourceWizard } from './views/Forms/DataSourceForm';
import { HttpEndpointWizard } from "./views/Forms/HTTPEndpointForm/index";
import { AddressEndpointWizard } from "./views/Forms/AddressEndpointForm";
import { WsdlEndpointWizard } from "./views/Forms/WSDLEndpointForm/index";
import { DefaultEndpointWizard } from "./views/Forms/DefaultEndpointForm";
import { LoadBalanceWizard } from './views/Forms/LoadBalanceEPform';
import { FailoverWizard } from './views/Forms/FailoverEndpointForm';
import { APIResource, NamedSequence, Proxy, Template, MockService, UnitTest, Task, InboundEndpoint } from '@wso2-enterprise/mi-syntax-tree/lib/src';
import { ProxyView, ResourceView, SequenceView } from './views/Diagram';
import { RecipientWizard } from './views/Forms/RecipientEndpointForm';
import { TemplateEndpointWizard } from './views/Forms/TemplateEndpointForm';
import { UnsupportedProject, UnsupportedProjectProps } from './views/UnsupportedProject';
import { DataMapper } from './views/DataMapper';
import { ErrorBoundary, FormView } from '@wso2-enterprise/ui-toolkit';
import PopupPanel from './PopupPanel';
import { AddArtifactView } from './views/AddArtifact';
import { SequenceTemplateView } from './views/Diagram/SequenceTemplate';
import { ConnectionWizard } from './views/Forms/ConnectionForm';
import { TestSuiteForm } from './views/Forms/Tests/TestSuiteForm';
import { TestCaseForm } from './views/Forms/Tests/TestCaseForm';
import { MockServiceForm } from './views/Forms/Tests/MockServices/MockServiceForm';
import { DataServiceWizard } from './views/Forms/DataServiceForm/MainPanelForms';
import { DataServiceView } from './views/Diagram/DataService';
import { SignInToCopilotMessage } from './views/LoggedOutWindow';
import { DataServiceDataSourceWizard } from "./views/Forms/DataServiceForm/MainPanelForms/DataSourceForm/DatasourceForm";
import { UpdateMIExtension } from './views/UpdateExtension';
import AddConnection from './views/Forms/ConnectionForm/ConnectionFormGenerator';
import { SamplesView } from './views/SamplesView';
import { WelcomeView } from './views/WelcomeView';
import { TaskView } from './views/Diagram/Task';
import { InboundEPView } from './views/Diagram/InboundEndpoint';
import { Overview } from './views/Overview';
import { DatamapperForm } from './views/Forms/DatamapperForm';
import { ImportArtfactForm } from './views/Forms/ImportArtifactForm';

const MainContainer = styled.div`
    display: flex;
    overflow: hidden;
`;

const MainContent = styled.div`
    flex-grow: 1;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    width: 100vw;
`;

const ProgressRing = styled(VSCodeProgressRing)`
    height: 40px;
    width: 40px;
    margin-top: auto;
    padding: 4px;
`;

const PopUpContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2100;
    background: var(--background);
`;

const ViewContainer = styled.div({});

const MainPanel = ({ handleResetError }: { handleResetError: () => void }) => {
    const { rpcClient, setIsLoading } = useVisualizerContext();
    const [viewComponent, setViewComponent] = useState<React.ReactNode>();
    const [machineView, setMachineView] = useState<MACHINE_VIEW>();
    const [showNavigator, setShowNavigator] = useState<boolean>(true);
    const [formState, setFormState] = useState<PopupMachineStateValue>('initialize');
    const [stateUpdated, setStateUpdated] = React.useState<boolean>(false);

    rpcClient?.onStateChanged((newState: MachineStateValue) => {
        if (typeof newState === 'object' && 'newProject' in newState && newState.newProject === 'viewReady') {
            setStateUpdated(!stateUpdated);
        }
        if (typeof newState === 'object' && 'ready' in newState && newState.ready === 'viewReady') {
            handleResetError();
            setStateUpdated(!stateUpdated);
        }
        if (typeof newState === 'object' && 'ready' in newState && newState.ready === 'viewEditing') {
            rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.EDIT_DONE, location: null });
            setStateUpdated(!stateUpdated);
        }
    });

    rpcClient?.onPopupStateChanged((newState: PopupMachineStateValue) => {
        setFormState(newState);
    });

    useEffect(() => {
        fetchContext();
    }, [stateUpdated]);

    useEffect(() => {
        rpcClient.getVisualizerState().then((machineView) => {
            setMachineView(machineView.view);
            rpcClient.getMiDiagramRpcClient().executeCommand({ commands: ['setContext', 'MI.showAddArtifact', viewComponent && machineView.view !== MACHINE_VIEW.ADD_ARTIFACT] });
        });
    }, [viewComponent]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'i' && (event.metaKey || event.ctrlKey)) {
                rpcClient.getMiDiagramRpcClient().executeCommand({ commands: ["MI.openAiPanel"] });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const getUniqueKey = (model: any, documentUri: string) => {
        return `${JSON.stringify(model?.range)}-${documentUri}`;
    }

    const fetchContext = () => {
        setIsLoading(true);
        rpcClient.getVisualizerState().then(async (machineView) => {
            const isWindows = machineView.platform === Platform.WINDOWS;
            let shouldShowNavigator = true;
            switch (machineView?.view) {
                case MACHINE_VIEW.Overview:
                    setViewComponent(<Overview />);
                    break;
                case MACHINE_VIEW.ADD_ARTIFACT:
                    setViewComponent(<AddArtifactView />);
                    break;
                case MACHINE_VIEW.UnsupportedProject:
                    setViewComponent(
                        <UnsupportedProject
                            displayOverview={(machineView.customProps as UnsupportedProjectProps)?.displayOverview}
                        />
                    );
                    break;
                case MACHINE_VIEW.ResourceView:
                    setViewComponent(
                        <ResourceView
                            key={getUniqueKey(machineView.stNode, machineView.documentUri)}
                            model={machineView.stNode as APIResource}
                            documentUri={machineView.documentUri}
                            diagnostics={machineView.diagnostics}
                        />
                    );
                    await rpcClient.getMiDiagramRpcClient().initUndoRedoManager({ path: machineView.documentUri });
                    break;
                case MACHINE_VIEW.SequenceView:
                    setViewComponent(
                        <SequenceView
                            key={getUniqueKey(machineView.stNode, machineView.documentUri)}
                            model={machineView.stNode as NamedSequence}
                            documentUri={machineView.documentUri}
                            diagnostics={machineView.diagnostics}
                        />
                    );
                    await rpcClient.getMiDiagramRpcClient().initUndoRedoManager({ path: machineView.documentUri });
                    break;
                case MACHINE_VIEW.SequenceTemplateView:
                    setViewComponent(
                        <SequenceTemplateView
                            key={getUniqueKey(machineView.stNode, machineView.documentUri)}
                            model={machineView.stNode as Template}
                            documentUri={machineView.documentUri}
                            diagnostics={machineView.diagnostics}
                        />
                    );
                    await rpcClient.getMiDiagramRpcClient().initUndoRedoManager({ path: machineView.documentUri });
                    break;
                case MACHINE_VIEW.ProxyView:
                    setViewComponent(
                        <ProxyView
                            key={getUniqueKey(machineView.stNode, machineView.documentUri)}
                            model={machineView.stNode as Proxy}
                            documentUri={machineView.documentUri}
                            diagnostics={machineView.diagnostics}
                        />
                    );
                    await rpcClient.getMiDiagramRpcClient().initUndoRedoManager({ path: machineView.documentUri });
                    break;
                case MACHINE_VIEW.DataServiceView:
                    setViewComponent(
                        <DataServiceView
                            key={getUniqueKey(machineView.stNode, machineView.documentUri)}
                            model={machineView.stNode as any}
                            href={machineView.identifier}
                            documentUri={machineView.documentUri}
                            diagnostics={machineView.diagnostics}
                        />
                    );
                    await rpcClient.getMiDiagramRpcClient().initUndoRedoManager({ path: machineView.documentUri });
                    break;
                case MACHINE_VIEW.ServiceDesigner:
                    setViewComponent(<ServiceDesignerView syntaxTree={machineView.stNode} documentUri={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.DataMapperView:
                    setViewComponent(
                        <ErrorBoundary errorMsg="An error occurred in the MI Data Mapper">
                            <DataMapper {...machineView.dataMapperProps} />
                        </ErrorBoundary >
                    );
                    const { filePath, fileContent } = machineView.dataMapperProps;
                    await rpcClient.getMiDataMapperRpcClient().initDMUndoRedoManager({ filePath, fileContent });
                    break;
                case MACHINE_VIEW.APIForm:
                    setViewComponent(<APIWizard apiData={(machineView.customProps as APIWizardProps)?.apiData} path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.EndPointForm:
                    setViewComponent(<EndpointWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.LoadBalanceEndPointForm:
                    setViewComponent(<LoadBalanceWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.FailoverEndPointForm:
                    setViewComponent(<FailoverWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.RecipientEndPointForm:
                    setViewComponent(<RecipientWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.TemplateEndPointForm:
                    setViewComponent(<TemplateEndpointWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.SequenceForm:
                    setViewComponent(<SequenceWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.DatamapperForm:
                    setViewComponent(<DatamapperForm path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.InboundEPForm:
                    setViewComponent(<InboundEPWizard
                        path={machineView.documentUri}
                        model={machineView.customProps?.model as InboundEndpoint} />);
                    break;
                case MACHINE_VIEW.InboundEPView:
                    setViewComponent(<InboundEPView
                        path={machineView.documentUri}
                        model={machineView.stNode as InboundEndpoint}
                        diagnostics={machineView.diagnostics} />);
                    break;
                case MACHINE_VIEW.RegistryResourceForm:
                    setViewComponent(<RegistryResourceForm path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.RegistryMetadataForm:
                    setViewComponent(<RegistryMetadataForm path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.MessageProcessorForm:
                    setViewComponent(<MessageProcessorWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.ProxyServiceForm:
                    setViewComponent(<ProxyServiceWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.TaskForm:
                    setViewComponent(<TaskForm path={machineView.documentUri} type={machineView?.customProps?.type} />);
                    break;
                case MACHINE_VIEW.TaskView:
                    setViewComponent(<TaskView
                        path={machineView.documentUri}
                        model={machineView.stNode as Task}
                        diagnostics={machineView.diagnostics} />);
                    break;
                case MACHINE_VIEW.TemplateForm:
                    const templateType = machineView.customProps && machineView.customProps.type ? machineView.customProps.type : '';
                    setViewComponent(<TemplateWizard path={machineView.documentUri} type={templateType} />);
                    break;
                case MACHINE_VIEW.HttpEndpointForm:
                    setViewComponent(<HttpEndpointWizard path={machineView.documentUri} type={machineView.customProps.type} />);
                    break;
                case MACHINE_VIEW.AddressEndpointForm:
                    setViewComponent(<AddressEndpointWizard path={machineView.documentUri} type={machineView.customProps.type} />);
                    break;
                case MACHINE_VIEW.WsdlEndpointForm:
                    setViewComponent(<WsdlEndpointWizard path={machineView.documentUri} type={machineView.customProps.type} />);
                    break;
                case MACHINE_VIEW.DefaultEndpointForm:
                    setViewComponent(<DefaultEndpointWizard path={machineView.documentUri} type={machineView.customProps.type} />);
                    break;
                case MACHINE_VIEW.DataServiceForm:
                    setViewComponent(<DataServiceWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.DssDataSourceForm:
                    setViewComponent(<DataServiceDataSourceWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.ProjectCreationForm:
                    setViewComponent(<ProjectWizard cancelView={MACHINE_VIEW.Overview} />);
                    shouldShowNavigator = false;
                    break;
                case MACHINE_VIEW.LocalEntryForm:
                    setViewComponent(<LocalEntryWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.ImportProjectForm:
                    setViewComponent(<ImportProjectWizard />);
                    break;
                case MACHINE_VIEW.MessageStoreForm:
                    setViewComponent(<MessageStoreWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.ClassMediatorForm:
                    setViewComponent(<ClassMediatorForm path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.BallerinaModuleForm:
                    setViewComponent(<BallerinaModuleForm path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.DataSourceForm:
                    setViewComponent(<DataSourceWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.ImportArtifactForm:
                    setViewComponent(<ImportArtfactForm/>);
                    break;
                case MACHINE_VIEW.ConnectorStore:
                    setViewComponent(
                        <ConnectionWizard path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.ConnectionForm:
                    setViewComponent(
                        <AddConnection
                            connectionName={machineView.customProps.connectionName}
                            connectionType={machineView.customProps.connectionType}
                            connector={machineView.customProps}
                            path={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.TestSuite:
                    setViewComponent(<TestSuiteForm filePath={machineView.documentUri} stNode={machineView.stNode as UnitTest} isWindows={isWindows} />);
                    break;
                case MACHINE_VIEW.LoggedOut:
                    setViewComponent(<SignInToCopilotMessage />);
                    break;
                case MACHINE_VIEW.UpdateExtension:
                    setViewComponent(<UpdateMIExtension />);
                    break;
                case MACHINE_VIEW.TestCase:
                    setViewComponent(<TestCaseForm
                        filePath={machineView.documentUri}
                        range={machineView.customProps?.range}
                        availableTestCases={machineView.customProps?.availableTestCases}
                        testCase={machineView.customProps?.testCase}
                        testSuiteType={machineView.customProps?.testSuiteType}
                    />);
                    break;
                case MACHINE_VIEW.MockService:
                    setViewComponent(<MockServiceForm filePath={machineView.documentUri} stNode={machineView.stNode as MockService} isWindows={isWindows} />);
                    break;
                case MACHINE_VIEW.DSSServiceDesigner:
                    setViewComponent(<DSSServiceDesignerView syntaxTree={machineView.stNode} documentUri={machineView.documentUri} />);
                    break;
                case MACHINE_VIEW.Welcome:
                    setViewComponent(<WelcomeView />);
                    break;
                case MACHINE_VIEW.Samples:
                    setViewComponent(<SamplesView />);
                    break;
                default:
                    setViewComponent(null);
            }
            // Update the showNavigator state based on the current view
            setShowNavigator(shouldShowNavigator);
        });
    }

    const handleOnClose = () => {
        rpcClient.getMiVisualizerRpcClient().openView({ type: POPUP_EVENT_TYPE.CLOSE_VIEW, location: { view: null }, isPopup: true })
    }

    return (
        <ViewContainer>
            {!viewComponent ? (
                <LoaderWrapper>
                    <ProgressRing />
                </LoaderWrapper>
            ) : <>
                {showNavigator && <NavigationBar />}
                {viewComponent}
            </>}
            {typeof formState === 'object' && 'open' in formState && (
                <PopUpContainer>
                    <PopupPanel formState={formState} handleClose={handleOnClose} />
                </PopUpContainer>
            )}
        </ViewContainer>
    );
};

export default MainPanel;   
