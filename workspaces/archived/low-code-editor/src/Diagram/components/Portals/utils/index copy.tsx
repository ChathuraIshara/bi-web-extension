/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode } from "react";

import { StatementViewState } from "@wso2-enterprise/ballerina-low-code-diagram";
import {
    ActionConfig,
    BallerinaConnectorInfo,
    BallerinaConnectorRequest,
    BallerinaConstruct,
    Connector,
    ConnectorConfig,
    DefaultConnectorIcon,
    DiagramEditorLangClientInterface, FormField, FormFieldReturnType,
    FunctionDefinitionInfo,
    getAllVariables as retrieveVariables,
    PrimitiveBalType,
    STSymbolInfo
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    ActionStatement,
    CaptureBindingPattern, CheckAction,
    CheckExpression,
    ImplicitNewExpression, ListConstructor, LocalVarDecl, MappingConstructor, ModuleVarDecl, NamedArg, NodePosition, NumericLiteral,
    ParenthesizedArgList,
    PositionalArg, RemoteMethodCallAction, SimpleNameReference, SpecificField,
    STKindChecker,
    STNode, StringLiteral, TypeCastExpression} from "@wso2-enterprise/syntax-tree";
import { DocumentSymbol, SymbolInformation } from "vscode-languageserver-protocol";

import * as ConstructIcons from "../../../../assets/icons";
import {
    addConnectorToCache,
    getConnectorFromCache,
    isEndpointNode,
    isSTActionInvocation
} from "../../../utils/st-util";
import * as Forms from "../../FormComponents/ConfigForms";
import { VariableOptions } from "../../FormComponents/ConfigForms/ModuleVariableForm/util";
import { ConfigWizardState } from "../../FormComponents/ConnectorConfigWizard";
import * as ConnectorExtension from "../../FormComponents/ConnectorExtensions";
import * as OverlayElement from "../../FormComponents/DialogBoxes/PlusHolder";
import * as Elements from "../../FormComponents/FormFieldComponents";
import { LowCodeExpressionEditor } from "../../FormComponents/FormFieldComponents/LowCodeExpressionEditor";
import { getUnionFormFieldName } from "../../FormComponents/FormFieldComponents/Union";
import { FormElementProps } from "../../FormComponents/Types";

import { keywords, symbolKind } from "./constants";

export function getOverlayElement(
    type: string,
    data: any,
    onClose: () => void, onClick: () => void,
    onChange?: (event: object, value: any) => void
): ReactNode {
    const Element = (OverlayElement as any)[type];
    return (
        <Element type={type} data={data} onClose={onClose} onClick={onClick} onChange={onChange} />
    );
}

export function getFormElement(elementProps: FormElementProps, type: string) {
    if (!(type && elementProps)) {
        return null;
    }

    if (type === "union") {
        // Show expression editor if members doesn't have a Record
        elementProps.model?.members?.forEach((subField: FormField) => {
            if (subField.typeName !== "record") {
                type = "expression";
            }
        });
    } else if (elementProps.model?.isRestParam) {
        type = "restParam";
    }

    const FormElement = (Elements as any)[type];
    if (FormElement) {
        return <FormElement {...elementProps} />;
    }

    return <LowCodeExpressionEditor {...elementProps} />;
}

export function getForm(type: string, args: any) {
    const Form = (Forms as any)[type];
    return Form ? (
        <Form {...args} />
    ) : <Forms.Custom {...args} />;
}

export function getConnectorComponent(type: string, args: any) {
    const ConnectorExtensionComponent = (ConnectorExtension as any)[type];
    return ConnectorExtensionComponent ? (
        <ConnectorExtensionComponent {...args} />
    ) : undefined;
}

export function getFieldName(fieldName: string): string {
    return keywords.includes(fieldName) ? "'" + fieldName : fieldName;
}

const isAllFieldsEmpty = (recordFields: FormField[]): boolean => recordFields?.every(field => ((field.value ?? "") === "") || (field.fields && isAllFieldsEmpty(field.fields)));

