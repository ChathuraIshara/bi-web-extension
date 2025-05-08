/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { cloneDeep } from "lodash";
import { COMMANDS, SWAGGER_PATH_TEMPLATE, SWAGGER_REL_DIR } from "../constants";
import { SwaggerFromAPIResponse } from "@wso2-enterprise/mi-core";
import { StateMachine } from "../stateMachine";
import { workspace, window } from "vscode";
import path from "path";
import * as vscode from 'vscode';
import { deleteRegistryResource } from "./fileOperations";

const fs = require('fs');

export interface Swagger {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
    };
    servers: {
        url: string;
    }[];
    paths: Record<string, any>;
}

interface SwaggerUtilProps {
    existingSwagger: Swagger;
    generatedSwagger: Swagger;
}

interface Resource {
    path: string;
    methods: string[];
}

interface ResourceInfoResponse {
    added: Resource[];
    removed: Resource[];
    updated: Resource[];
}

/**
 * Compares two objects and returns true if they are equal.
 * @param obj1 - Object 1
 * @param obj2 - Object 2
 * @param levels - Number of levels to compare
 * @returns - Equal or not upto the specified levels
 */
const recursiveComparison = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    let isEqual = true;
    for (const field in obj1) {
        if (typeof obj2[field] === "undefined") {
            isEqual = false;
            break;
        }

        if (typeof obj1[field] === "object") {
            isEqual = recursiveComparison(obj1[field], obj2[field]);

            if (!isEqual) {
                break;
            }
        } else {
            if (obj1[field] !== obj2[field]) {
                isEqual = false;
                break;
            }
        }
    }

    return isEqual;
};

/**
 * Checks if two swagger paths are equal
 * @param path1 - Object 1
 * @param path2 - Object 2
 * @param comparisonTemplate - Template with comparison instructions
 * @returns - Equal or not
 */
const isEqualPaths = (
    path1: Record<string, any>,
    path2: Record<string, any>,
    comparisonTemplate: Record<string, any>
): boolean => {
    if (!comparisonTemplate?.body) {
        return true;
    }

    if (Object.keys(path1).length !== Object.keys(path2).length) {
        return false;
    }

    let isEqual = true;
    const keys = Object.keys(comparisonTemplate.body);
    if (comparisonTemplate.type === "array") {
        if (comparisonTemplate.primaryKey?.length) {
            const primaryKey = comparisonTemplate.primaryKey;
            for (const key in path2) {
                const obj = path2[key];
                const index = path1.findIndex((object: Record<string, any>) => {
                    return primaryKey.every((pk: string) => object[pk] === obj[pk]);
                });

                if (index > -1) {
                    isEqual = isEqualPaths(path1[index], obj, comparisonTemplate.body["*"]);
                } else {
                    isEqual = false;
                }

                if (!isEqual) {
                    break;
                }
            }
        }
    } else {
        if (keys.length === 1 && keys[0] === "*") {
            for (const key in path2) {
                if (path1[key]) {
                    isEqual = isEqualPaths(path1[key], path2[key], comparisonTemplate.body["*"]);
                } else {
                    isEqual = false;
                }

                if (!isEqual) {
                    break;
                }
            }
        } else {
            for (const key in comparisonTemplate.body) {
                if (path2[key] && path1[key]) {
                    isEqual = isEqualPaths(path1[key], path2[key], comparisonTemplate.body[key]);
                } else if ((!path2[key] && path1[key]) || (path2[key] && !path1[key])) {
                    isEqual = false;
                } else {
                    isEqual = true;
                }

                if (!isEqual) {
                    break;
                }
            }
        }
    }

    return isEqual;
};

export const isEqualSwaggers = (props: SwaggerUtilProps): boolean => {
    const { existingSwagger, generatedSwagger } = props;

    let isEqual = true;
    for (const field in existingSwagger) {
        if (field === "paths") {
            isEqual = isEqualPaths(existingSwagger[field], generatedSwagger[field], SWAGGER_PATH_TEMPLATE);
        } else {
            isEqual = recursiveComparison(existingSwagger[field], generatedSwagger[field]);
        }

        if (!isEqual) {
            break;
        }
    }

    return isEqual;
};

/**
 * Merges swagger resources and methods.
 * @param oldObj - Existing resources object
 * @param newObj - Generated resources object
 * @param mergeTemplate - Template with merging instructionss
 * @returns - Merged resources object
 */
