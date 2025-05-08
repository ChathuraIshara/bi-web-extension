/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    DIAGNOSTIC_SEVERITY, DiagramEditorLangClientInterface, ExpressionEditorLangClientInterface, JsonToRecordResponse,
    PartialSTRequest, STModification, STSymbolInfo, XMLToRecordResponse
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    ModulePart,
    NodePosition,
    RecordField,
    RecordFieldWithDefaultValue,
    RecordTypeDesc,
    STKindChecker,
    STNode, TypeDefinition
} from "@wso2-enterprise/syntax-tree";

import { isLiteral, removeStatement } from "../../../../../utils";
import { Field, RecordItemModel, RecordModel, SimpleField } from "../types";

export async function convertJsonToRecordUtil(
    json: string,
    name: string,
    isClosed: boolean,
    lsUrl: string,
    isSeparateDefinitions: boolean,
    ls?: any): Promise<JsonToRecordResponse> {
    const langClient: DiagramEditorLangClientInterface = await ls.getDiagramEditorLangClient();
    const resp: JsonToRecordResponse = await langClient.convert(
        {
            jsonString: json,
            recordName: name,
            isClosed,
            isRecordTypeDesc: !isSeparateDefinitions,
        }
    );
    if (resp.diagnostics === undefined) {
        try {
            JSON.parse(json);
            resp.diagnostics = [];
        } catch (e) {
            resp.diagnostics = [{ message: "Please enter a valid JSON", severity: DIAGNOSTIC_SEVERITY.ERROR }];
        }
    }
    return resp;
}

export async function convertXmlToRecordUtil(xml: string, ls?: any): Promise<XMLToRecordResponse> {
    const langClient: DiagramEditorLangClientInterface = await ls.getDiagramEditorLangClient();
    const resp: XMLToRecordResponse = await langClient.convertXml(
        {
            xmlValue: xml,
            isClosed: false,
            forceFormatRecordFields: false,
            isRecordTypeDesc: false
        }
    );
    if (resp.diagnostics === undefined) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");
            resp.diagnostics = [];
        } catch (e) {
            resp.diagnostics = [{ message: "Please enter a valid XML", severity: DIAGNOSTIC_SEVERITY.ERROR }];
        }
    }
    return resp;
}

export async function getRecordST(
    partialSTRequest: PartialSTRequest,
    lsUrl: string,
    ls?: any): Promise<STNode> {
    const langClient: ExpressionEditorLangClientInterface = await ls.getExpressionEditorLangClient(lsUrl);

    const resp = await langClient.getSTForModuleMembers(partialSTRequest);
    return resp.syntaxTree;
}

export function extractImportedRecordNames(definitions: ModulePart | TypeDefinition): RecordItemModel[] {
    const recordName: { name: string, checked: boolean }[] = [];
    if (STKindChecker.isModulePart(definitions)) {
        const typeDefs: TypeDefinition[] = definitions.members
            .filter(definition => STKindChecker.isTypeDefinition(definition)) as TypeDefinition[];
        typeDefs.forEach(typeDef => recordName.push({ name: typeDef?.typeName?.value, checked: false }));
    } else if (STKindChecker.isTypeDefinition(definitions)) {
        recordName.push({ name: definitions.typeName.value, checked: false });
    }
    return recordName;
}

export function getActualRecordST(syntaxTree: STNode, recordName: string): TypeDefinition {
    let typeDef: TypeDefinition;
    if (STKindChecker.isModulePart(syntaxTree)) {
        typeDef = (syntaxTree.members
            .filter(definition => STKindChecker.isTypeDefinition(definition)) as TypeDefinition[])
            .find(record => record.typeName.value === recordName);
    }
    return typeDef;
}

export function getRemoveCreatedRecordRange(recordNames: string[], syntaxTree: STNode): STModification[] {
    const modifications: STModification[] = [];
    if (STKindChecker.isModulePart(syntaxTree)) {
        const typeDefs: TypeDefinition[] = syntaxTree.members
            .filter(definition => STKindChecker.isTypeDefinition(definition)) as TypeDefinition[];
        const createdRecords = typeDefs.filter(record => recordNames.includes(record.typeName.value));
        if (createdRecords.length > 0) {
            createdRecords.forEach((record) => {
                modifications.push(removeStatement(record.position));
            })
        }
    }
    return modifications;
}

