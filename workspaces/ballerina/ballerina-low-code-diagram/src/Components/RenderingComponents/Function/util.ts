/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

export function isQueryParam(param: STNode): boolean {
    if (STKindChecker.isRequiredParam(param)) {
        const annotationCheck: boolean = param.annotations && param.annotations.length === 0;
        let typeCheck: boolean = false;

        if (STKindChecker.isArrayTypeDesc(param.typeName)) {
            typeCheck = STKindChecker.isStringTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isIntTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isBooleanTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isFloatTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isDecimalTypeDesc(param.typeName.memberTypeDesc)
        } else {
            typeCheck = STKindChecker.isStringTypeDesc(param.typeName)
                || STKindChecker.isIntTypeDesc(param.typeName)
                || STKindChecker.isBooleanTypeDesc(param.typeName)
                || STKindChecker.isFloatTypeDesc(param.typeName)
                || STKindChecker.isDecimalTypeDesc(param.typeName)
        }

        return annotationCheck && typeCheck;
    } else if (STKindChecker.isDefaultableParam(param) || STKindChecker.isRestParam(param)) {
        let typeCheck: boolean = false;

        if (STKindChecker.isArrayTypeDesc(param.typeName)) {
            typeCheck = STKindChecker.isStringTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isIntTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isBooleanTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isFloatTypeDesc(param.typeName.memberTypeDesc)
                || STKindChecker.isDecimalTypeDesc(param.typeName.memberTypeDesc)
        } else {
            typeCheck = STKindChecker.isStringTypeDesc(param.typeName)
                || STKindChecker.isIntTypeDesc(param.typeName)
                || STKindChecker.isBooleanTypeDesc(param.typeName)
                || STKindChecker.isFloatTypeDesc(param.typeName)
                || STKindChecker.isDecimalTypeDesc(param.typeName)
        }

        return typeCheck;
    }

    return false;
}