export function getParams(formFields: FormField[], depth = 1): string[] {
    const paramStrings: string[] = [];
    formFields.forEach(formField => {
        const skipDefaultValue =
            (!formField.value &&
                formField.typeName !== "record" &&
                formField.typeName !== "inclusion" &&
                formField.defaultable) ||
            (formField.value && formField.defaultValue && formField.defaultValue === formField.value);
        let paramString: string = "";
        if (!skipDefaultValue) {
            if (formField.defaultable &&
                ((formField.typeName !== "record" && formField.value) ||
                    (formField.typeName === "record" && !isAllFieldsEmpty(formField.fields)))) {
                paramString += `${getFieldName(formField.name)} = `;
            }
            if (formField.typeName === "string" && (formField.value || formField.defaultValue)) {
                paramString += formField.value || formField.defaultValue;
            } else if (formField.typeName === "object" && (formField.value || formField.defaultValue)) {
                paramString += formField.value || formField.defaultValue;
            }
            else if (formField.typeName === "array" && !formField.hide && (formField.value || formField.defaultValue)) {
                paramString += formField.value.toString() || formField.defaultValue;
            } else if (formField.typeName === "map" && (formField.value || formField.defaultValue)) {
                paramString += formField.value || formField.defaultValue;
            } else if ((formField.typeName === "int" || formField.typeName === "boolean" || formField.typeName === "float" || formField.typeName === "decimal" ||
                formField.typeName === "json" || formField.typeName === "httpRequest") && (formField.value || formField.defaultValue)) {
                paramString += formField.value || formField.defaultValue;
            } else if ((formField.typeName === "enum") && (formField.value || formField.defaultValue)) {
                paramString += `"${formField.value || formField.defaultValue}"`;
            } else if (formField.typeName === "record" && formField.fields && formField.fields.length > 0 && !formField.isReference) {
                let recordFieldsString: string = "";
                let firstRecordField = false;

                formField.fields.forEach(field => {
                    // Skip default values if no changes
                    if (field.defaultValue && field.defaultValue === field.value) {
                        return;
                    }
                    if (field.typeName === "string" && field.value) {
                        if (firstRecordField) {
                            recordFieldsString += ", ";
                        } else {
                            firstRecordField = true;
                        }
                        recordFieldsString += getFieldName(field.name) + ": " + field.value;
                    }
                    else if ((field.typeName === "int" || field.typeName === "boolean" || field.typeName === "float" || field.typeName === "decimal") && field.value) {
                        if (firstRecordField) {
                            recordFieldsString += ", ";
                        } else {
                            firstRecordField = true;
                        }
                        recordFieldsString += getFieldName(field.name) + ": " + field.value;
                    } else if (field.typeName === "map" && field.value) {
                        if (firstRecordField) {
                            recordFieldsString += ", ";
                        } else {
                            firstRecordField = true;
                        }
                        // HACK:    current map type will render by expression-editor component.
                        //          expression-editor component will set value property directly.
                        //          need to implement fetch inner field's values of map object.
                        recordFieldsString += getFieldName(field.name) + ": " + field.value;
                    } else if (field.typeName === "array" && !field.hide && field.value) {
                        if (firstRecordField) {
                            recordFieldsString += ", ";
                        } else {
                            firstRecordField = true;
                        }
                        recordFieldsString += getFieldName(field.name) + ": " + field.value;
                    } else if (field.typeName === "union" && !field.hide) {
                        const name = getFieldName(field.name ? field.name : field.typeInfo.name);
                        if (name) {
                            const selectedField: FormField = field.members?.find((subField: FormField) => {
                                const fieldName = getUnionFormFieldName(subField);
                                return fieldName !== undefined && fieldName === field.selectedDataType;
                            });
                            if (selectedField) {
                                const params = getParams([selectedField], depth + 1);
                                if (params && params.length > 0) {
                                    if (firstRecordField) {
                                        recordFieldsString += ", ";
                                    } else {
                                        firstRecordField = true;
                                    }
                                    recordFieldsString += name + ": " + params;
                                }
                            } else if (field.value) {
                                if (firstRecordField) {
                                    recordFieldsString += ", ";
                                } else {
                                    firstRecordField = true;
                                }
                                recordFieldsString += name + ": " + field.value;
                            }
                        }
                    } else if (field.typeName === "enum" && !field.hide && field.value) {
                        const name = getFieldName(field.name ? field.name : field.typeInfo.name);
                        if (firstRecordField) {
                            recordFieldsString += ", ";
                        } else {
                            firstRecordField = true;
                        }
                        recordFieldsString += `${name} : "${field.value}"`;
                    } else if (field.typeName === "record" && !field.hide && !field.isReference) {
                        const name = getFieldName(field.name ? field.name : field.typeInfo.name);
                        if (name) {
                            const fieldArray: FormField[] = [
                                {
                                    typeName: PrimitiveBalType.Record,
                                    fields: field.fields,
                                },
                            ];
                            const params = getParams(fieldArray, depth + 1);
                            if (params && params.length > 0) {
                                if (firstRecordField) {
                                    recordFieldsString += ", ";
                                } else {
                                    firstRecordField = true;
                                }
                                recordFieldsString += name + ": " + params;
                            }
                        }
                    }
                });
                if (recordFieldsString !== "" && recordFieldsString !== "{}" && recordFieldsString !== undefined) {
                    paramString += "{" + recordFieldsString + "}";
                } else if (recordFieldsString === "" && !formField.optional && depth === 1) {
                    paramString += "{}";
                }
                // HACK: OAuth2RefreshTokenGrantConfig record contains *oauth2:RefreshTokenGrantConfig
                //      code generation doesn't need another record inside OAuth2RefreshTokenGrantConfig
                //      here skip that RefreshTokenGrantConfig record form code string
                if (paramString.includes("RefreshTokenGrantConfig")) {
                    paramString = paramString.replace("{RefreshTokenGrantConfig: ", "").replace("}", "");
                }
            } else if (formField.typeName === PrimitiveBalType.Union && formField.value) {
                paramString += formField.value;
            } else if (formField.typeName === PrimitiveBalType.Nil) {
                paramString += "()";
            } else if (formField.typeName === PrimitiveBalType.Xml && formField.value) {
                const xmlRegex = /^xml\ `(.*)`$/g;
                if (xmlRegex.test(formField.value)) {
                    paramString = formField.value;
                } else {
                    paramString += formField.value;
                }
            } else if (formField.typeName === "inclusion" && formField.inclusionType) {
                const params = getParams([formField.inclusionType], depth + 1);
                paramString += params;
            } else if (formField.typeName === "handle" && formField.value) {
                paramString += formField.value;
            } else if (paramString === "" && formField.typeName !== "" && formField.value) {
                paramString += formField.value; // Default case
            }

            if (paramString !== "") {
                paramStrings.push(paramString);
            }
        }
    });

    return paramStrings;
}

