/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    BallerinaConnectorInfo,
    BallerinaConnectorRequest,
    DiagramEditorLangClientInterface,
    FormField,
    FormFieldReturnType,
    PathParam,
    PrimitiveBalType,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    BlockStatement,
    DoStatement,
    ForeachStatement,
    IfElseStatement,
    ModulePart,
    NodePosition,
    QualifiedNameReference,
    STKindChecker,
    STNode,
    traversNode,
    VisibleEndpoint,
    WhileStatement,
} from "@wso2-enterprise/syntax-tree";

import { isEndpointNode } from "../../../../../utils";
import { visitor as ReturnTypeVisitor } from "../../../../../visitors/return-type-visitor";
import { getFieldName, getFormattedModuleName } from "../../../../Portals/utils";
import { isAllDefaultableFields, isAnyFieldSelected, isDependOnDriver } from "../../../Utils";

const EXPR_PLACEHOLDER = "EXPRESSION";

export async function fetchConnectorInfo(
    connector: BallerinaConnectorInfo,
    langServerURL?: string,
    currentFilePath?: string,
    getDiagramEditorLangClient?: (url: string) => Promise<DiagramEditorLangClientInterface>
): Promise<BallerinaConnectorInfo> {
    let connectorInfo;
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
        const langClient = await getDiagramEditorLangClient(langServerURL);
        const connectorResp = await langClient?.getConnector(connectorRequest);
        if (connectorResp) {
            connectorInfo = connectorResp as BallerinaConnectorInfo;
        }
    }
    return connectorInfo;
}

export function getMatchingConnector(node: STNode): BallerinaConnectorInfo {
    let connector: BallerinaConnectorInfo;
    if (
        node &&
        isEndpointNode(node) &&
        (STKindChecker.isLocalVarDecl(node) || STKindChecker.isModuleVarDecl(node)) &&
        STKindChecker.isQualifiedNameReference(node.typedBindingPattern.typeDescriptor)
    ) {
        const nameReference = node.typedBindingPattern.typeDescriptor as QualifiedNameReference;
        const typeSymbol = nameReference.typeData?.typeSymbol;
        const module = typeSymbol?.moduleID;
        if (typeSymbol && module) {
            connector = {
                name: typeSymbol.name,
                moduleName: module.moduleName,
                package: {
                    organization: module.orgName,
                    name: module.packageName || module.moduleName,
                    version: module.version,
                },
                functions: [],
            };
        }
    }

    return connector;
}

export function getPathParams(params: PathParam[]): string[]{
    if (!params) { return []; }
    const pathParams: string[] = [];
    params.forEach((param) => {
        switch (param.typeName) {
            case "token":
                pathParams.push(param.name);
                break;
                case PrimitiveBalType.String:
                    pathParams.push(`["${param.name}"]`);
                    break;
                case PrimitiveBalType.Int:
                    case PrimitiveBalType.Float:
                        case PrimitiveBalType.Decimal:
                    pathParams.push(`[0]`);
                    pathParams.push(`[0]`);
                    break;
                default:
                    // Skip other tokens
        }
    });
    return pathParams;
}

