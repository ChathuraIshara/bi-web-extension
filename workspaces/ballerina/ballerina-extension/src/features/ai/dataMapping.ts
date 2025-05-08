/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Attachment, createFunctionSignature, DataMappingRecord, ErrorCode, GenerateMappingFromRecordResponse, GenerateMappingsFromRecordRequest, GenerateTypesFromRecordRequest, GenerateTypesFromRecordResponse, getSource, PartialST, ProjectSource, SyntaxTree } from "@wso2-enterprise/ballerina-core";
import { FunctionDefinition, ModulePart, RequiredParam, STKindChecker } from "@wso2-enterprise/syntax-tree";
import { camelCase, memoize } from "lodash";
import path from "path";
import * as fs from 'fs';
import * as os from 'os';
import { Uri, workspace } from "vscode";
import { langClient } from "./activator";
import { getFunction, isErrorCode, processMappings, typesFileParameterDefinitions } from "../../rpc-managers/ai-panel/utils";
import { MODIFIYING_ERROR } from "../../views/ai-panel/errorCodes";
import { writeBallerinaFileDidOpen } from "../../utils/modification";


export async function generateDataMapping(
  projectRoot: string,
  request: GenerateMappingsFromRecordRequest
): Promise<GenerateMappingFromRecordResponse> {
    const source = createDataMappingFunctionSource(request.inputRecordTypes, request.outputRecordType, request.functionName, 
      request.inputNames);
    const file = request.attachment && request.attachment.length > 0
      ? request.attachment[0]
      : undefined;
    const updatedSource = await getUpdatedFunctionSource(projectRoot, source, request.imports, file);
    return Promise.resolve({mappingCode: updatedSource});
}

export async function generateTypeCreation(
  projectRoot: string,
  request: GenerateTypesFromRecordRequest
): Promise<GenerateTypesFromRecordResponse> {
    const file = request.attachment && request.attachment.length > 0
        ? request.attachment[0]
        : undefined;

    const updatedSource = await typesFileParameterDefinitions(file);
    if (typeof updatedSource !== 'string') {
        throw new Error(`Failed to generate types: ${JSON.stringify(updatedSource)}`);
    }

    return Promise.resolve({ typesCode: updatedSource });
}

async function getUpdatedFunctionSource(
    projectRoot: string,
    funcSource: string,
    imports: { moduleName: string; alias?: string }[],
    file?: Attachment
): Promise<string> {
    const importsString = imports
      .map(({ moduleName, alias }) =>
        alias ? `import ${moduleName} as ${alias};` : `import ${moduleName};`
      )
      .join("\n");
    const fullSource = `${importsString}\n\n${funcSource}`;
    
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "ballerina-data-mapping-temp-")
    );
    fs.cpSync(projectRoot, tempDir, { recursive: true });
    const tempTestFilePath = path.join(tempDir, "temp.bal");
    writeBallerinaFileDidOpen(tempTestFilePath, fullSource);

    const fileUri = Uri.file(tempTestFilePath).toString();
    const st = (await langClient.getSyntaxTree({
      documentIdentifier: {
        uri: fileUri,
      },
    })) as SyntaxTree;
  
    let funcDefinitionNode: FunctionDefinition = null;
    const modulePart = st.syntaxTree as ModulePart;
  
    modulePart.members.forEach((member) => {
      if (STKindChecker.isFunctionDefinition(member)) {
        funcDefinitionNode = member;
      }
    });
  
    if (!funcDefinitionNode) {
      throw new Error("Function definition not found in syntax tree");
    }
  
    const processedST = await processMappings(
      funcDefinitionNode,
      fileUri,
      file
    );
    if (isErrorCode(processedST)) {
      throw new Error((processedST as ErrorCode).message);
    }
  
    const { parseSuccess, source, syntaxTree } = processedST as SyntaxTree;
    if (!parseSuccess) {
      throw new Error("No valid fields were identified for mapping between the given input and output records.");
    }
  
    const fn = await getFunction(
      syntaxTree as ModulePart,
      funcDefinitionNode.functionName.value
    );
  
    return fn.source;
}

function createDataMappingFunctionSource(inputParams: DataMappingRecord[], outputParam: DataMappingRecord, functionName: string, inputNames:string[]): string {
  const finalFunctionName = functionName || "transform";

  function processType(type: string): string {
    let typeName = type.includes('/') ? type.split('/').pop()! : type;
    if (typeName.includes(':')) {
      const [modulePart, typePart] = typeName.split(':');
      typeName = `${modulePart.split('.').pop()}:${typePart}`;
    }
    return typeName;
  }

  const parametersStr = inputParams
    .map((item, index) => {
      const paramName = inputNames[index] || camelCase(processType(item.type));
      return `${processType(item.type)}${item.isArray ? '[]' : ''} ${paramName}`;
    })
    .join(", ");

  const returnTypeStr = `returns ${processType(outputParam.type)}${outputParam.isArray ? '[]' : ''}`;

  const modification = createFunctionSignature(
    "",
    finalFunctionName,
    parametersStr,
    returnTypeStr,
    { startLine: 0, startColumn: 0 },
    false,
    true,
    '{}'
  );
  const source = getSource(modification);
  return source;
}
