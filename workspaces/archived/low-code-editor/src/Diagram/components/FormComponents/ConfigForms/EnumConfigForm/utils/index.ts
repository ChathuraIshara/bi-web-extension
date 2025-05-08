/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    EnumDeclaration,
    STKindChecker,
} from "@wso2-enterprise/syntax-tree";

import { EnumModel, Field, SimpleField } from "../types";

export function getEnumModel(typeDesc: EnumDeclaration, name: string, isInline: boolean, type?: string,
                             isOptional?: boolean): EnumModel {
    const enumModel: EnumModel = {
        name, fields: [], isInline, type,
    };
    if (typeDesc.enumMemberList.length > 0) {
        typeDesc.enumMemberList.forEach((field) => {
            // FIXME: Handle enum field with default value
            if (STKindChecker.isEnumMember(field)) {
                const recField: SimpleField = {
                    name: field.source.trim(),
                    type: 'member',
                    isFieldOptional: false,
                }
                enumModel.fields.push(recField);
            }
        })
    }
    return enumModel;
}


export function getGeneratedCode(model: Field, isLast?: boolean): string {
    let codeGenerated: string;
    if (model.type === "enum") {
        const enumModel = model as EnumModel;
        // TODO: handle type reference fields
        const enumBegin = `enum ${model.name} {\n`;
        let fieldCode = "";
        if (enumModel?.fields.length > 0) {
            enumModel.fields.forEach((field, index) => {
                fieldCode += getGeneratedCode(field, index === (enumModel?.fields.length - 1));
            });
        }
        codeGenerated = enumBegin + fieldCode + "\n}";
    } else if (model.type === 'member') {
        codeGenerated = `${model.name} ${isLast ? '' : ','}\n`
    }
    return codeGenerated;
}

export function getMemberArray(model: Field): string[] {
    const members: string[] = [];
    const enumModel = model as EnumModel;
    if (enumModel?.fields.length > 0) {
        enumModel.fields.forEach((field, index) => {
            if (index === (enumModel?.fields.length - 1)) {
                members.push(field.name);
            } else {
                members.push(field.name + ',');
            }
        });
    }
    return members;
}

export function genEnumName(defaultName: string, variables: string[]): string {
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