export function getAvailableCreatedRecords(recordNames: RecordItemModel[], syntaxTree: STNode): RecordItemModel[] {
    const records: RecordItemModel[] = [];
    if (STKindChecker.isModulePart(syntaxTree)) {
        const typeDefs: TypeDefinition[] = syntaxTree.members
            .filter(definition => STKindChecker.isTypeDefinition(definition)) as TypeDefinition[];
        const avaibaleRecords = typeDefs.filter(record => recordNames.some(res => res.name === record.typeName.value));
        if (avaibaleRecords.length > 0) {
            avaibaleRecords.forEach((record) => {
                records.push({ name: record.typeName.value, checked: false });
            })
        }
    }
    return records;
}

export function getRootRecord(modulePartSt: ModulePart, name: string): TypeDefinition {
    return (modulePartSt.members.find(record => (STKindChecker.isTypeDefinition(record)
        && (record.typeName.value.replace(/\\/g, '') === name)))) as TypeDefinition;
}

export async function getModulePartST(partialSTRequest: PartialSTRequest, lsUrl: string, ls?: any): Promise<STNode> {
    const langClient: ExpressionEditorLangClientInterface = await ls.getExpressionEditorLangClient(lsUrl);

    const resp = await langClient.getSTForModulePart(partialSTRequest);
    return resp.syntaxTree;
}

export function getRecordPrefix(symbolInfo: STSymbolInfo): string {
    if (symbolInfo?.recordTypeDescriptions?.size > 0) {
        const typeDesc: RecordTypeDesc = symbolInfo?.recordTypeDescriptions?.entries().next()?.value[1];
        const typeSymbol = typeDesc.typeData?.typeSymbol;
        if (typeSymbol) {
            return `${typeSymbol.moduleID.orgName}/${typeSymbol.moduleID.moduleName}:${typeSymbol.moduleID.version}:`;
        }
    }
    return null;
}

export function getRecordModel(
    typeDesc: RecordTypeDesc,
    name: string,
    isInline: boolean,
    type?: string,
    isOptional?: boolean): RecordModel {
    const recordModel: RecordModel = {
        name, fields: [], isInline, type,
        isClosed: STKindChecker.isOpenBracePipeToken(typeDesc.bodyStartDelimiter),
        isOptional
    };
    if (typeDesc.fields.length > 0) {
        typeDesc.fields.forEach((field) => {
            if (STKindChecker.isTypeReference(field)) {
                // TODO: handle type reference
                return;
            }
            // FIXME: Handle record field with default value
            if (STKindChecker.isRecordFieldWithDefaultValue(field.typeName)) {
                // when there is a inline record with a default value
            } else if (STKindChecker.isRecordTypeDesc(field.typeName)) {
                // when there is a inline record
                const subRecModels = getRecordModel(field.typeName, field.fieldName.value, true, "record",
                    (field as RecordField)?.questionMarkToken !== undefined);
                recordModel.fields.push(subRecModels);
            } else if (STKindChecker.isOptionalTypeDesc(field.typeName)) {
                const recField: SimpleField = STKindChecker.isArrayTypeDesc(field.typeName.typeDescriptor) ?
                    (getArrayField(field) as SimpleField) : {
                        name: field.fieldName.value,
                        type: field.typeName.source.trim(),
                        isFieldOptional: STKindChecker.isRecordField(field) ? (field.questionMarkToken !== undefined) :
                            false
                    };
                recField.isFieldTypeOptional = true;
                if (STKindChecker.isRecordFieldWithDefaultValue(field)) {
                    recField.value = isLiteral(field.expression) ? field.expression.literalToken.value :
                        field.expression.source.trim();
                }
                recordModel.fields.push(recField);
            } else if (STKindChecker.isArrayTypeDesc(field.typeName)) {
                const recField = (getArrayField(field) as SimpleField)
                if (STKindChecker.isRecordFieldWithDefaultValue(field)) {
                    recField.value = isLiteral(field.expression) ? field.expression.literalToken.value :
                        field.expression.source.trim();
                }
                recordModel.fields.push(recField);
            } else if (STKindChecker.isIntTypeDesc(field.typeName) || STKindChecker.isBooleanTypeDesc(field.typeName)
                || STKindChecker.isFloatTypeDesc(field.typeName) || STKindChecker.isStringTypeDesc(field.typeName) ||
                STKindChecker.isNeverTypeDesc(field.typeName) ||
                STKindChecker.isSimpleNameReference(field.typeName)) {
                // when there is a simple field or when there is a referenced record
                const recField: SimpleField = {
                    name: field.fieldName.value,
                    type: field.typeName.name.value,
                    isFieldOptional: STKindChecker.isRecordField(field) ? (field.questionMarkToken !== undefined) :
                        false,
                    isFieldTypeOptional: false,
                }
                if (STKindChecker.isRecordFieldWithDefaultValue(field)) {
                    recField.value = isLiteral(field.expression) ? field.expression.literalToken.value :
                        field.expression.source.trim();
                }
                recordModel.fields.push(recField);
            } else {
                const recField: SimpleField = {
                    name: field.fieldName.value,
                    type: field.typeName.source.trim(),
                    isFieldOptional: STKindChecker.isRecordField(field) ? (field.questionMarkToken !== undefined) :
                        false,
                }
                if (STKindChecker.isRecordFieldWithDefaultValue(field)) {
                    recField.value = isLiteral(field.expression) ? field.expression.literalToken.value :
                        field.expression.source.trim();
                }
                recordModel.fields.push(recField);
            }
        })
    }
    return recordModel;
}

