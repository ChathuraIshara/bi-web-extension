/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { Typography } from "@material-ui/core";
import { genVariableName, getAllVariables } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { AddIcon } from "../../../../../../assets/icons";
import DeleteButton from "../../../../../../assets/icons/DeleteButton";
import EditButton from "../../../../../../assets/icons/EditButton";
import { Context as DiagramContext } from "../../../../../../Contexts/Diagram";
import { Context, FormState } from "../../../../../../Contexts/EnumEditor";
import { keywords } from "../../../../Portals/utils/constants";
import { VariableNameInput } from "../../Components/VariableNameInput";
import { FieldEditor } from "../FieldEditor";
import { FieldItem } from "../FieldItem";
import { enumStyles } from "../style";
import { EnumModel, SimpleField } from "../types";
import { genEnumName, getFieldNames } from "../utils";
export interface CodePanelProps {
    enumModel: EnumModel;
    parentEnumModel?: EnumModel;
}

export function EnumField(props: CodePanelProps) {
    const { enumModel, parentEnumModel } = props;

    const enumClasses = enumStyles();

    const intl = useIntl();

    const addFieldText = intl.formatMessage({
        id: "lowcode.develop.configForms.enumEditor.enumField.addBtnText",
        defaultMessage: "Add Member"
    });

    const { props: { stSymbolInfo } } = useContext(DiagramContext);

    const { state, callBacks } = useContext(Context);

    const [isEnumExpanded, setIsEnumExpanded] = useState(true);
    const [fieldNameError, setFieldNameError] = useState<string>("");

    const [isEnumEditInProgress, setIsEnumEditInProgress] = useState((enumModel.name === "") ||
        (enumModel.name === undefined));
    const [isEnumFocus, setIsEnumFocus] = useState(true);
    const nameRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");

    const allEnumVariables = useMemo(() => getAllVariables(stSymbolInfo), [stSymbolInfo])
    const enumNames: string[] = [];
    allEnumVariables.forEach((variable) => {
        const data = variable.split(':').pop();
        enumNames.push(data);
    });
    const defaultEnumName = genVariableName("Enum_name", enumNames);
    const [enumName, setEnumName] = useState<string>(defaultEnumName);

    const handleFieldEdit = (field: SimpleField) => {
        setIsEnumEditInProgress(false);
        if (!(state.isEditorInvalid || (state.currentField && state.currentField.name === ""))) {
            const index = enumModel.fields.indexOf(field);
            if (index !== -1) {
                // Changes the active state to selected enum model
                state.currentEnum.isActive = false;
                enumModel.isActive = true;

                // Changes the active state to selected field
                if (state.currentField) {
                    state.currentField.isActive = false;
                    state.currentField.isEditInProgress = false;
                }
                field.isActive = true;
                field.isEditInProgress = true;

                callBacks.onUpdateCurrentField(field);
                callBacks.onUpdateCurrentEnum(enumModel);
                callBacks.onUpdateModel(state.enumModel);
                callBacks.onChangeFormState(FormState.UPDATE_FIELD);
            }
        }
    }

    const handleFieldDelete = (field: SimpleField) => {
        const index = enumModel.fields.indexOf(field);
        if (index !== -1) {
            enumModel.fields.splice(index, 1);

            // Changes the active state to selected enum model
            state.currentEnum.isActive = false;
            enumModel.isActive = true;

            callBacks.onUpdateModel(state.enumModel);
            callBacks.onUpdateCurrentField(undefined);
            callBacks.onChangeFormState(FormState.EDIT_RECORD_FORM);
            callBacks.updateEditorValidity(false);
        }
    };

    const handleEnumDelete = () => {
        if (parentEnumModel) {
            const index = parentEnumModel.fields.indexOf(enumModel);
            if (index !== -1) {
                parentEnumModel.fields.splice(index, 1);
            }
            state.currentEnum.isActive = false;
            parentEnumModel.isActive = true;
            state.currentEnum = parentEnumModel;
            callBacks.onUpdateModel(state.enumModel);
            callBacks.onChangeFormState(FormState.EDIT_RECORD_FORM);
        }
    };

    const getNewField = () : SimpleField => {
        const newField: SimpleField = {type: "", name: "", isFieldOptional: false, isActive: true,
                                       isNameInvalid: false, isEditInProgress: true};
        enumModel.fields.push(newField);
        callBacks.updateEditorValidity(false);
        return newField;
    };

    const handleAddField = () => {
        // Changes the active state to selected enum model
        setEnumName(state.currentEnum.name)
        setIsEnumEditInProgress(false);
        state.currentEnum.isActive = false;
        if (state.currentField && state.currentField.name === "") {
            state.currentField.name = genEnumName("fieldName", getFieldNames(state.currentEnum.fields));
        }
        enumModel.isActive = true;

        const newField = getNewField();

        if (!enumModel.name) {
            enumModel.name = genEnumName("Enum", []);
        }

        // Changes the active state to selected field
        if (state.currentField) {
            state.currentField.isActive = false;
            state.currentField.isEditInProgress = false;
        }

        callBacks.onChangeFormState(FormState.ADD_FIELD);
        callBacks.onUpdateCurrentEnum(enumModel);
        callBacks.onUpdateModel(state.enumModel);
        callBacks.onUpdateCurrentField(newField);
    };

    const handleEnumExpand = () => {
        setIsEnumExpanded(!isEnumExpanded);
    };

    const handleEnumBlur = () => {
        setIsEnumEditInProgress(state.isEditorInvalid)
    }

    const handleRevertFocus = () => {
        setIsEnumFocus(false);
    }
    const validateEnumName = (fieldName: string, isInValid: boolean) => {
        callBacks.updateEditorValidity(isInValid);
    };

    const handleOnChange = (value: string) => {
        state.currentEnum.name = value;
        callBacks.onChangeFormState(FormState.EDIT_RECORD_FORM);
        callBacks.onUpdateModel(state.enumModel);
        if (state.currentEnum.name === "") {
            callBacks.updateEditorValidity(false);
        }
    }

    const handleFieldEditorChange = (event: any) => {
        if (event.key === 'Enter') {
            if (!event.target.value) {
                state.currentField.name = genEnumName("fieldName", getFieldNames(state.currentEnum.fields));
            }
            if (!state.currentField.isNameInvalid) {
                state.currentField.isEditInProgress = false;
                state.currentField.isActive = true;
            }
        } else {
            state.currentField.name = event.target.value;
            const isNameAlreadyExists = state.currentEnum.fields.find(field => (field.name === event.target.value) && field.isActive === false)
            if (isNameAlreadyExists) {
                setFieldNameError("Name already exists");
                state.currentField.isNameInvalid = true;
                callBacks.updateEditorValidity(state.currentField.isNameInvalid || state.currentField.isValueInvalid);
            } else if (keywords.includes(event.target.value)) {
                setFieldNameError("Keywords are not allowed");
                state.currentField.isNameInvalid = true;
                callBacks.updateEditorValidity(state.currentField.isNameInvalid || state.currentField.isValueInvalid);
            } else if (!nameRegex.test(event.target.value) && event.target.value !== "") {
                setFieldNameError("Invalid name");
                state.currentField.isNameInvalid = true;
                callBacks.updateEditorValidity(state.currentField.isNameInvalid || state.currentField.isValueInvalid);
            } else {
                setFieldNameError("");
                state.currentField.isNameInvalid = false;
                callBacks.updateEditorValidity(state.currentField.isNameInvalid || state.currentField.isValueInvalid);
            }
        }

        callBacks.onUpdateCurrentField(state.currentField);
    };

    const handleSubItemFocusLost = (event: any) => {
        if (!event.target.value) {
            handleFieldDelete(state.currentField);
        } else {
            state.currentField.isEditInProgress = false
            state.currentField.isActive = false;
            callBacks.onUpdateCurrentField(state.currentField);
            callBacks.updateEditorValidity(false);
        }
    };

    const handleEnumClick = () => {
        if (!(state.isEditorInvalid || state.currentEnum?.name === "" || state.currentEnum?.type === "")) {
            state.currentEnum.isActive = false;
            enumModel.isActive = true;
            setEnumName(state.currentEnum.name)
            setIsEnumEditInProgress(true);
            callBacks.onUpdateCurrentEnum(enumModel);
            callBacks.onUpdateModel(state.enumModel);
            callBacks.onUpdateEnumSelection(true);
            callBacks.onChangeFormState(FormState.EDIT_RECORD_FORM);
            setIsEnumFocus(true);
        }
    };

    const fieldItems: ReactNode[] = [];
    enumModel.fields.forEach((field: SimpleField) => {
        if (!(field as SimpleField).isEditInProgress) {
            fieldItems.push(
                <FieldItem
                    field={field as SimpleField}
                    onDeleteClick={handleFieldDelete}
                    onEditCLick={handleFieldEdit}
                />
            )
        } else {
            fieldItems.push(
                <FieldEditor
                    field={field}
                    nameError={fieldNameError}
                    onChange={handleFieldEditorChange}
                    onDeleteClick={handleFieldDelete}
                    onFocusLost={handleSubItemFocusLost}
                    onEnterPress={null}
                />
            );
        }
    });

    const enumTypeNVisibility = `${enumModel.isTypeDefinition ? `enum` : ""}`;
    const openBraceTokens = `{`;
    const enumEn = `}`;
    const typeDefName = enumModel.name ? enumModel.name : "";
    const enumNamePosition: NodePosition = (state.sourceModel && STKindChecker.isEnumDeclaration(state.sourceModel)) ?
        state.sourceModel?.identifier?.position : state.targetPosition;

    useEffect(() => {
        // Checks whether enum is clicked to edit, if so resetting field insertion
        if (state.isEnumSelected) {
            if (state.currentEnum !== enumModel) {
                // Setting all other objects enum editing false except the enum being edited;
                setIsEnumEditInProgress(false);
            }
            if (state.currentField) {
                state.currentField.isEditInProgress = false;
                state.currentField.isActive = false;
            }
            callBacks.onUpdateCurrentField(state.currentField);
        }
    }, [state.isEnumSelected]);
    return (
        <div>
            <div
                className={enumModel.isActive ? enumClasses.activeEnumEditorWrapper :
                    enumClasses.enumEditorWrapper}
            >
                <div className={enumClasses.enumHeader}>
                    <div className={enumClasses.enumHeading}>
                        {enumTypeNVisibility && (
                            <Typography
                                variant='body2'
                                className={enumClasses.typeNVisibilityWrapper}
                            >
                                {enumTypeNVisibility}
                            </Typography>
                        )}
                        {enumModel.isTypeDefinition && isEnumEditInProgress && (
                            <div className={enumClasses.typeTextFieldWrapper} onBlur={handleEnumBlur}>
                                <VariableNameInput
                                    displayName="Enum name"
                                    value={enumName}
                                    isEdit={!!state.sourceModel}
                                    onValueChange={handleOnChange}
                                    validateExpression={validateEnumName}
                                    position={enumNamePosition}
                                    hideLabel={true}
                                    overrideTemplate={{
                                        defaultCodeSnippet: 'enum { enum_fields }',
                                        targetColumn: 6
                                    }}
                                    focus={isEnumFocus}
                                    revertFocus={handleRevertFocus}
                                />
                            </div>
                        )}
                        {typeDefName && !isEnumEditInProgress && (
                            <Typography
                                variant='body2'
                                className={enumClasses.typeDefNameWrapper}
                                onClick={handleEnumClick}
                            >
                                {typeDefName}
                            </Typography>
                        )}
                        <Typography
                            variant='body2'
                            className={enumClasses.openBraceTokenWrapper}
                        >
                            {openBraceTokens}
                        </Typography>
                        {!isEnumExpanded && (
                            <div className={enumClasses.dotExpander} onClick={handleEnumExpand}>
                                ....
                            </div>
                        )}
                    </div>
                    {!state.isEditorInvalid && (
                        <div className={enumModel.isTypeDefinition ? enumClasses.typeDefEditBtnWrapper : enumClasses.enumHeaderBtnWrapper}>
                            <div className={enumClasses.actionBtnWrapper}>
                                <EditButton onClick={handleEnumClick} />
                            </div>
                            {!enumModel.isTypeDefinition && (
                                <div className={enumClasses.actionBtnWrapper}>
                                    <DeleteButton onClick={handleEnumDelete} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {isEnumExpanded && (
                    <div className={enumModel?.isActive ? enumClasses.activeEnumSubFieldWrapper : enumClasses.enumSubFieldWrapper}>
                        {fieldItems}
                        {!state.isEditorInvalid && (
                            <div className={enumClasses.addFieldBtnWrap} onClick={handleAddField}>
                                <AddIcon />
                                <p>{addFieldText}</p>
                            </div>
                        )}
                    </div>
                )}
                <div className={enumClasses.endEnumCodeWrapper}>
                    <Typography
                        variant='body2'
                        className={enumClasses.closeBraceTokenWrapper}
                    >
                        {enumEn}
                    </Typography>
                </div>
            </div>
        </div>
    )
}