export function isValidTextInput(inputValue: string, type: any): boolean {
    let isValueValid: boolean = false;
    if (type === PrimitiveBalType.Int) {
        const intRegex = new RegExp("^\\d+$");
        if (intRegex.test(inputValue)) {
            isValueValid = true;
        }
    } else if (type === PrimitiveBalType.Float) {
        const floatRegex = new RegExp("^\\d+(\\.\\d)?\\d*$");
        if (floatRegex.test(inputValue)) {
            isValueValid = true;
        }
    } else if (type === PrimitiveBalType.String) {
        isValueValid = true;
    } else {
        isValueValid = true;
    }
    return isValueValid;
}

export function validateEmail(inputValue: string): boolean {
    const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    if (emailRegex.test(inputValue)) {
        return true;
    }
    return false;
}

export function getCollectionForRadio(model: FormField): string[] {
    const collection: string[] = [];
    switch (model.typeName) {
        case PrimitiveBalType.Boolean:
            collection.push("true");
            collection.push("false");
            break;
        default:
            break;
    }
    return collection;
}

export function matchEndpointToFormField(endPoint: LocalVarDecl | ModuleVarDecl, formFields: FormField[]) {
    let implicitExpr: ImplicitNewExpression;
    switch (endPoint.initializer.kind) {
        case "CheckExpression":
            implicitExpr = (endPoint.initializer as CheckExpression).expression as ImplicitNewExpression;
            break;
        default:
            implicitExpr = endPoint.initializer as ImplicitNewExpression;
    }
    const parenthesizedArgs: ParenthesizedArgList = implicitExpr.parenthesizedArgList as ParenthesizedArgList;
    let nextValueIndex = 0;
    for (const arg of parenthesizedArgs.arguments) {
        if ((parenthesizedArgs.arguments === undefined) || (formFields.length <= nextValueIndex)) {
            break;
        }

        const positionalArg: PositionalArg = arg as PositionalArg;
        let formField = formFields[nextValueIndex];
        if (STKindChecker.isNamedArg(positionalArg)) {
            const argName = positionalArg.argumentName.name.value;
            formFields.forEach((field) => {
                if (field.name === argName) {
                    formField = field;
                    return;
                }
                if (field.typeName === "inclusion") {
                    field.inclusionType?.fields?.forEach((subField) => {
                        if (subField.name === argName) {
                            formField = subField;
                            return;
                        }
                    });
                }
            });
        }
        if (positionalArg.kind === "PositionalArg" || positionalArg.kind === "NamedArg") {
            if (formField.typeName === "string" || formField.typeName === "int" || formField.typeName === "boolean" ||
                formField.typeName === "float" || formField.typeName === "decimal" || formField.typeName === "json" || formField.typeName === "xml") {
                if (STKindChecker.isStringLiteral(positionalArg.expression)) {
                    const stringLiteral: StringLiteral = positionalArg.expression as StringLiteral;
                    formField.value = stringLiteral.literalToken.value;
                } else if (STKindChecker.isNumericLiteral(positionalArg.expression)) {
                    const numericLiteral: NumericLiteral = positionalArg.expression as NumericLiteral;
                    formField.value = numericLiteral.literalToken.value;
                } else if (STKindChecker.isBooleanLiteral(positionalArg.expression)) {
                    const booleanLiteral: NumericLiteral = positionalArg.expression as NumericLiteral;
                    formField.value = booleanLiteral.literalToken.value;
                } else {
                    formField.value = positionalArg.expression.source;
                }
                formField.initialDiagnostics = positionalArg?.typeData?.diagnostics;
                nextValueIndex++;
            } else if (formField.typeName === "record" && formField.fields && formField.fields.length > 0) {
                const mappingConstructor: MappingConstructor = positionalArg.expression as MappingConstructor;
                if (mappingConstructor) {
                    mapRecordLiteralToRecordTypeFormField(mappingConstructor.fields as SpecificField[], formField.fields);
                    nextValueIndex++;
                }
            } else if (formField.typeName === "inclusion" && formField.inclusionType && formField.inclusionType.fields) {
                const mappingConstructor: MappingConstructor = positionalArg.expression as MappingConstructor;
                if (mappingConstructor) {
                    mapRecordLiteralToRecordTypeFormField(mappingConstructor.fields as SpecificField[], formField.inclusionType?.fields);
                    nextValueIndex++;
                }
            } else if (formField.typeName === "union") {
                formField.value = positionalArg.expression?.source;
                formField.initialDiagnostics = positionalArg?.typeData?.diagnostics;
            }
        }
    }
}

