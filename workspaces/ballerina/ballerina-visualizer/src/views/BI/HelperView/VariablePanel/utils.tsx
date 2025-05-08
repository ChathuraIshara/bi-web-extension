/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TypeField } from "@wso2-enterprise/ballerina-core";
import { Codicon } from "@wso2-enterprise/ui-toolkit";


export function getTypeName(typeField: TypeField): string {
    if (typeField.typeName === "record") {
        return typeField?.typeInfo?.name;
    } else if (typeField.typeName === "array") {
        return `${typeField?.memberType?.typeInfo?.name}[]`;
    } else if (typeField.typeName === "intersection") {
        return typeField.members
            .map((member): string => getTypeName(member))
            .join(" & ");
    } else if (typeField.typeName === "enum") {
        return typeField?.typeInfo?.name;
    } else if (typeField.typeName === "object") {
        return typeField?.typeInfo?.moduleName ? `${typeField?.typeInfo?.moduleName}:${typeField?.typeInfo?.name}` : typeField?.typeName;
    } else if (typeField.typeName === "union") {
        return typeField.members
            .map((member): string => getTypeName(member))
            .join(" | ");
    } else if (typeField.typeName === "map") {
        return "map<" + getTypeName(typeField?.paramType) + ">";
    } else if (typeField.typeName === "stream") {
        return "stream<" + getTypeName(typeField?.leftTypeParam) + ", " + getTypeName(typeField?.rightTypeParam) + ">";
    } else if (typeField.typeName === "table") {
        return "table<" + getTypeName(typeField?.rowType) + ">";
    } else {
        return typeField?.typeName;
    }
}

export function getName(name: string, optional?: boolean): string {
    if (optional) {
        return `${name} (Optional)`;
    }
    return name;
}

export const getIcon = (kind: string) => {
    if (kind === "record") {
        return <Codicon name="symbol-structure" />;
    }
    const validKinds = ["array", "boolean", "class", "enum", "interface", "field"];
    if (validKinds.includes(kind)) {
        return <Codicon name={`symbol-${kind}`} />;
    }

    return <Codicon name="symbol-variable" />;
};
