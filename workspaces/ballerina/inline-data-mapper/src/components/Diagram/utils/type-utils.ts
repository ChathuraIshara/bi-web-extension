/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { IOType, TypeKind } from "@wso2-enterprise/ballerina-core";

export function getTypeName(fieldType: IOType): string {
	if (!fieldType) {
		return '';
	}

    let typeName = fieldType?.typeName || fieldType.kind;

    if (fieldType.kind === TypeKind.Array && fieldType.member) {
		typeName = `${getTypeName(fieldType.member)}[]`;
	}

	return typeName;
}

export function getDMTypeDim(fieldType: IOType) {
    let dim = 0;
    let currentType = fieldType;
    while (currentType.kind === TypeKind.Array) {
        dim++;
        currentType = currentType.member;
    }
    return dim;
}
