/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useEffect, useReducer } from 'react';

import { FormControl, FormHelperText } from "@material-ui/core";
import { DIAGNOSTIC_SEVERITY } from "@wso2-enterprise/ballerina-languageclient";
import { JsonToRecordResponse } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import {
    CheckBoxGroup,
    FormHeaderSection,
    FormTextInput
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { ModulePart, NodePosition, STKindChecker, STNode, TypeDefinition } from '@wso2-enterprise/syntax-tree';
import classNames from "classnames";
import debounce from "lodash.debounce";

import { Context } from "../../../../../../Contexts/Diagram";
import { TextPreloaderVertical } from "../../../../../../PreLoader/TextPreloaderVertical";
import { getInitialSource, mutateTypeDefinition } from "../../../../../utils";
import { FileSelector } from '../../../../FileSelector';
import { useStyles } from "../../../DynamicConnectorForm/style";
import { FormActionButtons } from "../../../FormFieldComponents/FormActionButtons";
import { FormTextArea } from "../../../FormFieldComponents/TextField/FormTextArea";
import { UndoRedoManager } from "../../../UndoRedoManager";
import { checkDiagnostics, getUpdatedSource } from "../../../Utils";
import { RecordOverview } from "../RecordOverview";
import { convertJsonToRecordUtil, getModulePartST, getRecordST, getRootRecord } from "../utils";

interface RecordState {
    isLoading?: boolean;
    jsonValue?: string;
    recordName?: string;
    recordNameDiag?: string;
    importedRecord?: TypeDefinition | ModulePart;
    modifiedPosition?: NodePosition;
    isSeparateDef?: boolean;
    jsonDiagnostics?: string;
}

interface RecordFromJsonProps {
    targetPosition?: NodePosition;
    undoRedoManager?: UndoRedoManager;
    onSave: (recordString: string, modifiedPosition: NodePosition) => void;
    onCancel: () => void;
    isHeaderHidden?: boolean;
}

const debounceDelay = 300;

const reducer = (state: RecordState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'jsonConversionStart':
            return { ...state, isLoading: action.payload };
        case 'setJsonDiagnostics':
            return { ...state, jsonDiagnostics: action.payload, isLoading: false };
        case 'setJsonValue':
            return { ...state, jsonValue: action.payload, jsonDiagnostics: "" };
        case 'recordNameChange':
            return { ...state, recordName: action.payload.recordName, recordNameDiag: action.payload.recordNameDiag };
        case 'setRecordNameDiag':
            return { ...state, recordNameDiag: action.payload.recordNameDiag };
        case 'checkSeparateDef':
            return { ...state, isSeparateDef: action.payload };
        case 'jsonConversionSuccess':
            return { ...state, importedRecord: action.payload.importedRecord, modifiedPosition: action.payload.modifiedPosition, jsonValue: "", isLoading: false, jsonDiagnostics: "" };
        default:
            break;
    }
}