export function mapRecordLiteralToRecordTypeFormField(specificFields: SpecificField[], formFields: FormField[]) {
    specificFields.forEach(specificField => {
        if (specificField.kind !== "CommaToken") {
            formFields.forEach(formField => {
                if (getFieldName(formField.name) === specificField.fieldName.value) {
                    // if the assigned value is one of inbuilt type
                    formField.value = (STKindChecker.isStringLiteral(specificField.valueExpr) ||
                        STKindChecker.isNumericLiteral(specificField.valueExpr) ||
                        STKindChecker.isBooleanLiteral(specificField.valueExpr)) ?

                        formField.value = specificField.valueExpr.literalToken.value :
                        formField.value = specificField.valueExpr.source;

                    // if the assigned value is a record
                    if (specificField.valueExpr.kind === 'MappingConstructor') {
                        const mappingField = specificField.valueExpr as MappingConstructor;
                        if (formField.typeName === "union") {
                            formField.members.forEach(subFormField => {
                                if (subFormField.typeName === "record" && subFormField.fields) {
                                    const subFields = subFormField.fields;
                                    if (subFields) {
                                        mapRecordLiteralToRecordTypeFormField(mappingField.fields as SpecificField[], subFields);
                                        // find selected data type using non optional field's value
                                        let allFieldsFilled = true;
                                        subFields.forEach(field => {
                                            if (field.optional === false && !field.value) {
                                                allFieldsFilled = false;
                                            }
                                        });
                                        if (allFieldsFilled) {
                                            formField.selectedDataType = getUnionFormFieldName(subFormField);
                                        }
                                    }
                                }
                            });
                        } else {
                            mapRecordLiteralToRecordTypeFormField(mappingField.fields as SpecificField[], formField.fields);
                        }
                    }

                    // if the assigned value is an array
                    if (specificField.valueExpr.kind === 'ListConstructor') {
                        const listExpr = specificField.valueExpr as ListConstructor;
                        formField.value = listExpr.source;
                        formField.fields = formField?.fields ? formField.fields : [];
                    }
                    formField.initialDiagnostics = specificField?.typeData?.diagnostics;
                }
            })
        }
    });
}

export function getRestParamFieldValue(remoteMethodCallArguments: PositionalArg[], currentFieldIndex: number) {
    const varArgValues: string[] = [];
    for (let i = currentFieldIndex; i < remoteMethodCallArguments.length; i++) {
        const varArgs: PositionalArg = remoteMethodCallArguments[i] as PositionalArg;
        const literalExpression: any = varArgs.expression;
        varArgValues.push(literalExpression.literalToken.value);
    }
    return varArgValues.join(",");
}

export function matchActionToFormField(remoteCall: RemoteMethodCallAction, formFields: FormField[]) {
    const remoteMethodCallArguments = remoteCall.arguments.filter(arg => arg.kind !== 'CommaToken');
    let nextValueIndex = 0;
    for (const formField of formFields) {
        if ((remoteMethodCallArguments === undefined) || (remoteMethodCallArguments.length <= nextValueIndex)) {
            break;
        }

        if (STKindChecker.isNamedArg(remoteMethodCallArguments[nextValueIndex])) {
            const namedArg: NamedArg = remoteMethodCallArguments[nextValueIndex] as NamedArg;
            const fieldForNamedArg = formFields.find(field => field.name === namedArg.argumentName.name.value);
            if (fieldForNamedArg) {
                fieldForNamedArg.value = namedArg.expression.source;
            }
            nextValueIndex++;
        } else {
            const positionalArg: PositionalArg = remoteMethodCallArguments[nextValueIndex] as PositionalArg;
            if (formField.typeName === "string" || formField.typeName === "int" || formField.typeName === "boolean"
                || formField.typeName === "float" || formField.typeName === "decimal" || formField.typeName === "httpRequest") {
                if (STKindChecker.isStringLiteral(positionalArg.expression) ||
                    STKindChecker.isNumericLiteral(positionalArg.expression) ||
                    STKindChecker.isBooleanLiteral(positionalArg.expression)) {
                    if (formField.isRestParam) {
                        formField.value = getRestParamFieldValue(remoteMethodCallArguments as PositionalArg[],
                            nextValueIndex);
                    } else {
                        const literalExpression = positionalArg.expression;
                        formField.value = literalExpression.literalToken.value;
                    }
                } else {
                    formField.value = positionalArg.expression.source;
                }
                nextValueIndex++;
            } else if (formField.typeName === 'handle') {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            }
            else if (formField.typeName === "object") {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            }
            else if (formField.typeName.includes("array")) {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            }
            else if (formField.typeName === 'collection') {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            } else if (formField.typeName === "record" && formField.fields && formField.fields.length > 0) {
                const mappingConstructor: MappingConstructor = positionalArg.expression as MappingConstructor;
                if (mappingConstructor) {
                    mapRecordLiteralToRecordTypeFormField(mappingConstructor.fields as SpecificField[], formField.fields);
                    nextValueIndex++;
                }
            } else if (formField.typeName === "record" && STKindChecker.isSimpleNameReference(positionalArg.expression)) {
                formField.value = positionalArg.expression.name.value;
                nextValueIndex++;
            } else if (formField.typeName === "union") {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            } else if (formField.typeName === "enum") {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            } else if (formField.typeName === "json") {
                formField.value = positionalArg.expression?.source;
                nextValueIndex++;
            }
        }
    }
}

export function getModuleIcon(module: BallerinaConstruct, scale: number = 1): React.ReactNode {
    const width = 56 * scale;
    if (module?.icon || module?.package?.icon) {
        return (
            <img
                src={module.icon || module.package.icon}
                alt={module.package.name}
                style={{ width: "auto", height: "100%", maxWidth: width, maxHeight: width }}
            />
        );
    }
    return <DefaultConnectorIcon scale={scale} />;
}

export function getConstructIcon(iconId: string) {
    const Icon = (ConstructIcons as any)[iconId];
    return <Icon />
}

export function addAiSuggestion(targetVariable: string, aiSuggestion: string, formFields: FormField[]) {
    // Todo: optimize the tree traversing algorithm
    formFields.forEach((formField: FormField) => {
        if (formField.fields) {
            addAiSuggestion(targetVariable, aiSuggestion, formField.fields);
        } else {
            if (formField.name === targetVariable) {
                formField.aiSuggestion = aiSuggestion;
            }
        }
    })
}

