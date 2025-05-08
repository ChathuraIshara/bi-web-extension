/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete, Button, LinkButton, ProgressIndicator, Codicon, FormActions } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import SidePanelContext, { clearSidePanelState } from '../SidePanelContexProvider';
import { Range } from '@wso2-enterprise/mi-syntax-tree/lib/src';
import { ParamConfig } from '../../Form/ParamManager/ParamManager';
import { ExpressionField, ExpressionFieldValue } from '../../Form/ExpressionField/ExpressionInput';
import { handleOpenExprEditor, sidepanelGoBack } from '..';
import { useForm, Controller } from 'react-hook-form';
import { MACHINE_VIEW, POPUP_EVENT_TYPE, ParentPopupData } from '@wso2-enterprise/mi-core';
import { FormGenerator } from '../../..';

const Field = styled.div`
   margin-bottom: 5px;
`;

const FormContainer = styled.div`
    width: 100%;
`;

interface AddConnectorProps {
    formData: any;
    nodePosition: Range;
    documentUri: string;
    connectorName?: string;
    operationName?: string;
    connectionName?: string;
    connectionType?: string;
    fromConnectorStore?: boolean;
    parameters?: string[];
    control: any;
    errors: any;
    setValue: any;
    handleSubmit: any;
    reset: any;
    watch: any;
    getValues: any;
    dirtyFields: any;
    isUpdate?: boolean;
}

