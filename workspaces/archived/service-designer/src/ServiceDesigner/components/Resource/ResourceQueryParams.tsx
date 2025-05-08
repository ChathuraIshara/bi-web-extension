/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import {
    AnyTypeDesc,
    CommaToken,
    DefaultableParam,
    DotToken,
    IdentifierToken,
    IncludedRecordParam,
    RequiredParam,
    ResourcePathRestParam,
    ResourcePathSegmentParam,
    RestParam,
    SlashToken,
    STKindChecker,
} from "@wso2-enterprise/syntax-tree";

import "./style.scss";

interface ResourceQueryParamsProps {
    parameters: (
        | CommaToken
        | DefaultableParam
        | IncludedRecordParam
        | RequiredParam
        | RestParam
    )[];
    relativeResourcePath: (DotToken | IdentifierToken | ResourcePathRestParam | ResourcePathSegmentParam | SlashToken)[];
}

export function ResourceQueryParams(props: ResourceQueryParamsProps) {
    const { parameters, relativeResourcePath } = props;

    const pathElements = relativeResourcePath.map(node => {
        if (STKindChecker.isIdentifierToken(node) || STKindChecker.isSlashToken(node)) {
            return node.value
        } else if (STKindChecker.isResourcePathSegmentParam(node) || STKindChecker.isResourcePathRestParam(node)) {
            return (
                <>
                    [<span className={'type-descriptor'}>
                        {`${(node as any).typeDescriptor?.name?.value} `}
                    </span>
                    {STKindChecker.isResourcePathRestParam(node) ? '...' : ''}{(node as any).paramName?.value}]
                </>
            );
        } else if (STKindChecker.isDotToken(node)) {
            return (<>/</>);
        }
    });

    const queryParamComponents = parameters
        .filter((param) => !STKindChecker.isCommaToken(param))
        .filter(
            (param) =>
                STKindChecker.isRequiredParam(param) &&
                (STKindChecker.isStringTypeDesc(param.typeName) ||
                    STKindChecker.isIntTypeDesc(param.typeName) ||
                    STKindChecker.isBooleanTypeDesc(param.typeName) ||
                    STKindChecker.isFloatTypeDesc(param.typeName) ||
                    STKindChecker.isDecimalTypeDesc(param.typeName))
        )
        .map((param: RequiredParam, i) => (
            <span key={i}>
                {i !== 0 ? "&" : ""}
                {param.paramName.value}
                <sub className={'type-descriptor'}>{(param.typeName as AnyTypeDesc)?.name?.value}</sub>
            </span>
        ));

    return (
        <div className={"param-container"}>
            <p className={"path-text"}>
                {pathElements.length === 1 && pathElements[0] === '.' ? "/" : pathElements}
                <span>&nbsp;</span>
            </p>
        </div>
    );
}
