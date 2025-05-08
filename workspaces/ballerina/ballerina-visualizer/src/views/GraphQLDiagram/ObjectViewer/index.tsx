/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Type, ServiceClassModel, ModelFromCodeRequest, FieldType, FunctionModel, NodePosition, STModification, removeStatement, LineRange, EVENT_TYPE } from "@wso2-enterprise/ballerina-core";
import { Button, Codicon, Typography, TextField, ProgressRing, Menu, MenuItem, Popover, Item, ThemeColors, LinkButton } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { LoadingContainer } from "../../styles";
import { OperationForm } from "../../GraphQLDiagram/OperationForm";

import { URI, Utils } from "vscode-uri";
import { PanelContainer } from "@wso2-enterprise/ballerina-side-panel";
import { applyModifications } from "../../../utils/utils";
import { Icon } from "@wso2-enterprise/ui-toolkit";
import { FieldCard } from "./FieldCard";


const ServiceContainer = styled.div`
    display: flex;
    padding: 10px 20px;
    gap: 16px;
    flex-direction: column;
    height: 100%;
`;

const ScrollableSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    height: 100%;
    flex: 1;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 75px;
`;

const ScrollableContent = styled.div`
    overflow-y: auto;
    min-height: 55px;
`;

const SectionTitle = styled.div`
    font-size: 14px;
    font-family: GilmerRegular;
    margin-bottom: 10px;
    padding: 8px 0;
`;

const SectionHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;
`;

const EmptyStateText = styled(Typography)`
    color: ${ThemeColors.ON_SURFACE_VARIANT};
    padding: 12px;
    text-align: center;
`;

const EditRow = styled.div`
    display: flex;
    gap: 8px;
    align-items: flex-end;
    width: 100%;
`;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: flex-start;
`;

const TextFieldWrapper = styled.div`
    flex: 1;
`;

const EditButton = styled(Button)`
    margin-top: 39px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 2px; 
`;

const StyledButton = styled(Button)`
    font-size: 14px;
`;

const WarningText = styled(Typography)`
    color: var(--vscode-textLink-foreground);
    font-size: 12px;
    margin-top: 4px;
`;

const EditableRow = styled.div`
    display: flex;
    align-items: flex-start;
    width: 100%;
    flex-direction: column;
`;

const ViewText = styled(Typography)`
    color: ${ThemeColors.ON_SURFACE};
    font-size: 13px;
`;

const SwitchImplementRow = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0;
`;

interface GraphqlObjectViewerProps {
    type: Type;
    onClose: () => void;
    onImplementation: (type: Type) => void;
    projectUri: string;
}