function isDocumentSymbol(symbol: DocumentSymbol | SymbolInformation): symbol is DocumentSymbol {
    return symbol && (symbol as DocumentSymbol).range !== undefined;
}

function getSymbolKind(kind: number): string {
    return symbolKind[kind]
}

export function getMapTo(_formFields: FormField[], targetPosition: NodePosition): { [key: string]: any } {
    const mapTo: { [key: string]: any } = {};

    function iterateFormFields(formFields: FormField[]) {
        formFields.forEach((formField: FormField) => {
            if (formField.fields) {
                iterateFormFields(formField.fields);
            } else {
                if (formField.name && formField.typeName) {
                    mapTo[formField.name] = {
                        "type": formField.typeName,
                        "position": targetPosition.startLine,
                        "isUsed": 0
                    }
                }
            }
        });
    };

    iterateFormFields(_formFields);
    return mapTo;
}

export async function fetchConnectorInfo(
    connector: Connector,
    model?: STNode,
    symbolInfo?: STSymbolInfo,
    langServerURL?: string,
    currentFilePath?: string,
    getDiagramEditorLangClient?: (url: string) => Promise<DiagramEditorLangClientInterface>
): Promise<ConfigWizardState> {
    // get form fields from browser cache
    let connectorInfo = getConnectorFromCache(connector);
    const functionDefInfo: Map<string, FunctionDefinitionInfo> = new Map();
    const connectorConfig = new ConnectorConfig();
    const connectorRequest: BallerinaConnectorRequest = {};

    // Connector request with connector_id
    if (!connectorInfo && connector && connector.id) {
        connectorRequest.id = connector.id;
    }

    // Connector request with FQN
    if (!connectorInfo && connector && connector.moduleName && connector.package) {
        connectorRequest.name = connector.name;
        connectorRequest.moduleName = connector.moduleName;
        connectorRequest.orgName = connector.package.organization;
        connectorRequest.packageName = connector.package.name;
        connectorRequest.version = connector.package.version;
        connectorRequest.targetFile = currentFilePath;
    }

    if (!connectorInfo && connectorRequest) {
        // generate form fields form connector syntax tree
        const langClient: DiagramEditorLangClientInterface = await getDiagramEditorLangClient(langServerURL);
        const connectorResp = await langClient?.getConnector(connectorRequest);
        if (connectorResp) {
            connectorInfo = connectorResp as BallerinaConnectorInfo;
            if (connectorInfo?.name) {
                connector = connectorInfo;
                // save form fields in browser cache
                await addConnectorToCache(connectorInfo);
            }
        }
    }

    if (!connectorInfo?.name) {
        return null;
    }

    connectorInfo?.functions.forEach((functionInfo: FunctionDefinitionInfo) => {
        functionDefInfo.set(functionInfo.name, functionInfo);
    });

    if (model) {
        const variable: LocalVarDecl = model as LocalVarDecl;
        const viewState: StatementViewState = model.viewState as StatementViewState;
        if (isSTActionInvocation(variable)) {
            let remoteCall: RemoteMethodCallAction;
            let returnVarName: string;

            switch (model.kind) {
                case "LocalVarDecl":
                    switch (variable.initializer.kind) {
                        case "TypeCastExpression":
                            const initializer: TypeCastExpression = variable.initializer as TypeCastExpression;
                            remoteCall = (initializer.expression as CheckAction).expression as RemoteMethodCallAction;
                            break;
                        case "RemoteMethodCallAction":
                            remoteCall = variable.initializer as RemoteMethodCallAction;
                            break;
                        default:
                            remoteCall = (variable.initializer as CheckAction).expression as RemoteMethodCallAction;
                    }
                    if (variable?.typedBindingPattern?.bindingPattern) {
                        if (STKindChecker.isCaptureBindingPattern(variable.typedBindingPattern.bindingPattern)) {
                            const bindingPattern: CaptureBindingPattern = variable.typedBindingPattern
                                .bindingPattern;
                            returnVarName = bindingPattern.variableName.value;
                        } else if (STKindChecker.isWildcardBindingPattern(variable.typedBindingPattern.bindingPattern)) {
                            returnVarName = "_";
                        }
                    }
                    break;

                case "ActionStatement":
                    const statement = model as ActionStatement;
                    remoteCall = (statement.expression as CheckAction).expression as RemoteMethodCallAction;
                    break;

                default:
                    // TODO: need to handle this flow
                    return undefined;
            }

            if (remoteCall) {
                const configName: SimpleNameReference = remoteCall.expression as SimpleNameReference;
                const actionName: SimpleNameReference = remoteCall.methodName as SimpleNameReference;
                if (remoteCall && actionName) {
                    const action: ActionConfig = new ActionConfig();
                    action.name = actionName.name.value;
                    action.returnVariableName = returnVarName;
                    action.isReturnValueIgnored = returnVarName === "_";
                    connectorConfig.action = action;
                    connectorConfig.name = configName.name.value;
                    connectorConfig.action.fields = functionDefInfo.get(connectorConfig.action.name).parameters;
                    matchActionToFormField(remoteCall, connectorConfig.action.fields);
                }
            }
        } else if (
            (viewState.isEndpoint || isEndpointNode(model)) &&
            STKindChecker.isCaptureBindingPattern(variable.typedBindingPattern.bindingPattern)
        ) {
            const endpointVarName = (variable.typedBindingPattern.bindingPattern as CaptureBindingPattern)
                .variableName.value;
            if (endpointVarName) {
                connectorConfig.name = endpointVarName;
            }
        }
        connectorConfig.connectorInit = functionDefInfo.get("init") ? functionDefInfo.get("init").parameters : [];
        let matchingEndPoint;
        if (STKindChecker.isLocalVarDecl(model)){
            matchingEndPoint = symbolInfo.localEndpoints.get(connectorConfig.name) as LocalVarDecl;
        }else if (STKindChecker.isModuleVarDecl(model)){
            matchingEndPoint = symbolInfo.moduleEndpoints.get(connectorConfig.name) as ModuleVarDecl;
        }
        if (matchingEndPoint) {
            connectorConfig.initPosition = matchingEndPoint.position;
            matchEndpointToFormField(matchingEndPoint, connectorConfig.connectorInit);
        }
    }

    connectorConfig.existingConnections = symbolInfo.variables.get(
        getFormattedModuleName(connector.package.name) + ":" + connector.name
    );

    return {
        isLoading: false,
        connector: connectorInfo,
        functionDefInfo,
        connectorConfig,
        model,
    };
}