export function RecordFromJson(recordFromJsonProps: RecordFromJsonProps) {
    const classes = useStyles();

    const { targetPosition, isHeaderHidden, undoRedoManager, onSave, onCancel } = recordFromJsonProps;

    const { props, api } = useContext(Context);

    const { isMutationProgress, langServerURL, currentFile, fullST } = props;
    const { ls } = api;

    const [formState, dispatchFromState] = useReducer(reducer, {
        recordName: "",
        jsonValue: "",
        isLoading: false,
        jsonDiagnostics: "",
        isSeparateDef: false,
        recordNameDiag: "",
        importedRecord: undefined,
    });

    const convertToJSon = () => {
        dispatchFromState({ type: 'jsonConversionStart', payload: true });
    };

    const onJsonChange = (jsonText: string) => {
        dispatchFromState({ type: 'setJsonValue', payload: jsonText });
    };

    const onNameOutFocus = async (event: any) => {
        const content = getInitialSource(mutateTypeDefinition(event.target.value, "record {};", targetPosition,
            true));
        const updateContent = getUpdatedSource(content, currentFile.content, targetPosition);
        const diagnostics = await checkDiagnostics(currentFile?.path, updateContent, ls, targetPosition);
        let filteredDiagnostics;
        if ((diagnostics[0]?.severity === 1)
            && (diagnostics[0]?.range?.start?.line - 1) === targetPosition.startLine) {
            filteredDiagnostics = diagnostics.filter(diag => diag.message.includes(event.target.value));
        }
        dispatchFromState({
            type: 'recordNameChange', payload: {
                recordName: event.target.value,
                recordNameDiag: filteredDiagnostics ? filteredDiagnostics[0].message : ""
            }
        });
    };

    const onNameChange = async (name: string) => {
        dispatchFromState({
            type: 'recordNameChange', payload: {
                recordName: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
                recordNameDiag: ""
            }
        });
    };
    const debouncedNameChanged = debounce(onNameChange, debounceDelay);

    const onSeparateDefinitionSelection = (mode: string[]) => {
        dispatchFromState({ type: 'checkSeparateDef', payload: mode.length > 0 });
    };

    const formatRecord = (block: string) => {
        let i = 0;
        return block.replace(/record {/g, (match: string) => {
            return match === "record {" ? (i++ === 0 ? 'record {' : 'record {\n') : '';
        });
    }

    // This fix is added due to incorrect record name generation from ballerina side.
    // This can be removed once that issue is fixed
    const fixNewRecordResponse = (response: JsonToRecordResponse) => {
        const expected = `type ${formState.recordName}`;
        const notExpected = "type NewRecord";
        if (response.codeBlock && !response.codeBlock.includes(expected) && response.codeBlock.includes(notExpected)) {
            response.codeBlock = response.codeBlock.replace(notExpected, expected);
        }
        return response;
    }

    useEffect(() => {
        if (formState.isLoading) {
            (async () => {
                const recordResponseLS = await convertJsonToRecordUtil(formState.jsonValue, formState.recordName,
                    false, langServerURL, formState.isSeparateDef, ls);
                const recordResponse = fixNewRecordResponse(recordResponseLS);
                let recordST: STNode;
                let modulePart: STNode;
                let newPosition: NodePosition;
                const updatedBlock = formState.isSeparateDef ? recordResponse.codeBlock : formatRecord(recordResponse.codeBlock);
                if (recordResponse?.diagnostics?.length === 0 || (recordResponse?.diagnostics[0]?.severity
                    !== DIAGNOSTIC_SEVERITY.ERROR)) {
                    if (formState.isSeparateDef) {
                        // Uses module part since we receive multiple records
                        modulePart = await getModulePartST({
                            codeSnippet: updatedBlock.trim()
                        }, langServerURL, ls);
                        if (STKindChecker.isModulePart(modulePart)) {
                            recordST = getRootRecord(modulePart, formState.recordName);
                            newPosition = {
                                startLine: targetPosition.startLine + recordST.position.startLine,
                                startColumn: targetPosition.startColumn,
                                endLine: targetPosition.startLine + recordST.position.endLine,
                                endColumn: recordST.position.endColumn,
                            }
                        }
                        dispatchFromState({
                            type: 'jsonConversionSuccess', payload: {
                                importedRecord: modulePart, modifiedPosition: newPosition
                            }
                        });
                    } else {
                        recordST = await getRecordST({ codeSnippet: updatedBlock.trim() },
                            langServerURL, ls);
                        newPosition = {
                            startLine: targetPosition.startLine,
                            startColumn: targetPosition.startColumn,
                            endLine: targetPosition.startLine + recordST.position.endLine,
                            endColumn: recordST.position.endColumn,
                        }
                        dispatchFromState({
                            type: 'jsonConversionSuccess', payload: {
                                importedRecord: recordST, modifiedPosition: newPosition
                            }
                        });
                    }
                    onSave(updatedBlock, newPosition);
                } else {
                    dispatchFromState({ type: 'setJsonDiagnostics', payload: recordResponse?.diagnostics[0].message });
                }
            })();
        }
    }, [formState.isLoading]);

    const isSaveButtonEnabled = !isMutationProgress && formState.jsonDiagnostics === ""
        && (formState.jsonValue !== "") && !formState.recordNameDiag && formState.recordName;

    return (
        <>
            {formState.importedRecord ? (
                <RecordOverview type="JSON" undoRedoManager={undoRedoManager} prevST={fullST} definitions={formState.importedRecord} onComplete={onCancel} onCancel={onCancel} />
            ) : (
                <FormControl data-testid="module-variable-config-form" className={classes.wizardFormControlExtended}>
                    {!isHeaderHidden && (
                        <FormHeaderSection
                            onCancel={onCancel}
                            formTitle="Import Sample JSON"
                            formType={""}
                            defaultMessage=""
                        />
                    )}
                    <div id="json-input-container" test-id="json-input-container" className={classes.formWrapper}>
                        <FormTextInput
                            label="Record Name"
                            dataTestId="import-record-name"
                            placeholder="Enter Record Name"
                            defaultValue={formState.recordName}
                            customProps={{ readonly: false, isErrored: formState?.recordNameDiag }}
                            errorMessage={formState?.recordNameDiag}
                            onBlur={onNameOutFocus}
                            onChange={debouncedNameChanged}
                        />
                        <div className={classNames(classes.inputWrapper, classes.flexItems)}>
                            <div className={classes.labelWrapper}>
                                <FormHelperText className={classes.inputLabelForRequired}>Sample JSON</FormHelperText>
                            </div>
                            <div className={classes.fileSelect}>
                                <FileSelector label='Select JSON file' extension='json' onReadFile={onJsonChange} />
                            </div>
                        </div>
                        <FormTextArea
                            rowsMax={5.1}
                            dataTestId="json-input"
                            placeholder={`eg: {"organization": "wso2", "address": "Colombo"}`}
                            onChange={onJsonChange}
                            customProps={{
                                isInvalid: formState.jsonDiagnostics !== "",
                                text: formState.jsonDiagnostics
                            }}
                            defaultValue={formState.jsonValue}
                        />
                        {formState.isLoading && (
                            <TextPreloaderVertical position="absolute" />
                        )}
                        <CheckBoxGroup
                            values={["Make Separate Record Definitions"]}
                            defaultValues={formState.isSeparateDef ? ['Make Separate Record Definitions'] : []}
                            onChange={onSeparateDefinitionSelection}
                        />
                        <FormActionButtons
                            cancelBtnText="Back"
                            saveBtnText="Save"
                            isMutationInProgress={false}
                            validForm={isSaveButtonEnabled}
                            onSave={convertToJSon}
                            onCancel={onCancel}
                        />
                    </div>
                </FormControl>
            )}
        </>
    );
}