const recursivePathMerge = (
    oldObj: Record<string, any>,
    newObj: Record<string, any>,
    mergeTemplate: Record<string, any>
): Record<string, any> => {
    if (!mergeTemplate?.body) {
        return newObj;
    }

    const result = cloneDeep(newObj);
    const keys = Object.keys(mergeTemplate.body);

    if (mergeTemplate.type === "array") {
        if (mergeTemplate.primaryKey?.length) {
            const primaryKey = mergeTemplate.primaryKey;
            for (const key in newObj) {
                const obj = newObj[key];
                const index = oldObj.findIndex((object: Record<string, any>) => {
                    return primaryKey.every((pk: string) => object[pk] === obj[pk]);
                });

                if (index > -1) {
                    result[key] = recursivePathMerge(oldObj[index], obj, mergeTemplate.body["*"]);
                }
            }
        }
    } else {
        if (keys.length === 1 && keys[0] === "*") {
            for (const key in newObj) {
                if (oldObj[key]) {
                    result[key] = recursivePathMerge(oldObj[key], newObj[key], mergeTemplate.body["*"]);
                }
            }
        } else {
            for (const key in mergeTemplate.body) {
                if (newObj[key] && oldObj[key]) {
                    result[key] = recursivePathMerge(oldObj[key], newObj[key], mergeTemplate.body[key]);
                }
            }
        }
    }

    return result;
};

export const mergeSwaggers = (props: SwaggerUtilProps): Swagger => {
    const { existingSwagger, generatedSwagger } = props;

    return {
        ...generatedSwagger,
        paths: recursivePathMerge(existingSwagger.paths, generatedSwagger.paths, SWAGGER_PATH_TEMPLATE),
    };
};

export const getResourceInfo = (props: SwaggerUtilProps): ResourceInfoResponse => {
    const { existingSwagger, generatedSwagger } = props;
    const added: Resource[] = [];
    const removed: Resource[] = [];
    const updated: Resource[] = [];

    // Find newly added resources
    for (const resource in existingSwagger.paths) {
        if (!generatedSwagger.paths[resource]) {
            added.push({
                path: resource,
                methods: Object.keys(existingSwagger.paths[resource]).map((method) => method.toUpperCase()),
            });
        } else {
            for (const method in existingSwagger.paths[resource]) {
                if (generatedSwagger.paths[resource][method]) {
                    updated.push({
                        path: resource,
                        methods: Object.keys(existingSwagger.paths[resource]).map((method) => method.toUpperCase()),
                    });
                }
            }
        }
    }

    // Find removed resources
    for (const resource in generatedSwagger.paths) {
        if (!existingSwagger.paths[resource]) {
            removed.push({
                path: resource,
                methods: Object.keys(generatedSwagger.paths[resource]).map((method) => method.toUpperCase()),
            });
        }
    }

    return { added, removed, updated };
};

export function generateSwagger(apiPath: string): Promise<SwaggerFromAPIResponse> {
    return new Promise(async (resolve) => {
        const langClient = StateMachine.context().langClient!;
        const response = await langClient.swaggerFromAPI({ apiPath: apiPath });
        const generatedSwagger = response.swagger;
        const workspacePath = workspace.workspaceFolders![0].uri.fsPath;
        const dirPath = path.join(workspacePath, SWAGGER_REL_DIR);
        const swaggerPath = path.join(dirPath, path.basename(apiPath, path.extname(apiPath)) + '.yaml');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(swaggerPath, generatedSwagger);
        resolve({ generatedSwagger: generatedSwagger });
    });
}

export function deleteSwagger(apiPath: string) {
    const projectRoot = StateMachine.context().projectUri!;
    const swaggerDir = path.join(projectRoot!, SWAGGER_REL_DIR);
    const swaggerFilePath = path.join(swaggerDir, path.basename(apiPath, path.extname(apiPath)) + '.yaml');
    if (fs.existsSync(swaggerFilePath)) {
        window.showInformationMessage(`API file ${path.basename(apiPath)} has been deleted. Do you want to delete the related Swagger file?`, 'Yes', 'No').then(async answer => {
            if (answer === 'Yes') {
                await deleteRegistryResource(swaggerFilePath);
                window.showInformationMessage(`Swagger file ${path.basename(swaggerFilePath)} has been deleted.`);
                vscode.commands.executeCommand(COMMANDS.REFRESH_COMMAND);
            }
        });
    }
}