export function getInitReturnType(functionDefinitions: Map<string, FunctionDefinitionInfo>): boolean {
    const returnTypeField = functionDefinitions.get("init")?.returnType;
    return getFormFieldReturnType(returnTypeField).hasError;
}

export function getActionReturnType(action: string, functionDefinitions: Map<string, FunctionDefinitionInfo>): FormFieldReturnType {
    if (!action) {
        return undefined;
    }
    const returnTypeField = functionDefinitions.get(action)?.returnType;
    return getFormFieldReturnType(returnTypeField);
}

function getFormFieldReturnType(formField: FormField, depth = 1): FormFieldReturnType {
    const response: FormFieldReturnType = {
        hasError: formField?.isErrorType ? true : false,
        hasReturn: false,
        returnType: "var",
        importTypeInfo: []
    };
    const primitives = ["string", "int", "float", "decimal", "boolean", "json", "xml", "handle", "byte", "object", "handle", "anydata"];
    const returnTypes: string[] = [];

    if (formField) {
        switch (formField.typeName) {
            case "union":
                formField?.members?.forEach(field => {
                    const returnTypeResponse = getFormFieldReturnType(field, depth + 1);
                    const returnType = returnTypeResponse.returnType;
                    response.hasError = returnTypeResponse.hasError || response.hasError;
                    response.hasReturn = returnTypeResponse.hasReturn || response.hasReturn;
                    response.importTypeInfo = [...response.importTypeInfo, ...returnTypeResponse.importTypeInfo];

                    // collector
                    if (returnType && returnType !== "var") {
                        returnTypes.push(returnType);
                    }
                });

                if (returnTypes.length > 0) {
                    if (returnTypes.length > 1) {
                        // concat all return types with | character
                        response.returnType = returnTypes.reduce((fullType, subType) => {
                            return `${fullType}${subType !== '?' ? '|' : ''}${subType}`;
                        });
                    } else {
                        response.returnType = returnTypes[0];
                        if (response.returnType === '?') {
                            response.hasReturn = false;
                        }
                    }
                }
                break;

            case "map":
                const paramType = getFormFieldReturnType(formField.paramType, depth + 1);
                response.hasError = paramType.hasError;
                response.hasReturn = true;
                response.returnType = `map<${paramType.returnType}>`
                break;

            case "array":
                if (formField?.memberType) {
                    const returnTypeResponse = getFormFieldReturnType(formField.memberType, depth + 1);
                    response.returnType = returnTypeResponse.returnType;
                    response.hasError = returnTypeResponse.hasError || response.hasError;
                    response.hasReturn = returnTypeResponse.hasReturn || response.hasReturn;
                    response.importTypeInfo = [...response.importTypeInfo, ...returnTypeResponse.importTypeInfo];
                }

                if (response.returnType && formField.typeName === PrimitiveBalType.Array) {
                    // set array type
                    response.returnType = response.returnType.includes('|') ? `(${response.returnType})[]` : `${response.returnType}[]`;
                }
                break;

            case "stream":
                let returnTypeResponseLeft = null;
                let returnTypeResponseRight = null
                if (formField?.leftTypeParam) {
                    returnTypeResponseLeft = getFormFieldReturnType(formField.leftTypeParam, depth + 1);
                    response.importTypeInfo = [...response.importTypeInfo, ...returnTypeResponseLeft.importTypeInfo];
                }
                if (formField?.rightTypeParam) {
                    returnTypeResponseRight = getFormFieldReturnType(formField.rightTypeParam, depth + 1);
                    response.importTypeInfo = [...response.importTypeInfo, ...returnTypeResponseRight.importTypeInfo];
                }
                if (returnTypeResponseLeft.returnType && returnTypeResponseRight && (returnTypeResponseRight.returnType || returnTypeResponseRight.hasError)) {
                    const rightType = returnTypeResponseRight.hasError ? "error?" : returnTypeResponseRight.returnType;
                    response.returnType = `stream<${returnTypeResponseLeft.returnType},${rightType}>`
                }
                if (returnTypeResponseLeft.returnType && !returnTypeResponseRight?.returnType) {
                    response.returnType = `stream<${returnTypeResponseLeft.returnType}>`
                }
                if (response.returnType) {
                    response.hasReturn = true;
                    formField.isErrorType = false;
                    response.hasError = false;
                }
                break;

            case "tuple":
                formField?.fields.forEach(field => {
                    const returnTypeResponse = getFormFieldReturnType(field, depth + 1);
                    const returnType = returnTypeResponse.returnType;
                    response.hasError = returnTypeResponse.hasError || response.hasError;
                    response.hasReturn = returnTypeResponse.hasReturn || response.hasReturn;
                    response.importTypeInfo = [...response.importTypeInfo, ...returnTypeResponse.importTypeInfo];
                    // collector
                    if (returnType && returnType !== "var") {
                        returnTypes.push(returnType);
                    }
                });

                if (returnTypes.length > 0) {
                    response.returnType = returnTypes.length > 1 ? `[${returnTypes.join(',')}]` : returnTypes[0];
                }
                break;

            default:
                let type = "";
                if (depth <= 2 && (formField.typeName.trim() === "error" || formField.isErrorType)) {
                    formField.isErrorType = true;
                    response.hasError = true;
                }
                if (depth > 2 && (formField.typeName.trim() === "error" || formField.isErrorType)) {
                    response.hasReturn = true;
                    response.returnType = "error";
                }
                if (type === "" && formField.typeInfo && !formField.isErrorType) {
                    // set class/record types
                    type = `${getFormattedModuleName(formField.typeInfo.moduleName)}:${formField.typeInfo.name}`;
                    response.hasReturn = true;
                    response.importTypeInfo.push(formField.typeInfo);
                }
                if (type === "" && formField.typeInfo && formField?.isStream && formField.isErrorType) {
                    // set stream record type with error
                    type = `${getFormattedModuleName(formField.typeInfo.moduleName)}:${formField.typeInfo.name},error`;
                    response.hasReturn = true;
                    response.importTypeInfo.push(formField.typeInfo);
                    // remove error return
                    response.hasError = false;
                }
                if (type === "" && !formField.typeInfo && primitives.includes(formField.typeName) &&
                    formField?.isStream && formField.isErrorType) {
                    // set stream record type with error
                    type = `${formField.typeName},error`;
                    response.hasReturn = true;
                    // remove error return
                    response.hasError = false;
                }
                if (type === "" && formField.typeName.includes("map<")) {
                    // map type
                    // INFO: Need to update map type metadata generation to extract inside type
                    type = formField.typeName;
                    response.hasReturn = true;
                }
                if (type === "" && formField.typeName.includes("[") && formField.typeName.includes("]")) {
                    // tuple type
                    // INFO: Need to update tuple type metadata generation to extract inside type
                    type = formField.typeName;
                    response.hasReturn = true;
                }
                if (type === "" && !formField.isStream && formField.typeName && primitives.includes(formField.typeName)) {
                    // set primitive types
                    type = formField.typeName;
                    response.hasReturn = true;
                }
                if (formField.typeName === "parameterized" || (formField.name === "rowType" && formField.typeInfo.name === "rowType")) {
                    type = "record{}";
                    response.hasReturn = true;
                }
                // filters
                if (type !== "" && formField.typeName === PrimitiveBalType.Array) {
                    // set array type
                    type = type.includes('|') ? `(${type})[]` : `${type}[]`;
                }
                if ((type !== "" || formField.isErrorType) && formField?.optional) {
                    // set optional tag
                    type = type.includes('|') ? `(${type})?` : `${type}?`;
                }
                if (type === "" && depth > 1 && formField.typeName.trim() === "()") {
                    // set optional tag for nil return types
                    type = "?";
                }
                if (type) {
                    response.returnType = type;
                }
        }
    }
    if (formField === null) {
        response.returnType = "record{}";
        response.hasReturn = true;
    }
    return response;
}

