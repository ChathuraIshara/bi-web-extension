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
  CommaToken,
  DefaultableParam,
  IncludedRecordParam,
  RequiredParam,
  RestParam,
  STKindChecker,
} from "@wso2-enterprise/syntax-tree";

import "./style.scss";

interface ResourceOtherParamsProps {
  parameters: (
    | CommaToken
    | DefaultableParam
    | IncludedRecordParam
    | RequiredParam
    | RestParam
  )[];
}

export function ResourceOtherParams(props: ResourceOtherParamsProps) {
  const { parameters } = props;

  const otherParamComponents = parameters
    .filter((param) => !STKindChecker.isCommaToken(param))
    .filter(
      (param) =>
        STKindChecker.isRequiredParam(param) &&
        !(
          STKindChecker.isStringTypeDesc(param.typeName) ||
          STKindChecker.isIntTypeDesc(param.typeName) ||
          STKindChecker.isBooleanTypeDesc(param.typeName) ||
          STKindChecker.isFloatTypeDesc(param.typeName) ||
          STKindChecker.isDecimalTypeDesc(param.typeName)
        )
    )
    .map((param: RequiredParam, i) => (
      <span key={i} className={"signature-param"}>
        {param.source}
      </span>
    ));

  return (
    <div className={"param-container"}>
      <p className={"path-text"}>{otherParamComponents}</p>
    </div>
  );
}