export function GraphqlObjectViewer(props: GraphqlObjectViewerProps) {
    const { onClose, type, projectUri, onImplementation } = props;
    const { rpcClient } = useRpcContext();
    const [serviceClassModel, setServiceClassModel] = useState<ServiceClassModel>();
    const [editingFunction, setEditingFunction] = useState<FunctionModel>(undefined);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | SVGSVGElement | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState("");
    const classNameField = serviceClassModel?.properties["name"];

    useEffect(() => {
        getServiceClassModel();
    }, [type]);

    const getServiceClassModel = async () => {
        if (!type) return;
        const currentFilePath = Utils.joinPath(URI.file(projectUri), type.codedata.lineRange.fileName).fsPath;
        const serviceClassModelRequest: ModelFromCodeRequest = {
            filePath: currentFilePath,
            codedata: {
                lineRange: {
                    startLine: { line: type.codedata.lineRange.startLine.line, offset: type.codedata.lineRange.startLine.offset },
                    endLine: { line: type.codedata.lineRange.endLine.line, offset: type.codedata.lineRange.endLine.offset }
                }
            },
            context: "GRAPHQL_DIAGRAM"
        }

        const serviceClassModelResponse = await rpcClient.getBIDiagramRpcClient().getServiceClassModel(serviceClassModelRequest);
        setServiceClassModel(serviceClassModelResponse.model);
    }

    const handleEditFunction = (func: FunctionModel) => {
        setEditingFunction(func);
    };

    const handleDeleteFunction = async (func: FunctionModel) => {
        const targetPosition: NodePosition = {
            startLine: func?.codedata?.lineRange?.startLine.line,
            startColumn: func?.codedata.lineRange?.startLine?.offset,
            endLine: func?.codedata?.lineRange?.endLine?.line,
            endColumn: func?.codedata?.lineRange?.endLine?.offset
        }
        const deleteAction: STModification = removeStatement(targetPosition);
        const currentFilePath = Utils.joinPath(URI.file(projectUri), type.codedata.lineRange.fileName).fsPath;
        await applyModifications(rpcClient, [deleteAction], currentFilePath);
        getServiceClassModel();
    }

    const onFunctionImplement = async (func: FunctionModel) => {
        const lineRange: LineRange = func.codedata.lineRange;
        const currentFilePath = Utils.joinPath(URI.file(projectUri), type.codedata.lineRange.fileName).fsPath;
        const nodePosition: NodePosition = {
            startLine: lineRange.startLine.line,
            startColumn: lineRange.startLine.offset,
            endLine: lineRange.endLine.line,
            endColumn: lineRange.endLine.offset
        }

        await rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                position: nodePosition,
                documentUri: currentFilePath
            }
        })
    }

    const handleFunctionSave = async (updatedFunction: FunctionModel) => {
        try {
            let lsResponse;
            const currentFilePath = Utils.joinPath(URI.file(projectUri), serviceClassModel.codedata.lineRange.fileName).fsPath;
            if (isNew) {
                lsResponse = await rpcClient.getServiceDesignerRpcClient().addFunctionSourceCode({
                    filePath: currentFilePath,
                    codedata: {
                        lineRange: {
                            startLine: {
                                line: serviceClassModel.codedata.lineRange.startLine.line,
                                offset: serviceClassModel.codedata.lineRange.startLine.offset
                            },
                            endLine: {
                                line: serviceClassModel.codedata.lineRange.endLine.line,
                                offset: serviceClassModel.codedata.lineRange.endLine.offset
                            }
                        }
                    },
                    function: updatedFunction
                });
            } else {
                lsResponse = await rpcClient.getServiceDesignerRpcClient().updateResourceSourceCode({
                    filePath: currentFilePath,
                    codedata: {
                        lineRange: {
                            startLine: {
                                line: serviceClassModel.codedata.lineRange.startLine.line,
                                offset: serviceClassModel.codedata.lineRange.startLine.offset
                            },
                            endLine: {
                                line: serviceClassModel.codedata.lineRange.endLine.line,
                                offset: serviceClassModel.codedata.lineRange.endLine.offset
                            }
                        }
                    },
                    function: updatedFunction
                });
            }

            if (isNew) {
                setIsNew(false);
            }
            setEditingFunction(null);
            getServiceClassModel();
        } catch (error) {
            console.error('Error updating function:', error);
        }
    };

    const handleAddFunction = async () => {
        const lsResponse = await rpcClient.getServiceDesignerRpcClient().getFunctionModel({
            type: 'graphql',
            functionName: 'query'
        });
        if (lsResponse.function) {
            // if resouce we need to update the models accessor value to get and valueType to Identifier
            if (lsResponse.function.accessor) {
                lsResponse.function.accessor.value = 'get';
                lsResponse.function.accessor.valueType = 'IDENTIFIER';
            }

            setIsNew(true);
            setEditingFunction(lsResponse.function);
        }
    };

    const handleCloseFunctionForm = () => {
        setEditingFunction(undefined);
        setIsNew(false);
    };


    const startEditing = () => {
        setTempName(serviceClassModel.properties["name"].value);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setTempName("");
    };

    const editServiceClassName = async () => {
        if (!tempName || tempName === serviceClassModel.properties["name"].value) {
            cancelEditing();
            return;
        }

        try {
            await rpcClient.getBIDiagramRpcClient().renameIdentifier({
                fileName: serviceClassModel.codedata.lineRange.fileName,
                position: {
                    line: serviceClassModel.properties["name"].codedata.lineRange.startLine.line,
                    character: serviceClassModel.properties["name"].codedata.lineRange.startLine.offset
                },
                newName: tempName
            });

            setServiceClassModel({
                ...serviceClassModel,
                name: tempName,
                properties: {
                    ...serviceClassModel.properties,
                    name: {
                        ...serviceClassModel.properties["name"],
                        value: tempName
                    }
                }
            });

            cancelEditing();
        } catch (error) {
            console.error('Error renaming service class (Graphql Object):', error);
        }
    };

    return (
        <>
            {!serviceClassModel && (
                <LoadingContainer>
                    <ProgressRing />
                    <Typography variant="h3" sx={{ marginTop: '16px' }}>Loading Graphql Object Visualizer...</Typography>
                </LoadingContainer>
            )}
            {serviceClassModel && !editingFunction && (
                <PanelContainer title={"Edit Object"} show={true} onClose={onClose} onBack={onClose} width={400}>
                    <ServiceContainer>


                        {!classNameField.editable && !isEditing && (
                            <InputWrapper>
                                <TextFieldWrapper>
                                    <TextField
                                        id={classNameField.value}
                                        name={classNameField.value}
                                        value={classNameField.value}
                                        label={classNameField.metadata.label}
                                        required={!classNameField.optional}
                                        description={classNameField.metadata.description}
                                        placeholder={classNameField.placeholder}
                                        readOnly={!classNameField.editable}
                                    />
                                </TextFieldWrapper>
                                <EditButton appearance="icon" onClick={startEditing} tooltip="Rename">
                                    <Icon name="bi-edit" sx={{ width: 18, height: 18, fontSize: 18 }} />
                                </EditButton>
                            </InputWrapper>
                        )}
                        {isEditing && (
                            <>
                                <EditableRow>
                                    <EditRow>
                                        <TextFieldWrapper>
                                            <TextField
                                                id={classNameField.value}
                                                label={classNameField.metadata.label}
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                description={classNameField.metadata.description}
                                                required={!classNameField.optional}
                                                placeholder={classNameField.placeholder}
                                                autoFocus
                                            />
                                        </TextFieldWrapper>
                                        <ButtonGroup>
                                            <StyledButton
                                                appearance="secondary"
                                                onClick={cancelEditing}
                                            >
                                                Cancel
                                            </StyledButton>
                                            <StyledButton
                                                appearance="primary"
                                                onClick={editServiceClassName}
                                                disabled={!tempName || tempName === serviceClassModel.properties["name"].value}
                                            >
                                                Save
                                            </StyledButton>
                                        </ButtonGroup>
                                    </EditRow>

                                    <WarningText variant="body3">
                                        Note: Renaming will update all references across the project
                                    </WarningText>
                                </EditableRow>

                            </>
                        )}
                        <ScrollableSection>
                            <Section>
                                <SectionHeader>
                                    <SectionTitle>Fields</SectionTitle>
                                    <Button
                                        appearance="icon"
                                        tooltip="Add Field"
                                        onClick={() => handleAddFunction()}
                                    >
                                        <Codicon name="add" />
                                    </Button>
                                </SectionHeader>

                                <ScrollableContent>
                                    {serviceClassModel.functions?.map((func: FunctionModel, index: number) => (
                                        <FieldCard
                                            key={index}
                                            functionModel={func}
                                            goToSource={() => { }}
                                            onEditFunction={() => handleEditFunction(func)}
                                            onDeleteFunction={() => handleDeleteFunction(func)}
                                            onFunctionImplement={() => onFunctionImplement(func)}
                                        />
                                    ))}
                                    {(!serviceClassModel.functions || serviceClassModel.functions.length === 0) && (
                                        <EmptyStateText variant="body2">
                                            No fields found
                                        </EmptyStateText>
                                    )}
                                </ScrollableContent>
                            </Section>
                            {
                                <SwitchImplementRow>
                                    <ViewText variant="body3">Switch to Implementation View</ViewText>
                                    <Button appearance="primary" tooltip="Implement Object" onClick={() => onImplementation(type)}>
                                        <Codicon name="file-code" /> &nbsp; Implement
                                    </Button>
                                </SwitchImplementRow>
                            }
                        </ScrollableSection>

                    </ServiceContainer>
                </PanelContainer>
            )}
            {editingFunction && serviceClassModel && (
                <PanelContainer
                    title={isNew ? "Add Field" : "Edit Field"}
                    show={true}
                    onClose={() => setEditingFunction(undefined)}
                    onBack={() => setEditingFunction(undefined)}
                    width={400}
                >
                    <OperationForm
                        model={editingFunction}
                        filePath={Utils.joinPath(URI.file(projectUri), serviceClassModel.codedata.lineRange.fileName).fsPath}
                        lineRange={serviceClassModel.codedata.lineRange}
                        isGraphqlView={true}
                        onClose={handleCloseFunctionForm}
                        onSave={handleFunctionSave}
                    />
                </PanelContainer>
            )}
        </>
    );
}
