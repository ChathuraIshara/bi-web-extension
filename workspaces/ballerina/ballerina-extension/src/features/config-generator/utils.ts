/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { debug } from "../../utils/logger";
import toml from "toml";
import { CompletionItem, CompletionItemKind, Position, TextDocument, Uri } from "vscode";
import { BallerinaExtension } from "../../core";
import { findPropertyValues, getConfigValue, getCurrentBallerinaProjectFromContext } from "./configGenerator";
import { ConfigProperty, Constants, Property } from "./model";
import { BallerinaProject, PackageConfigSchema } from "@wso2-enterprise/ballerina-core";


export const typeOfComment = 'Type of';

/**
 * Convert the TOML content into JSON object.
 * @param tomlContent The TOML content as a string value.
 */
export function parseTomlToConfig(tomlContent: string): object {
    try {
        return toml.parse(tomlContent);
    } catch (error) {
        debug("Error while parsing the Config.toml file content: " + error);
    }
    return {};
}

/**
 * Use the TOML content to create a JSON accepted by the configurable editor for existing values.
 * @param tomlContent The TOML content as a JSON value.
 */
export function generateExistingValues(tomlContent: object, orgName: string, packageName: string): object {
    return {
        [orgName]: {
            [packageName]: tomlContent
        }
    };
}

export async function getConfigCompletions(ballerinaExtInstance: BallerinaExtension, filePath: string, document: TextDocument, position: Position): Promise<CompletionItem[]> {
    const suggestions: CompletionItem[] = [];
    const isConfigToml = document.fileName.includes("Config.toml");

    if (!isConfigToml) {
        return suggestions;
    }

    const currentProject: BallerinaProject | undefined = await getCurrentBallerinaProjectFromContext(ballerinaExtInstance);
    const newValues: ConfigProperty[] = [];
    ballerinaExtInstance.getDocumentContext().setCurrentProject(currentProject);

    try {
        const response = await ballerinaExtInstance.langClient?.getBallerinaProjectConfigSchema({
            documentIdentifier: {
                uri: Uri.file(filePath).toString()
            }
        });

        const data = response as PackageConfigSchema;
        const configSchema = data.configSchema;
        const props: object = configSchema.properties;
        const firstKey = Object.keys(props)[0];
        const orgName = props[firstKey].properties;
        const packageName = currentProject.packageName;
        const configs: Property = orgName[packageName];

        const tomlContent = document.getText();
        const existingConfigs: object = generateExistingValues(parseTomlToConfig(tomlContent), orgName, packageName);
        const obj = existingConfigs['[object Object]'][packageName];
        const objKeysLength = Object.keys(obj).length;
        const tomlContentLength = tomlContent.length;

        if (objKeysLength > 0 || tomlContentLength > 0) {
            findPropertyValues(configs, newValues, obj, true);
        } else {
            findPropertyValues(configs, newValues);
        }

        newValues.forEach(obj => {
            if (obj.required) {
                let comment = { value: `# ${typeOfComment} ${obj.type && obj.type.toUpperCase() || "STRING"}` };
                let newConfigValue = getConfigValue(obj.name, obj.property, comment);
                let notAnyOf = true;

                if (tomlContentLength > 1 && Constants.ANY_OF in obj.property && tomlContent.includes(obj.name)) {
                    const unionConfig = document.lineAt(position.line - 1).text;
                    notAnyOf = false;
                    if (unionConfig.includes(obj.name)) {
                        suggestions.length = 0;
                        const anyOfData: any = obj.property.anyOf;
                        anyOfData.forEach((value: Property) => {
                            newConfigValue = getConfigValue(obj.name, value, comment);
                            const lines = newConfigValue.split('\n').slice(1);
                            const modifiedString = lines.join('\n');
                            suggestions.push({
                                label: value.name,
                                insertText: modifiedString,
                                kind: CompletionItemKind.Field
                            });
                        });
                    }
                }

                if (notAnyOf) {
                    suggestions.push({
                        label: obj.name,
                        insertText: newConfigValue + comment.value,
                        kind: CompletionItemKind.Field
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error while fetching config schema', error);
    }

    return suggestions;
}
