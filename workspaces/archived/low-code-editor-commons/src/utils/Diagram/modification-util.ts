/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { compile } from "handlebars";

import { default as templates } from "../../templates/components";
import { ListenerConfigFormState, ServiceConfigState, STModification } from "../../types";

import { getInsertComponentSource } from "./template-utils";

export const keywords = [
    "if", "else", "fork", "join", "while", "foreach",
    "in", "return", "returns", "break", "transaction",
    "transactional", "retry", "commit", "rollback", "continue",
    "typeof", "enum", "wait", "check", "checkpanic", "panic",
    "trap", "match", "import", "version", "public", "private",
    "as", "lock", "new", "record", "limit", "start", "flush",
    "untainted", "tainted", "abstract", "external", "final",
    "listener", "remote", "is", "from", "on", "select", "where",
    "annotation", "type", "function", "resource", "service", "worker",
    "object", "client", "const", "let", "source", "parameter", "field",
    "xmlns", "true", "false", "null", "table", "key", "default", "do",
    "base16", "base64", "conflict", "outer", "equals", "boolean", "int",
    "float", "string", "decimal", "handle", "var", "any", "anydata", "byte",
    "future", "typedesc", "map", "json", "xml", "error", "never", "readonly",
    "distinct", "stream"
];

export async function InsertorDelete(modifications: STModification[]): Promise<STModification[]> {
    const stModifications: STModification[] = [];
    /* tslint:disable prefer-for-of */
    for (let i = 0; i < modifications.length; i++) {
        const value: STModification = modifications[i];
        let stModification: STModification;
        if (value.type && value.type.toLowerCase() === "delete") {
            stModification = value;
        } else if (value.type && value.type.toLowerCase() === "import") {
            const source = await getInsertComponentSource(value.type, value.config);
            stModification = {
                startLine: value.startLine,
                startColumn: value.startColumn,
                endLine: value.endLine,
                endColumn: value.endColumn,
                type: "INSERT",
                isImport: true,
                config: {
                    "TYPE": value?.config?.TYPE,
                    "STATEMENT": source,
                }
            }
        } else if (value.type && value.type.toLowerCase() === 'insert') {
            stModification = value;
        } else {
            const source = await getInsertComponentSource(value.type, value.config);
            stModification = {
                startLine: value.startLine,
                startColumn: value.startColumn,
                endLine: value.endLine,
                endColumn: value.endColumn,
                type: "INSERT",
                config: {
                    "STATEMENT": source,
                }
            };
        }
        stModifications.push(stModification);
    }
    return stModifications;
}

export function createFunctionSignature(accessModifier: string, name: string, parameters: string, returnTypes: string,
                                        targetPosition: NodePosition, isLastMember?: boolean,
                                        isExpressionBodied?: boolean, expressionBody?: string): STModification {
    const functionStatement: STModification = {
        startLine: targetPosition.startLine,
        startColumn: isLastMember ? targetPosition.endColumn : 0,
        endLine: targetPosition.startLine,
        endColumn: isLastMember ? targetPosition.endColumn : 0,
        type: "FUNCTION_DEFINITION",
        config: {
            "ACCESS_MODIFIER": accessModifier,
            "NAME": name,
            "PARAMETERS": parameters,
            "RETURN_TYPE": returnTypes,
            "IS_EXPRESSION_BODIED": isExpressionBodied,
            "EXPRESSION_BODY": expressionBody
        }
    };

    return functionStatement;
}

export function updateFunctionSignature(name: string, parameters: string, returnTypes: string, targetPosition: NodePosition): STModification {
    const functionStatement: STModification = {
        startLine: targetPosition.startLine,
        startColumn: targetPosition.startColumn,
        endLine: targetPosition.endLine,
        endColumn: targetPosition.endColumn,
        type: "FUNCTION_DEFINITION_SIGNATURE",
        config: {
            "NAME": name,
            "PARAMETERS": parameters,
            "RETURN_TYPE": returnTypes
        }
    };

    return functionStatement;
}

export function createServiceDeclartion(
    config: ServiceConfigState, targetPosition: NodePosition, isLastMember?: boolean): STModification {
    const { serviceBasePath, listenerConfig: { fromVar, listenerName, listenerPort, createNewListener }, serviceType } = config;

    const modification: STModification = {
        startLine: targetPosition.startLine,
        endLine: targetPosition.startLine,
        startColumn: isLastMember ? targetPosition.endColumn : 0,
        endColumn: isLastMember ? targetPosition.endColumn : 0,
        type: ''
    };

    if (createNewListener) {
        return {
            ...modification,
            type: 'SERVICE_AND_LISTENER_DECLARATION',
            config: {
                'LISTENER_NAME': listenerName,
                'PORT': listenerPort,
                'BASE_PATH': serviceBasePath,
                'SERVICE_TYPE': serviceType ? serviceType : 'http'
            }
        }
    } else if (listenerPort) {
        return {
            ...modification,
            type: 'SERVICE_DECLARATION_WITH_NEW_INLINE_LISTENER',
            config: {
                'PORT': listenerPort,
                'BASE_PATH': serviceBasePath,
                'SERVICE_TYPE': serviceType ? serviceType : 'http'
            }
        }

    } else {
        return {
            ...modification,
            type: 'SERVICE_DECLARATION_WITH_SHARED_LISTENER',
            config: {
                'LISTENER_NAME': listenerName,
                'BASE_PATH': serviceBasePath,
            }
        }
    }
}

