/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useEffect, useReducer } from "react";

import { DIAGNOSTIC_SEVERITY, XMLToRecord } from "@wso2-enterprise/ballerina-core";
import { ModulePart, NodePosition, STKindChecker, STNode, TypeDefinition } from "@wso2-enterprise/syntax-tree";

import { TextPreloaderVertical } from "../PreLoader/TextPerloaderVertical";
import { convertXmlToRecordUtil, getModulePartST, getRecordST, getRootRecord } from "../utils";
import { FileSelector } from "../components/FileSelector";
import { FormActionButtons } from "../components/FormComponents/FormFieldComponents/FormActionButtons";
import { FormTextArea } from "../components/FormComponents/FormFieldComponents/TextField/FormTextArea";
import { UndoRedoManager } from "../components/UndoRedoManager";
import { RecordOverview } from "../RecordOverview";
import { Context } from "../Context";
import {
    FileSelect,
    FormContainer,
    FormWrapper,
    InputContainer,
    InputWrapper,
    useStyles,
} from "../style";
import { Button, Codicon, SidePanelTitleContainer, Typography } from "@wso2-enterprise/ui-toolkit";
import { FormHeaderSection } from "../components/FormComponents/FormFieldComponents/FormHeader/FormHeaderSection";

interface RecordState {
    isLoading?: boolean;
    xmlValue?: string;
    recordName?: string;
    recordNameDiag?: string;
    importedRecord?: TypeDefinition | ModulePart;
    modifiedPosition?: NodePosition;
    isSeparateDef?: boolean;
    xmlDiagnostics?: string;
}

interface RecordFromXmlProps {
    undoRedoManager?: UndoRedoManager;
    onSave: (recordString: string, modifiedPosition: NodePosition) => void;
    onCancel: () => void;
    isHeaderHidden?: boolean;
    onUpdate?: (updated: boolean) => void;
}

const debounceDelay = 300;

const reducer = (state: RecordState, action: { type: string; payload: any }) => {
    switch (action.type) {
        case "xmlConversionStart":
            return { ...state, isLoading: action.payload };
        case "setXmlDiagnostics":
            return { ...state, xmlDiagnostics: action.payload, isLoading: false };
        case "setXmlValue":
            return { ...state, xmlValue: action.payload, xmlDiagnostics: "" };
        case "xmlConversionSuccess":
            return {
                ...state,
                importedRecord: action.payload.importedRecord,
                modifiedPosition: action.payload.modifiedPosition,
                xmlValue: "",
                isLoading: false,
                xmlDiagnostics: "",
            };
        default:
            break;
    }
};