export function getDefaultParams(parameters: FormField[], depth = 1, valueOnly = false): string[] {
    if (!parameters) {
        return [];
    }
    const parameterList: string[] = [];
    parameters.forEach((parameter) => {
        if (parameter.defaultable || parameter.optional) {
            return;
        }
        let draftParameter = "";
        switch (parameter.typeName) {
            case PrimitiveBalType.String:
                draftParameter = getFieldValuePair(parameter, `""`, depth, valueOnly);
                break;
            case PrimitiveBalType.Int:
            case PrimitiveBalType.Float:
            case PrimitiveBalType.Decimal:
                draftParameter = getFieldValuePair(parameter, `0`, depth, valueOnly);
                break;
            case PrimitiveBalType.Boolean:
                draftParameter = getFieldValuePair(parameter, `true`, depth, valueOnly);
                break;
            case PrimitiveBalType.Array:
                draftParameter = getFieldValuePair(parameter, `[]`, depth, valueOnly);
                break;
            case PrimitiveBalType.Xml:
                draftParameter = getFieldValuePair(parameter, "xml ``", depth, valueOnly);
                break;
            case PrimitiveBalType.Nil:
            case "anydata":
            case "()":
                draftParameter = getFieldValuePair(parameter, `()`, depth, true);
                break;
            case PrimitiveBalType.Json:
            case "map":
                draftParameter = getFieldValuePair(parameter, `{}`, depth, valueOnly);
                break;
            case PrimitiveBalType.Record:
                const allFieldsDefaultable = isAllDefaultableFields(parameter?.fields);
                if (!parameter.selected && allFieldsDefaultable && (parameter.optional || parameter.defaultValue)) {
                    break;
                }
                if (parameter.selected && allFieldsDefaultable && (parameter.optional || parameter.defaultValue) &&
                    !isAnyFieldSelected(parameter?.fields)) {
                    break;
                }
                const insideParamList = getDefaultParams(parameter.fields, depth + 1);
                draftParameter = getFieldValuePair(parameter, `{\n${insideParamList?.join()}}`, depth, valueOnly, false);
                break;
            case PrimitiveBalType.Enum:
            case PrimitiveBalType.Union:
                const selectedMember = getSelectedUnionMember(parameter);
                const selectedMemberParams = getDefaultParams([ selectedMember ], depth + 1, true);
                draftParameter = getFieldValuePair(parameter, selectedMemberParams?.join(), depth, false, false);
                break;
            case "inclusion":
                if (isAllDefaultableFields(parameter.inclusionType?.fields) && !parameter.selected) {
                    break;
                }
                const inclusionParams = getDefaultParams([ parameter.inclusionType ], depth + 1, true);
                draftParameter = getFieldValuePair(parameter, `${inclusionParams?.join()}`, depth);
                break;
            case "object":
                const typeInfo = parameter.typeInfo;
                if (
                    typeInfo &&
                    typeInfo.orgName === "ballerina" &&
                    typeInfo.moduleName === "sql" &&
                    typeInfo.name === "ParameterizedQuery"
                ) {
                    draftParameter = getFieldValuePair(parameter, "``", depth);
                }
                break;
            default:
                if (!parameter.name) {
                    // Handle Enum type
                    draftParameter = getFieldValuePair(parameter, `"${parameter.typeName}"`, depth, true);
                }
                if (parameter.name === "rowType") {
                    // Handle custom return type
                    draftParameter = getFieldValuePair(parameter, EXPR_PLACEHOLDER, depth);
                }
                break;
        }
        if (draftParameter !== "") {
            parameterList.push(draftParameter);
        }
    });
    return parameterList;
}

function getFieldValuePair(
    parameter: FormField,
    defaultValue: string,
    depth: number,
    valueOnly = false,
    useParamValue = true
): string {
    let value = defaultValue || EXPR_PLACEHOLDER;
    if (useParamValue && parameter.value) {
        value = parameter.value;
    }
    if (depth === 1 && !valueOnly) {
        // Handle named args
        return `${getFieldName(parameter.name)} = ${defaultValue}`;
    }
    if (depth > 1 && !valueOnly) {
        return `${getFieldName(parameter.name)}: ${defaultValue}`;
    }
    return defaultValue;
}

export function getUnionFormFieldName(field: FormField): string {
    return field.name || field.typeInfo?.name || field.typeName;
}