function getFormFieldValue(formFields: FormField[], connectorName: string, key: string) {
    switch (connectorName) {
        case "github": {
            return formFields[0].fields[1].value;
        }
        case "google sheets":
            return formFields.find(field => field.name === "spreadsheetConfig").fields
                .find(field => field.name === "oauthClientConfig").fields
                .find(field => field.name === key).value || "";
        case "gmail": {
            return formFields.find(field => field.name === "gmailConfig").fields
                .find(field => field.name === "oauthClientConfig").fields
                .find(field => field.name === key).value || "";
        }
        case "google calendar":
            return formFields.find(field => field.name === "calendarConfig").fields
                .find(field => field.name === "oauth2Config").fields
                .find(field => field.name === key).value || "";
    }
}

export function getOauthParamsFromFormFields(connectorName: string, formFields: FormField[]): any {
    switch (connectorName) {
        case "github": {
            const githubAccessToken = getFormFieldValue(formFields, connectorName, 'accessToken');
            return (`{
                accessToken: ${githubAccessToken}
            }`);
        }
        case "gmail":
        case "google sheets": {
            const clientId = getFormFieldValue(formFields, connectorName, 'clientId');
            const clientSecret = getFormFieldValue(formFields, connectorName, 'clientSecret');
            const refreshUrl = getFormFieldValue(formFields, connectorName, 'refreshUrl');
            const refreshToken = getFormFieldValue(formFields, connectorName, 'refreshToken');
            return (`{
                oauthClientConfig: {
                    clientId: ${clientId},
                    clientSecret: ${clientSecret},
                    refreshToken: ${refreshToken},
                    refreshUrl: ${refreshUrl}
                }
             }`);
        }
        case "google calendar": {
            const clientId = getFormFieldValue(formFields, connectorName, 'clientId');
            const clientSecret = getFormFieldValue(formFields, connectorName, 'clientSecret');
            const refreshUrl = getFormFieldValue(formFields, connectorName, 'refreshUrl');
            const refreshToken = getFormFieldValue(formFields, connectorName, 'refreshToken');
            return (`{
                oauth2Config: {
                    clientId: ${clientId},
                    clientSecret: ${clientSecret},
                    refreshToken: ${refreshToken},
                    refreshUrl: ${refreshUrl}
                }
             }`);
        }
    }
}