export function RecordFromXml(recordFromXmlProps: RecordFromXmlProps) {
    const classes = useStyles();
    const { isHeaderHidden, undoRedoManager, onSave, onCancel, onUpdate } = recordFromXmlProps;

    const {
        props: { langServerRpcClient, recordCreatorRpcClient, targetPosition, fullST },
    } = useContext(Context);

    const [formState, dispatchFromState] = useReducer(reducer, {
        xmlValue: "",
        isLoading: false,
        xmlDiagnostics: "",
        isSeparateDef: true,
        importedRecord: undefined,
    });

    const convertToXml = () => {
        dispatchFromState({ type: "xmlConversionStart", payload: true });
    };

    const onXmlChange = (jsonText: string) => {
        dispatchFromState({ type: "setXmlValue", payload: jsonText });
    };

    const onSeparateDefinitionSelection = (mode: string[]) => {
        dispatchFromState({ type: "checkSeparateDef", payload: mode.length > 0 });
    };

    const formatRecord = (block: string) => {
        let i = 0;
        return block.replace(/record {/g, (match: string) => {
            return match === "record {" ? (i++ === 0 ? "record {" : "record {\n") : "";
        });
    };

    // This fix is added due to incorrect record name generation from ballerina side.
    // This can be removed once that issue is fixed
    const fixNewRecordResponse = (response: XMLToRecord) => {
        const expected = `type ${formState.recordName}`;
        const notExpected = "type NewRecord";
        if (response.codeBlock && !response.codeBlock.includes(expected) && response.codeBlock.includes(notExpected)) {
            response.codeBlock = response.codeBlock.replace(notExpected, expected);
        }
        return response;
    };

    useEffect(() => {
        if (formState.isLoading) {
            (async () => {
                const recordResponseLS = await convertXmlToRecordUtil(formState.xmlValue, recordCreatorRpcClient);
                const recordResponse = fixNewRecordResponse(recordResponseLS);
                let recordST: STNode;
                let modulePart: STNode;
                let newPosition: NodePosition;
                const updatedBlock = formState.isSeparateDef
                    ? recordResponse.codeBlock
                    : formatRecord(recordResponse.codeBlock);
                if (
                    recordResponse?.diagnostics?.length === 0 ||
                    recordResponse?.diagnostics[0]?.severity !== DIAGNOSTIC_SEVERITY.ERROR
                ) {
                    if (formState.isSeparateDef) {
                        // Uses module part since we receive multiple records
                        modulePart = await getModulePartST(
                            {
                                codeSnippet: updatedBlock.trim(),
                            },
                            langServerRpcClient
                        );
                        if (STKindChecker.isModulePart(modulePart)) {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(formState.xmlValue, "text/xml");
                            const tagName = xmlDoc.documentElement.tagName;
                            const recordName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
                            recordST = getRootRecord(modulePart, recordName);
                            newPosition = {
                                startLine: targetPosition.startLine + recordST.position.startLine,
                                startColumn: targetPosition.startColumn,
                                endLine: targetPosition.startLine + recordST.position.endLine,
                                endColumn: recordST.position.endColumn,
                            };
                        }
                        dispatchFromState({
                            type: "xmlConversionSuccess",
                            payload: {
                                importedRecord: modulePart,
                                modifiedPosition: newPosition,
                            },
                        });
                        // TODO: Fix the flow after the Demo
                        onCancel();
                    } else {
                        recordST = await getRecordST({ codeSnippet: updatedBlock.trim() }, langServerRpcClient);
                        newPosition = {
                            startLine: targetPosition.startLine,
                            startColumn: targetPosition.startColumn,
                            endLine: targetPosition.startLine + recordST.position.endLine,
                            endColumn: recordST.position.endColumn,
                        };
                        dispatchFromState({
                            type: "xmlConversionSuccess",
                            payload: {
                                importedRecord: recordST,
                                modifiedPosition: newPosition,
                            },
                        });
                    }
                    // TODO: Fix the flow after the Demo
                    onCancel();
                    onSave(updatedBlock, newPosition);
                    onUpdate && onUpdate(true);
                } else {
                    dispatchFromState({ type: "setXmlDiagnostics", payload: recordResponse?.diagnostics[0].message });
                }
            })();
        }
    }, [formState.isLoading]);

    const isSaveButtonEnabled = formState.xmlDiagnostics === "" && formState.xmlValue !== "";

    return (
        <>
            {formState.importedRecord ? (
                <RecordOverview
                    type="XML"
                    undoRedoManager={undoRedoManager}
                    prevST={fullST}
                    definitions={formState.importedRecord}
                    onComplete={onCancel}
                    onCancel={onCancel}
                />
            ) : (
                <FormContainer data-testid="xml-record-config-form">
                        {!isHeaderHidden && (
                            <SidePanelTitleContainer sx={{ paddingLeft: 20 }}>
                                <Typography variant="h3" sx={{margin: 0, fontSize: "13px"}}>Import Sample XML</Typography>
                                <Button onClick={onCancel} appearance="icon"><Codicon name="close" /></Button>
                            </SidePanelTitleContainer>
                        )}
                    <FormWrapper>
                        <InputContainer id="xml-input-container" test-id="xml-input-container">
                            <InputWrapper>
                                <Typography variant="body3" className={classes.inputLabelForRequired}>
                                    Sample XML
                                </Typography>
                                <FileSelect>
                                    <FileSelector label="Select XML file" extension="xml" onReadFile={onXmlChange} />
                                </FileSelect>
                            </InputWrapper>
                            <FormTextArea
                                data-TestId="xml-input"
                                placeholder={`eg: <company><org>wso2</org><address>Colombo</address></company>`}
                                onChange={onXmlChange}
                                customProps={{
                                    isInvalid: formState.xmlDiagnostics !== "",
                                    text: formState.xmlDiagnostics,
                                }}
                                defaultValue={formState.xmlValue}
                            />
                        </InputContainer>
                        {formState.isLoading && <TextPreloaderVertical position="absolute" />}
                        <FormActionButtons
                            cancelBtnText="Back"
                            saveBtnText="Save"
                            isMutationInProgress={false}
                            validForm={isSaveButtonEnabled}
                            onSave={convertToXml}
                            onCancel={onCancel}
                        />
                    </FormWrapper>
                </FormContainer>
            )}
        </>
    );
}