export function getSelectedUnionMember(unionFields: FormField): FormField {
    let selectedMember = unionFields.members?.find((member) => member.selected === true);
    if (!selectedMember) {
        selectedMember = unionFields.members?.find(
            (member) => getUnionFormFieldName(member) === unionFields.selectedDataType
        );
    }
    if (!selectedMember) {
        selectedMember = unionFields.members?.find(
            (member) => member.typeName === unionFields.value?.replace(/['"]+/g, "")
        );
    }
    if (!selectedMember && unionFields.members && unionFields.members.length > 0) {
        selectedMember = unionFields.members[ 0 ];
    }
    return selectedMember;
}

export function getFormFieldReturnType(formField: FormField, depth = 1): FormFieldReturnType {
    const response: FormFieldReturnType = {
        hasError: formField?.isErrorType ? true : false,
        hasReturn: false,
        returnType: "var",
        importTypeInfo: [],
    };
    const primitives = [
        "string",
        "int",
        "float",
        "decimal",
        "boolean",
        "json",
        "xml",
        "handle",
        "byte",
        "object",
        "handle",
        "anydata",
    ];
    const returnTypes: string[] = [];

    if (formField) {
        switch (formField.typeName) {
            case "union":
                formField?.members?.forEach((field) => {
                    const returnTypeResponse = getFormFieldReturnType(field, depth + 1);
                    const returnType = returnTypeResponse.returnType;
                    response.hasError = returnTypeResponse.hasError || response.hasError;
                    response.hasReturn = returnTypeResponse.hasReturn || response.hasReturn;
                    response.importTypeInfo = [ ...response.importTypeInfo, ...returnTypeResponse.importTypeInfo ];

                    // collector
                    if (returnType && returnType !== "var") {
                        returnTypes.push(returnType);
                    }
                });

                if (returnTypes.length > 0) {
                    if (returnTypes.length > 1) {
                        // concat all return types with | character
                        response.returnType = returnTypes.reduce((fullType, subType) => {
                            return `${fullType}${subType !== "?" ? "|" : ""}${subType}`;
                        });
                    } else {
                        response.returnType = returnTypes[ 0 ];
                        if (response.returnType === "?") {
                            response.hasReturn = false;
                        }
                    }
                }
                break;

            case "map":
                const paramType = getFormFieldReturnType(formField.paramType, depth + 1);
                response.hasError = paramType.hasError;
                response.hasReturn = true;
                response.returnType = `map<${paramType.returnType}>`;
                break;

            case "array":
                if (formField?.memberType) {
                    const returnTypeResponse = getFormFieldReturnType(formField.memberType, depth + 1);
                    response.returnType = returnTypeResponse.returnType;
                    response.hasError = returnTypeResponse.hasError || response.hasError;
                    response.hasReturn = returnTypeResponse.hasReturn || response.hasReturn;
                    response.importTypeInfo = [ ...response.importTypeInfo, ...returnTypeResponse.importTypeInfo ];
                }

                if (response.returnType && formField.typeName === PrimitiveBalType.Array) {
                    // set array type
                    response.returnType = response.returnType.includes("|")
                        ? `(${response.returnType})[]`
                        : `${response.returnType}[]`;
                }
                break;

            case "stream":
                let returnTypeResponseLeft = null;
                let returnTypeResponseRight = null;
                if (formField?.leftTypeParam) {
                    returnTypeResponseLeft = getFormFieldReturnType(formField.leftTypeParam, depth + 1);
                    response.importTypeInfo = [ ...response.importTypeInfo, ...returnTypeResponseLeft.importTypeInfo ];
                }
                if (formField?.rightTypeParam) {
                    returnTypeResponseRight = getFormFieldReturnType(formField.rightTypeParam, depth + 1);
                    response.importTypeInfo = [ ...response.importTypeInfo, ...returnTypeResponseRight.importTypeInfo ];
                }
                if (
                    returnTypeResponseLeft.returnType &&
                    returnTypeResponseRight &&
                    (returnTypeResponseRight.returnType || returnTypeResponseRight.hasError)
                ) {
                    const rightType = returnTypeResponseRight.hasError ? "error?" : returnTypeResponseRight.returnType;
                    response.returnType = `stream<${returnTypeResponseLeft.returnType},${rightType}>`;
                }
                if (returnTypeResponseLeft.returnType && !returnTypeResponseRight?.returnType) {
                    response.returnType = `stream<${returnTypeResponseLeft.returnType}>`;
                }
                if (response.returnType) {
                    response.hasReturn = true;
                    formField.isErrorType = false;
                    response.hasError = false;
                }
                break;

            case "tuple":
                formField?.fields.forEach((field) => {
                    const returnTypeResponse = getFormFieldReturnType(field, depth + 1);
                    const returnType = returnTypeResponse.returnType;
                    response.hasError = returnTypeResponse.hasError || response.hasError;
                    response.hasReturn = returnTypeResponse.hasReturn || response.hasReturn;
                    response.importTypeInfo = [ ...response.importTypeInfo, ...returnTypeResponse.importTypeInfo ];
                    // collector
                    if (returnType && returnType !== "var") {
                        returnTypes.push(returnType);
                    }
                });

                if (returnTypes.length > 0) {
                    response.returnType = returnTypes.length > 1 ? `[${returnTypes.join(",")}]` : returnTypes[ 0 ];
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
                    response.hasError = true;
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
                if (
                    type === "" &&
                    !formField.typeInfo &&
                    primitives.includes(formField.typeName) &&
                    formField?.isStream &&
                    formField.isErrorType
                ) {
                    // set stream record type with error
                    type = `${formField.typeName},error`;
                    response.hasReturn = true;
                    // remove error return
                    response.hasError = false;
                }
                if (type === "" && formField.typeName.includes("map<")) {
                    // map type
                    type = formField.typeName;
                    response.hasReturn = true;
                }
                if (type === "" && formField.typeName.includes("[") && formField.typeName.includes("]")) {
                    // tuple type
                    type = formField.typeName;
                    response.hasReturn = true;
                }
                if (
                    type === "" &&
                    !formField.isStream &&
                    formField.typeName &&
                    primitives.includes(formField.typeName)
                ) {
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
                    type = type.includes("|") ? `(${type})[]` : `${type}[]`;
                }
                if ((type !== "" || formField.isErrorType) && formField?.optional) {
                    // set optional tag
                    type = type.includes("|") ? `(${type})?` : `${type}?`;
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

export function getTargetBlock(targetPosition: NodePosition, blockNode: STNode): BlockStatement {
    // Go through block statements to identify which block represent the target position
    if (
        STKindChecker.isBlockStatement(blockNode) ||
        (STKindChecker.isFunctionBodyBlock(blockNode) &&
            blockNode.position?.startLine < targetPosition.startLine &&
            blockNode.position?.endLine >= targetPosition.startLine)
    ) {
        // Go through each statements to find exact block
        const blockStatements = blockNode.statements as STNode[];
        if (!blockStatements || blockStatements.length === 0) {
            // Empty block
            return blockNode as BlockStatement;
        }

        const targetBlock = blockStatements?.find(
            (block) =>
                block.position?.startLine < targetPosition.startLine &&
                block.position?.endLine >= targetPosition.startLine
        );
        if (!targetBlock) {
            return blockNode as BlockStatement;
        }

        switch (targetBlock.kind) {
            case "IfElseStatement":
                const ifBlock = getTargetIfBlock(targetPosition, targetBlock as IfElseStatement);
                return getTargetBlock(targetPosition, ifBlock);
            case "ForeachStatement":
                return getTargetBlock(targetPosition, (targetBlock as ForeachStatement).blockStatement);
            case "WhileStatement":
                return getTargetBlock(targetPosition, (targetBlock as WhileStatement).whileBody);
            case "DoStatement":
                return getTargetBlock(targetPosition, (targetBlock as DoStatement).blockStatement);
            default:
                return targetBlock as BlockStatement;
        }
    }
    return null;
}

export function getTargetIfBlock(targetPosition: NodePosition, blockNode: IfElseStatement): BlockStatement {
    if (
        STKindChecker.isIfElseStatement(blockNode) &&
        blockNode.ifBody.position?.startLine < targetPosition.startLine &&
        blockNode.ifBody.position?.endLine >= targetPosition.startLine
    ) {
        return blockNode.ifBody;
    }
    if (
        STKindChecker.isIfElseStatement(blockNode) &&
        STKindChecker.isElseBlock(blockNode.elseBody) &&
        STKindChecker.isIfElseStatement(blockNode.elseBody.elseBody) &&
        blockNode.elseBody.elseBody.position?.startLine < targetPosition.startLine &&
        blockNode.elseBody.elseBody.position?.endLine >= targetPosition.startLine
    ) {
        return getTargetIfBlock(targetPosition, blockNode.elseBody.elseBody);
    }
    if (
        STKindChecker.isElseBlock(blockNode.elseBody) &&
        STKindChecker.isBlockStatement(blockNode.elseBody.elseBody) &&
        blockNode.elseBody.position?.startLine < targetPosition.startLine &&
        blockNode.elseBody.position?.endLine >= targetPosition.startLine
    ) {
        return blockNode.elseBody.elseBody;
    }
    return null;
}

export function getConnectorFromVisibleEp(endpoint: VisibleEndpoint) {
    const connector: BallerinaConnectorInfo = {
        name: endpoint.typeName,
        moduleName: endpoint.moduleName,
        package: {
            organization: endpoint.orgName,
            name: endpoint.packageName,
            version: endpoint.version,
        },
        functions: [],
    };
    return connector;
}

export function getConnectorImports(syntaxTree: STNode, organization: string, moduleName: string, withExistingImports = false) {
    let isModuleImported = false;
    let isDriverImported = false;
    const imports = new Set<string>();

    if (STKindChecker.isModulePart(syntaxTree)) {
        (syntaxTree as ModulePart).imports?.forEach((imp: any) => {
            if (
                STKindChecker.isImportDeclaration(imp) &&
                imp.orgName?.orgName.value === organization &&
                imp.typeData?.symbol?.moduleID?.moduleName === `${moduleName}`
            ) {
                isModuleImported = true;
            }
            if (
                STKindChecker.isImportDeclaration(imp) &&
                imp.orgName?.orgName.value === organization &&
                imp.typeData?.symbol?.moduleID?.moduleName === `${moduleName}.driver`
            ) {
                isDriverImported = true;
            }
        });
        if (withExistingImports || !isModuleImported) {
            imports.add(`${organization}/${moduleName}`);
        }
        if (!isDriverImported && isDependOnDriver(moduleName)) {
            imports.add(`${organization}/${moduleName}.driver as _`);
        }
    }
    return imports;
}

export function getReturnTypeImports(returnType: FormFieldReturnType) {
    const imports = new Set<string>();
    if (returnType.importTypeInfo) {
        returnType.importTypeInfo?.forEach((typeInfo) => {
            imports.add(`${typeInfo.orgName}/${typeInfo.moduleName}`);
        });
    }
    return imports;
}

export function isParentNodeWithErrorReturn(blockNode: STNode) {
    if (blockNode && (STKindChecker.isFunctionDefinition(blockNode) || STKindChecker.isResourceAccessorDefinition(blockNode))) {
        traversNode(blockNode.functionSignature, ReturnTypeVisitor);
        return ReturnTypeVisitor.hasError();
    }
    return false;
}