export function checkErrorsReturnType(action: string, functionDefinitions: Map<string, FunctionDefinitionInfo>): boolean {
    if (functionDefinitions.get(action)?.returnType?.isErrorType) {
        // return type has an error
        return true;
    }
    if (functionDefinitions.get(action)?.returnType?.typeInfo?.name === "Error") {
        // return type has an error
        return true;
    }
    if (functionDefinitions.get(action)?.returnType?.fields?.
        find((param: any) => (param?.isErrorType || param?.type === "error" || param?.typeInfo?.name === "Error"))) {
        // return type has an error
        return true;
    }
    // return type hasn't any error
    return false;
}

export function getFormattedModuleName(moduleName: string): string {
    if (!moduleName){
        return "";
    }
    let formattedModuleName = moduleName.includes('.') ? moduleName.split('.').pop() : moduleName;
    if (keywords.includes(formattedModuleName)) {
        formattedModuleName = `${formattedModuleName}0`;
    }
    return formattedModuleName;
}

export function addAccessModifiers(modifiers: string[], statement: string): string {
    let initStatement = "";
    if (modifiers && modifiers.includes(VariableOptions.PUBLIC)){
        initStatement += `${VariableOptions.PUBLIC} `;
    }
    if (modifiers && modifiers.includes(VariableOptions.FINAL)){
        initStatement += `${VariableOptions.FINAL} `;
    }
    return initStatement + statement;
}

export function getAccessModifiers(model: STNode): string[] {
    const modifiers: string[] = [];
    if (STKindChecker.isModuleVarDecl(model)){
        model.qualifiers.forEach(qualifier => {
            modifiers.push(qualifier.value);
        });
        // HACK: ModuleVarDecl interface doesn't support visibilityQualifier
        if ((model as any).visibilityQualifier && STKindChecker.isPublicKeyword((model as any).visibilityQualifier)){
            modifiers.push(VariableOptions.PUBLIC)
        }
    }
    return modifiers;
}

export interface VariableNameValidationResponse {
    error: boolean;
    message?: string;
}
/**
 * check variable name validation with error message.
 * and return variableNameValidationResponse object.
 * @param varName text field name. this will used to generate error message
 * @param text current value of the text field
 * @param existingText default value. this will skip from variable list
 */
export function checkVariableName(varName: string, text: string, existingText?: string, symbolInfo?: STSymbolInfo): VariableNameValidationResponse {
    const lowerCasedAllVariables = retrieveVariables(symbolInfo).map(name => name.toLowerCase());
    const nameRegex = new RegExp("^'?[a-zA-Z][a-zA-Z0-9_]*$");
    let response: VariableNameValidationResponse = { error: false };
    if (text === "") {
        // is the name empty
        response = { error: true, message: `Name is empty` };
        return response;
    }
    if (text !== existingText && lowerCasedAllVariables?.includes(text.toLowerCase())) {
        // is already used in code
        response = { error: true, message: `${varName} already exists` };
        return response;
    }
    if (!nameRegex.test(text)) {
        // invalid format
        response = { error: true, message: `Invalid value for ${varName}` };
        return response;
    }
    if (keywords.includes(text)) {
        // is a keyword
        response = { error: true, message: `This is a reserved value. Please enter different value` };
        return response;
    }
    return response;
}
export function getManualConnectionDetailsFromFormFields(formFields: FormField[]): any {

    let selectedFields: any[] = []
    let configs: any
    let name: string
    let value: string

    if (formFields) {
        formFields.forEach(field => {
            if (!field.optional && !field.isReference) {
                switch (field.typeName) {
                    case "record":
                        configs = getManualConnectionDetailsFromFormFields(field.fields)
                        selectedFields = [...selectedFields, ...configs.selectedFields]
                        break;
                    case "union":
                        configs = getManualConnectionDetailsFromFormFields(field.members)
                        selectedFields = [...selectedFields, ...configs.selectedFields]
                        break;

                    default:
                        if (field.value !== undefined) {
                            name = field.name
                            value = field.value
                            selectedFields.push({ name, value })
                        }
                }
            }
        });
    }
    return { selectedFields }
}
export function getManualConnectionTypeFromFormFields(formFields: FormField[]): any {
    const selectedType = (formFields[0]?.fields[0]?.selectedDataType) ? ((formFields[0]?.fields[0]?.selectedDataType)) : (formFields[0].selectedDataType)
    return selectedType
}

function convertToCamelCase(variableName: string): string {
    return variableName
        .replace(/\s(.)/g, (a) => {
            return a.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, (b) => {
            return b.toLowerCase();
        });
}

export function genVariableName(defaultName: string, variables: string[], skipCamelCase?: boolean): string {
    const baseName: string = skipCamelCase ? defaultName : convertToCamelCase(defaultName);
    let varName: string = baseName.includes('.') ? baseName.split('.').pop() : baseName;
    let index = 0;
    while (variables.includes(varName)) {
        index++;
        varName = baseName + index;
    }
    return varName;
}