const AddConnector = (props: AddConnectorProps) => {
    const { formData, nodePosition, control, errors, setValue, reset, watch, getValues, dirtyFields, handleSubmit, isUpdate, documentUri } = props;
    const { rpcClient, setIsLoading: setDiagramLoading } = useVisualizerContext();

    const sidePanelContext = React.useContext(SidePanelContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const [connections, setConnections] = useState([] as any);
    const handleOnCancelExprEditorRef = useRef(() => { });
    const [parameters, setParameters] = useState<string[]>(props.parameters);

    const fetchConnections = async () => {
        const connectionsData = await rpcClient.getMiDiagramRpcClient().getConnectorConnections({
            documentUri: props.documentUri,
            connectorName: props.formData?.connectorName ?? props.connectorName.replace(/\s/g, '')
        });

        if (props.formData && props.formData !== "") {
            const allowedTypes = findAllowedConnectionTypes(props.formData.elements);

            const filteredConnections = connectionsData.connections.filter(
                connection => allowedTypes?.some(
                    // Ignore case in checking allowed connection types
                    type => type.toLowerCase() === connection.connectionType.toLowerCase()
                ));
            const connectionNames = filteredConnections.map(connection => connection.name);

            setConnections(connectionNames);
        } else {
            // Fetch connections for old connectors (No ConnectionType)
            const connectionsNames = connectionsData.connections.map(connection => connection.name);
            setConnections(connectionsNames);
        }

        setIsLoading(false);
    };

    const fetchParameters = async (operation: string) => {
        const connectorData = await rpcClient.getMiDiagramRpcClient().getAvailableConnectors({
            documentUri: props.documentUri,
            connectorName: props.connectorName.toLowerCase().replace(/\s/g, '')
        });

        const parameters = connectorData.actions.find(action => action.name === operation)?.parameters || null;

        setParameters(parameters);

    };

    useEffect(() => {
        handleOnCancelExprEditorRef.current = () => {
            sidepanelGoBack(sidePanelContext);
        };
    }, [sidePanelContext.pageStack]);

    useEffect(() => {
        fetchConnections();
    }, [props.formData]);

    useEffect(() => {
        if (!sidePanelContext.formValues && Object.keys(sidePanelContext.formValues).length > 0 && sidePanelContext.formValues?.parameters) {
            if (!sidePanelContext.formValues.form) {
                //Handle connectors without uischema
                fetchParameters(sidePanelContext.formValues.operationName);

                sidePanelContext.formValues?.parameters.forEach((param: any) => {
                    param.name = getNameForController(param.name);
                    if (param.isExpression) {
                        let namespacesArray: any[] = [];
                        if (param.namespaces) {
                            namespacesArray = Object.entries(param.namespaces).map(([prefix, uri]) => ({ prefix: prefix.split(':')[1], uri: uri }));
                        }
                        setValue(param.name, { isExpression: true, value: param.value.replace(/[{}]/g, ''), namespaces: namespacesArray });
                    } else {
                        param.namespaces = [];
                        setValue(param.name, param);
                    }
                });
            }

            if (sidePanelContext.formValues?.connectionName) {
                setValue('configKey', sidePanelContext.formValues?.connectionName);
            }
        }
    }, [sidePanelContext.formValues]);

    const findAllowedConnectionTypes = (elements: any): string[] | undefined => {
        for (let element of elements) {
            if (element.type === 'attribute' && element.value.inputType === 'connection') {
                return element.value.allowedConnectionTypes;
            }
            if (element.type === 'attributeGroup') {
                return findAllowedConnectionTypes(element.value.elements);
            }
        }
    };

    function getNameForController(name: string | number) {
        return String(name).replace('.', '__dot__');
    }


    function getInputType(formData: any, paramName: string): string {
        let inputType = null;

        function traverseElements(elements: any) {
            for (let element of elements) {
                if (element.type === 'attribute' && element.value.name === paramName) {
                    inputType = element.value.inputType;
                    return;
                }

                if (element.type === 'attributeGroup') {
                    traverseElements(element.value.elements);
                }
            }
        }

        traverseElements(formData.elements);

        return inputType;
    }

    const addNewConnection = async (name?: string, allowedConnectionTypes?: string) => {
        const connectionTypes = allowedConnectionTypes ?? findAllowedConnectionTypes(props.formData.elements ?? "");

        rpcClient.getMiVisualizerRpcClient().openView({
            type: POPUP_EVENT_TYPE.OPEN_VIEW,
            location: {
                documentUri: props.documentUri,
                view: MACHINE_VIEW.ConnectorStore,
                customProps: {
                    allowedConnectionTypes: connectionTypes,
                }
            },
            isPopup: true
        });

        rpcClient.onParentPopupSubmitted(async (data: ParentPopupData) => {
            if (data.recentIdentifier) {
                await fetchConnections();
                setValue(name ?? 'configKey', data.recentIdentifier);
            }
        });
    }

    const handleOnClose = () => {
        sidePanelContext.pageStack.length > 1 ? sidepanelGoBack(sidePanelContext) : clearSidePanelState(sidePanelContext);
    }

    const onClick = async (values: any) => {
        setDiagramLoading(true);

        const connectorName = props.formData?.connectorName ??
            props.connectorName?.toLowerCase().replace(/\s/g, '') ??
            sidePanelContext.formValues.connectorName;

        const operationName = props.formData?.operationName ?? props.operationName ??
            sidePanelContext.formValues.operationName;

        if (!sidePanelContext.formValues?.form && !sidePanelContext.formValues?.parameters) {
            // Get values set through param manager when no UISchema/template is present
            values = getValues();
        }

        if (props.connectionName) {
            values.configKey = props.connectionName;
        }

        rpcClient.getMiDiagramRpcClient().updateMediator({
            mediatorType: `${connectorName}.${operationName}`,
            values: values as Record<string, any>,
            oldValues: sidePanelContext.formValues as Record<string, any>,
            dirtyFields: Object.keys(dirtyFields),
            documentUri,
            range: nodePosition
        });

        clearSidePanelState(sidePanelContext);

    };

    if (isLoading) {
        return <ProgressIndicator />;
    }

    return (
        <FormContainer>
            {isLoading ?
                <ProgressIndicator /> :
                !formData ? (
                    // When no UISchema present
                    ((parameters && parameters.length > 0) ? (
                        // Render parameters when template is present for operation
                        <>
                            <Field>
                                <Controller
                                    name="configKey"
                                    control={control}
                                    defaultValue={connections[0]}
                                    render={({ field }) => (
                                        <>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: '100%', gap: '10px' }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                                    <label>{"Connection"}</label>
                                                </div>
                                                <LinkButton onClick={() => addNewConnection()}>
                                                    <Codicon name="plus" />Add new connection
                                                </LinkButton>
                                            </div>
                                            <AutoComplete
                                                name="configKey"
                                                items={connections}
                                                value={field.value}
                                                onValueChange={(e: any) => {
                                                    field.onChange(e);
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Field>
                            {parameters.map((element) => (
                                <Field>
                                    <Controller
                                        name={element}
                                        control={control}
                                        defaultValue={{ "isExpression": false, "value": "", "namespaces": [] }}
                                        render={({ field }) => (
                                            <ExpressionField
                                                {...field} label={element}
                                                placeholder={element}
                                                canChange={true}
                                                required={false}
                                                openExpressionEditor={(value: ExpressionFieldValue, setValue: any) => handleOpenExprEditor(value, setValue, handleOnCancelExprEditorRef, sidePanelContext)}
                                            />
                                        )}
                                    />
                                </Field>
                            ))}
                            <div style={{ display: "flex", textAlign: "right", justifyContent: "flex-end", marginTop: "10px" }}>
                                <Button
                                    appearance="primary"
                                    onClick={handleSubmit(onClick)}
                                >
                                    Submit
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Render connection selection field when no template is present
                        <>
                            <Field>
                                <Controller
                                    name="configKey"
                                    control={control}
                                    defaultValue={connections[0]}
                                    render={({ field }) => (
                                        <>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: '100%', gap: '10px' }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                                    <label>{"Connection"}</label>
                                                </div>
                                                <LinkButton onClick={() => addNewConnection()}>
                                                    <Codicon name="plus" />Add new connection
                                                </LinkButton>
                                            </div>
                                            <AutoComplete
                                                name="configKey"
                                                items={connections}
                                                value={field.value}
                                                onValueChange={(e: any) => {
                                                    field.onChange(e);
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Field>
                            <div style={{ display: "flex", textAlign: "right", justifyContent: "flex-end", marginTop: "10px" }}>
                                <Button
                                    appearance="primary"
                                    onClick={handleSubmit(onClick)}
                                >
                                    Submit
                                </Button>
                            </div>
                        </>
                    ))
                ) :
                    <>
                        {/* {renderForm(props.formData.elements)} */}
                        <FormGenerator
                            documentUri={props.documentUri}
                            formData={formData}
                            connectorName={props.connectorName}
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            reset={reset}
                            watch={watch}
                            getValues={getValues}
                            skipGeneralHeading={true}
                            ignoreFields={props.connectionName ? ["configRef"] : []}
                            addNewConnection={addNewConnection}
                            range={props.nodePosition} />
                        <FormActions>
                            <Button
                                appearance="secondary"
                                onClick={handleOnClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={handleSubmit(onClick)}
                            >
                                {isUpdate ? "Update" : "Add"}
                            </Button>
                        </FormActions>
                    </>
            }
        </FormContainer>
    );
};

export default AddConnector;
