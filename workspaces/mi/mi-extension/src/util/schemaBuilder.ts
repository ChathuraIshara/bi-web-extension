/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 */

import { JSONSchema3or4 } from "to-json-schema";
import { StateMachine } from "../stateMachine";
import { IOType } from "@wso2-enterprise/mi-core";

export function convertToJSONSchema(fileContent: JSONSchema3or4): JSONSchema3or4 {
    let schema = JSON.parse(fileContent);
    return schema;
}

export async function generateSchema(ioType: IOType, schemaType: string, filePath: string): Promise<JSONSchema3or4> {
  const langClient = StateMachine.context().langClient!;
  const response = await langClient.generateSchema({
    filePath: filePath,
    delimiter: "",
    type: schemaType.toUpperCase(),
    title: ""
  });
  let schema = JSON.parse(response.schema);
  let schemaIOMetadataKey = `${ioType}Type`;
  let schemaIOMetadataValue = getSchemaIOMetadataValue(schemaType);
  schema[schemaIOMetadataKey] = schemaIOMetadataValue.toUpperCase();
  return schema;
}

export async function generateSchemaFromContent(ioType: IOType, content: string, fileType: string, csvDelimiter?: string): Promise<JSONSchema3or4> {
  const langClient = StateMachine.context().langClient!;
  const response = await langClient.generateSchemaFromContent({
    fileContent: content,
    delimiter: csvDelimiter ?? "",
    type: fileType.toUpperCase(),
    title: ""
  });
  let schema = JSON.parse(response.schema);
  let schemaIOMetadataKey = `${ioType}Type`;
  let schemaIOMetadataValue = getSchemaIOMetadataValue(fileType);
  schema[schemaIOMetadataKey] = schemaIOMetadataValue.toUpperCase();
  return schema;
}

function getSchemaIOMetadataValue(schemaType) {
  switch (schemaType.toUpperCase()) {
      case 'JSONSCHEMA':
          return 'JSON';
      case 'XSD':
          return 'XML';
      default:
          return schemaType;
  }
}