export function getArrayField(field: RecordField | RecordFieldWithDefaultValue): SimpleField | RecordModel {
    let recField: SimpleField | RecordModel;
    if ((STKindChecker.isOptionalTypeDesc(field.typeName)) &&
        STKindChecker.isArrayTypeDesc(field.typeName.typeDescriptor)) {
        recField = {
            name: field.fieldName.value,
            type: field.typeName.source.trim(),
            isFieldOptional: STKindChecker.isRecordField(field) ? (field.questionMarkToken !== undefined) :
                false,
        }
    } else if (STKindChecker.isArrayTypeDesc(field.typeName)) {
        if (STKindChecker.isRecordTypeDesc(field.typeName.memberTypeDesc)) {
            // when there is a inline record
            recField = getRecordModel(field.typeName.memberTypeDesc, field.fieldName.value, true,
                "record");
            if (STKindChecker.isRecordField(field) && (field as RecordField)?.questionMarkToken) {
                recField.isOptional = true;
            }
            recField.isArray = true;
        } else {
            recField = {
                name: field.fieldName.value,
                type: field.typeName.source.trim(),
                isFieldOptional: STKindChecker.isRecordField(field) ? (field.questionMarkToken !== undefined) :
                    false,
            }
        }
    }
    return recField;
}

export function getGeneratedCode(model: Field, isTypeDef: boolean): string {
    let codeGenerated: string;
    if (model.type === "record") {
        const recordModel = model as RecordModel;
        // TODO: handle type reference fields
        const recordBegin = `record {${recordModel.isClosed ? "|\n" : ""}`;
        let fieldCode = "";
        if (recordModel?.fields.length > 0) {
            recordModel.fields.forEach((field) => {
                fieldCode += getGeneratedCode(field, false);
            });
        }
        const recordEnd = isTypeDef ? `${recordModel.isClosed ? "|" : ""}};` :
            `${recordModel.isClosed ? "|" : ""}}${recordModel.isArray ? "[]" :
                ""} ${recordModel.name}${recordModel.isOptional ? "?" : ""};`;
        codeGenerated = recordBegin + fieldCode + recordEnd + "\n";
    } else {
        const fieldModel = model as SimpleField;
        codeGenerated = `${fieldModel.type}${fieldModel.isArray ? "[]" : ""} ${fieldModel.name}${fieldModel.
            isFieldOptional ? "?" : ""} ${fieldModel.value ? ` = ${fieldModel.value}` : ""};\n`;
    }
    return codeGenerated;
}

export function genRecordName(defaultName: string, variables: string[]): string {
    let index = 0;
    let varName = defaultName;
    while (variables.includes(varName)) {
        index++;
        varName = defaultName + index;
    }
    return varName;
}

export function getFieldNames(fields: Field[]): string[] {
    const fieldNames: string[] = [];
    fields.forEach((field) => {
        fieldNames.push(field.name);
    });
    return fieldNames;
}