export function createListenerDeclartion(config: ListenerConfigFormState, targetPosition: NodePosition, isNew: boolean,
                                         serviceType: string, isLastMember?: boolean): STModification {
    const { listenerName, listenerPort } = config;
    let modification: STModification;
    if (isNew) {
        modification = {
            startLine: targetPosition.startLine,
            endLine: targetPosition.startLine,
            startColumn: isLastMember ? targetPosition.endColumn : 0,
            endColumn: isLastMember ? targetPosition.endColumn : 0,
            type: ''
        };
    } else {
        modification = {
            ...targetPosition,
            type: ''
        };
    }

    return {
        ...modification,
        type: 'LISTENER_DECLARATION',
        config: {
            'LISTENER_NAME': listenerName,
            'PORT': listenerPort,
            'SERVICE_TYPE': serviceType
        }
    }
}

export function updateServiceDeclartion(config: ServiceConfigState, targetPosition: NodePosition): STModification {
    const { serviceBasePath, listenerConfig: { fromVar, listenerName, listenerPort, createNewListener }, serviceType } = config;

    const modification: STModification = {
        ...targetPosition,
        type: ''
    };

    if (createNewListener) {
        return {
            ...modification,
            type: 'SERVICE_WITH_LISTENER_DECLARATION_UPDATE',
            config: {
                'LISTENER_NAME': listenerName,
                'PORT': listenerPort,
                'BASE_PATH': serviceBasePath,
                'SERVICE_TYPE': serviceType ? serviceType : 'http'
            }
        }
    } else if (listenerPort) {
        return {
            ...modification,
            type: 'SERVICE_DECLARATION_WITH_INLINE_LISTENER_UPDATE',
            config: {
                'PORT': listenerPort,
                'BASE_PATH': serviceBasePath,
                'SERVICE_TYPE': serviceType ? serviceType : 'http'
            }
        }

    } else {
        return {
            ...modification,
            type: 'SERVICE_DECLARATION_WITH_SHARED_LISTENER_UPDATE',
            config: {
                'LISTENER_NAME': listenerName,
                'BASE_PATH': serviceBasePath,
            }
        }
    }
}

export function createResource(method: string, path: string, parameters: string, addReturn: string, targetPosition: NodePosition): STModification {
    const resource: STModification = {
        startLine: targetPosition.startLine,
        startColumn: 0,
        endLine: targetPosition.startLine,
        endColumn: 0,
        type: "RESOURCE",
        config: {
            "METHOD": method,
            "PATH": path,
            "PARAMETERS": parameters,
            // "PAYLOAD": payload,
            // "ADD_CALLER": isCaller,
            // "ADD_REQUEST": isRequest,
            "ADD_RETURN": addReturn
        }
    };
    return resource;
}

export function createRemoteFunction(path: string, parameters: string, returnTypes: string, targetPosition: NodePosition): STModification {
    const remoteFunction: STModification = {
        startLine: targetPosition.startLine,
        startColumn: 0,
        endLine: targetPosition.startLine,
        endColumn: 0,
        type: "REMOTE_FUNCTION",
        config: {
            "PATH": path,
            "PARAMETERS": parameters,
            "ADD_RETURN": returnTypes
        }
    };
    return remoteFunction;
}

export function updateResourceSignature(method: string, path: string, parameters: string, addReturn: string, targetPosition: NodePosition): STModification {
    const resourceSignature: STModification = {
        startLine: targetPosition.startLine,
        startColumn: targetPosition.startColumn,
        endLine: targetPosition.endLine,
        endColumn: targetPosition.endColumn,
        type: "RESOURCE_SIGNATURE",
        config: {
            "METHOD": method,
            "PATH": path,
            "PARAMETERS": parameters,
            "ADD_RETURN": addReturn
        }
    };

    return resourceSignature;
}

export function updateRemoteFunctionSignature(name: string, parameters: string, returnTypes: string, targetPosition: NodePosition): STModification {
    const remoteFunctionSignature: STModification = {
        startLine: targetPosition.startLine,
        startColumn: targetPosition.startColumn,
        endLine: targetPosition.endLine,
        endColumn: targetPosition.endColumn,
        type: "REMOTE_FUNCTION_SIGNATURE",
        config: {
            "PATH": name,
            "PARAMETERS": parameters,
            "ADD_RETURN": returnTypes
        }
    };
    return remoteFunctionSignature;
}

export function createImportStatement(org: string, module: string, targetPosition: NodePosition): STModification {
    const moduleName = module;
    const formattedName = getFormattedModuleName(module);
    let moduleNameStr = org + "/" + module;

    const subModuleName = moduleName.split('.').pop();
    if (moduleName.includes('.') && subModuleName !== formattedName) {
        if (keywords.includes(subModuleName)){
            module = module.replace(subModuleName, "'" + subModuleName);
        }
        // add alias if module name is different with formatted name
        moduleNameStr = org + "/" + module + " as " + formattedName
    }

    const importStatement: STModification = {
        startLine: 0,
        startColumn: 0,
        endLine: 0,
        endColumn: 0,
        type: "IMPORT",
        config: {
            "TYPE": moduleNameStr
        }
    };

    return importStatement;
}

export function getFormattedModuleName(moduleName: string): string {
    let formattedModuleName = moduleName.includes('.') ? moduleName.split('.').pop() : moduleName;
    if (keywords.includes(formattedModuleName)) {
        formattedModuleName = `${formattedModuleName}0`;
    }
    return formattedModuleName;
}

export function getComponentSource(insertTempName: string, config: { [key: string]: any }) {
    const hbTemplate = compile(templates[insertTempName]);
    return hbTemplate(config);
}

export function getSource(modification: STModification): string {
    const source = getComponentSource(modification.type, modification.config);
    return source;
}
