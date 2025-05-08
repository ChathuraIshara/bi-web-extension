/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { window, Uri, commands, workspace } from "vscode";
import { existsSync, openSync, readFileSync, writeFile } from "fs";
import { BAL_TOML, BAL_CONFIG_FILE, PALETTE_COMMANDS, clearTerminal } from "../project";
import { BallerinaExtension, ballerinaExtInstance, ExtendedLangClient } from "../../core";
import { getCurrentBallerinaProject } from "../../utils/project-utils";
import { parseTomlToConfig, typeOfComment } from "./utils";
import { ConfigProperty, ConfigTypes, Constants, Property } from "./model";
import { BallerinaProject, PackageConfigSchema, ProjectDiagnosticsResponse, SyntaxTree } from "@wso2-enterprise/ballerina-core";
import { TextDocumentEdit } from "vscode-languageserver-types";
import { modifyFileContent } from "../../utils/modification";
import { fileURLToPath } from "url";
import { startDebugging } from "../editor-support/codelens-provider";

const UNUSED_IMPORT_ERR_CODE = "BCE2002";

export async function prepareAndGenerateConfig(ballerinaExtInstance: BallerinaExtension, filePath: string, isCommand?: boolean, isBi?: boolean, executeRun: boolean = true, includeOptional: boolean = false): Promise<void> {
    const configRequirement: ConfigRequirementResult = await checkConfigGenerationRequired(ballerinaExtInstance, filePath, isBi);

    if (!configRequirement.needsConfig) {
        if (!isCommand && executeRun) {
          //  executeRunCommand(ballerinaExtInstance, filePath, isBi);
        }
        return;
    }

    const { context, newValues, updatedContent } = configRequirement;
    if (!context || !newValues) {
        return;
    }

    const uri = Uri.file(context.configFilePath);
    const ignoreFile = `${context.projectPath}/.gitignore`;

    await handleNewValues(
        context,
        newValues,
        context.configFilePath,
        updatedContent,
        uri,
        ignoreFile,
        ballerinaExtInstance,
        isCommand,
        isBi,
        includeOptional
    );
}

export async function checkConfigGenerationRequired(ballerinaExtInstance: BallerinaExtension, filePath: string, isBi?: boolean): Promise<ConfigRequirementResult> {
    // Return early if config file is provided
    if (filePath && filePath.toString().endsWith(BAL_CONFIG_FILE)) {
        return { needsConfig: false };
    }

    // Get current project
    const currentProject: BallerinaProject | undefined = isBi
        ? await getCurrentBIProject(filePath)
        : await getCurrentBallerinaProjectFromContext(ballerinaExtInstance);

    if (!currentProject) {
        return { needsConfig: false };
    }

    ballerinaExtInstance.getDocumentContext().setCurrentProject(currentProject);

    // TODO: How to pass config values to single files
    if (currentProject.kind === 'SINGLE_FILE_PROJECT') {
        return { needsConfig: false };
    }

    const context: ConfigGenerationContext = {
        orgName: currentProject.orgName!,
        packageName: currentProject.packageName!,
        projectPath: currentProject.path,
        configFilePath: `${currentProject.path}/${BAL_CONFIG_FILE}`
    };

    // Get config schema
    try {
        const response = await ballerinaExtInstance.langClient?.getBallerinaProjectConfigSchema({
            documentIdentifier: {
                uri: Uri.file(`${currentProject.path}/${BAL_TOML}`).toString()
            }
        });

        if (response && 'configSchema' in response) {
            context.configSchema = response as PackageConfigSchema;
        } else {
            return { needsConfig: false };
        }

        if (!context.configSchema?.configSchema || Object.keys(context.configSchema.configSchema.properties).length === 0) {
            return { needsConfig: false };
        }

        // Process all configuration sections including imported modules
        const allProps = context.configSchema.configSchema.properties;
        const newValues: ConfigProperty[] = [];
        let updatedContent = '';
        let existingConfigs = {};

        // Check existing configs
        if (existsSync(context.configFilePath)) {
            const tomlContent: string = readFileSync(Uri.file(context.configFilePath).fsPath, 'utf8');
            existingConfigs = parseTomlToConfig(tomlContent);
            context.existingConfigs = existingConfigs;
            updatedContent = tomlContent + '\n';
        }

        let requiredConfigsFound = false;

        // Process each root organization (ballerina, ballerinax, etc.)
        const allOrgs: string[] = Object.keys(allProps);
        for (const orgKey of allOrgs) {
            const orgProps = allProps[orgKey].properties;

            // Process each package within the organization
            for (const pkgKey of Object.keys(orgProps)) {
                const pkgConfig = orgProps[pkgKey];

                // Skip if there are no required properties
                if (!pkgConfig.required || pkgConfig.required.length === 0) {
                    continue;
                }

                // Get existing configs for this path if available
                const existingModuleConfigs = getExistingConfigsForPath(context, existingConfigs, allOrgs, orgKey, pkgKey);

                // Find missing required configs
                const moduleNewValues: ConfigProperty[] = [];
                findPropertyValues(pkgConfig, moduleNewValues, existingModuleConfigs);

                // Add to our collection with organization prefix
                if (moduleNewValues.length > 0) {
                    moduleNewValues.forEach(value => {
                        value.orgKey = orgKey;
                        value.pkgKey = pkgKey;
                    });
                    newValues.push(...moduleNewValues);

                    // Check if we have any required configs
                    if (moduleNewValues.some(v => v.required)) {
                        requiredConfigsFound = true;
                    }
                }
            }
        }

        return {
            needsConfig: newValues.length > 0 && requiredConfigsFound,
            context,
            newValues,
            updatedContent
        };

    } catch (error) {
        console.error('Error while checking config generation requirement:', error);
        return { needsConfig: false };
    }
}

// Helper function to navigate nested toml structure and get existing configs
function getExistingConfigsForPath(context: ConfigGenerationContext, existingConfigs: any, allOrgs: string[], orgKey: string, pkgKey: string): any {
    if (!existingConfigs) {
        return {};
    }

    // For the default module, return root level configs
    if (!existingConfigs[orgKey] && orgKey == context.orgName && pkgKey == context.packageName) {
        const rootLevelConfigs = {};
        for (const key in existingConfigs) {
            if (!allOrgs.includes(key)) {
                rootLevelConfigs[key] = existingConfigs[key];
            }
        }

        if (Object.keys(rootLevelConfigs).length > 0) {
            return rootLevelConfigs;
        }
    }

    // Try as a dotted key
    const dottedKey = `${orgKey}.${pkgKey}`;
    if (existingConfigs[dottedKey]) {
        return existingConfigs[dottedKey];
    }

    // Handle case where pkgKey itself contains dots
    let currentObj = existingConfigs[orgKey];
    if (currentObj) {
        // Split the pkgKey by dots to navigate nested structure
        const pkgParts = pkgKey.split('.');

        // Traverse the object structure following the path
        for (const part of pkgParts) {
            if (currentObj && currentObj[part]) {
                currentObj = currentObj[part];
            } else {
                currentObj = undefined;
                break;
            }
        }

        if (currentObj) {
            return currentObj;
        }
    }

    // check if there's a direct property match 
    if (existingConfigs[orgKey] && existingConfigs[orgKey][pkgKey]) {
        return existingConfigs[orgKey][pkgKey];
    }

    return {};
}

export function findPropertyValues(configs: Property, newValues: ConfigProperty[], obj?: any, skipAnyOf?: boolean): void {
    const properties = configs.properties;
    const requiredKeys = configs.required || [];

    for (let propertyKey in properties) {
        if (properties.hasOwnProperty(propertyKey)) {
            const property: Property = properties[propertyKey];
            const isRequired = requiredKeys.includes(propertyKey);
            if (!isRequired && property.required && property.required.length > 0) {
                findPropertyValues(property, newValues, obj);
            } else {
                const valueExists = obj ? (propertyKey in obj) : false;
                const anyOfValue = skipAnyOf && Constants.ANY_OF in property;
                if ((anyOfValue && valueExists) || !valueExists) {
                    newValues.push({
                        name: propertyKey,
                        type: property.type,
                        property,
                        required: isRequired
                    });
                }
            }
        }
    }
}

export async function getCurrentBallerinaProjectFromContext(ballerinaExtInstance: BallerinaExtension): Promise<BallerinaProject | undefined> {
    let currentProject: BallerinaProject = {};

    if (window.activeTextEditor) {
        currentProject = await getCurrentBallerinaProject();
    } else {
        const document = ballerinaExtInstance.getDocumentContext().getLatestDocument();
        if (document) {
            currentProject = await getCurrentBallerinaProject(document.fsPath);
        }
    }
    return currentProject;
}

export async function getCurrentBIProject(projectPath: string): Promise<BallerinaProject | undefined> {
    let currentProject: BallerinaProject = {};
    currentProject = await getCurrentBallerinaProject(projectPath);
    return currentProject;
}

export async function handleNewValues(context: ConfigGenerationContext, newValues: ConfigProperty[], configFile: string, updatedContent: string, uri: Uri, ignoreFile: string, ballerinaExtInstance: BallerinaExtension, isCommand: boolean, isBi: boolean, includeOptional: boolean): Promise<void> {
    let result;
    let btnTitle: string;
    let message: string;

    if (!existsSync(configFile)) {
        message = 'Missing Config.toml file';
        btnTitle = 'Create Config.toml';
    } else {
        message = 'Missing required configurations in Config.toml file';
        btnTitle = 'Update Config.toml';
    }

    const openConfigButton = { title: btnTitle };
    const ignoreButton = { title: 'Run Anyway' };
    const details = "It is recommended to create/update the Config.toml with all mandatory configuration values before running the program.";

    if (!isCommand) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        result = await window.showInformationMessage(message, { detail: details, modal: true }, openConfigButton, ignoreButton);
    }

    const docLink = "https://ballerina.io/learn/provide-values-to-configurable-variables/#provide-via-toml-syntax";
    if (isCommand || result === openConfigButton) {
        if (!existsSync(configFile)) {
            openSync(configFile, 'w');
            updatedContent = `
# Configuration file for "${context.packageName}"
# 
# This file contains configuration values for configurable variables in your Ballerina code.
# Both package-specific and imported module configurations are included below.
# 
# Learn more about configurable variables:
# ${docLink}
#
# Note: This file is automatically added to .gitignore to protect sensitive information. ${updatedContent}

`;
            if (existsSync(ignoreFile)) {
                const ignoreUri = Uri.file(ignoreFile);
                let ignoreContent: string = readFileSync(ignoreUri.fsPath, 'utf8');
                if (!ignoreContent.includes(BAL_CONFIG_FILE)) {
                    ignoreContent += `\n${BAL_CONFIG_FILE}\n`;
                    writeFile(ignoreUri.fsPath, ignoreContent, function (error) {
                        if (error) {
                            return window.showErrorMessage('Unable to update the .gitIgnore file: ' + error);
                        }
                        window.showInformationMessage('Successfully updated the .gitIgnore file.');
                    });
                }
            }
        }

        const groupedValues = groupConfigsByModule(newValues);
        updateConfigTomlByModule(context, groupedValues, updatedContent, uri.fsPath, includeOptional);

        await workspace.openTextDocument(uri).then(async document => {
            window.showTextDocument(document, { preview: false });
        });
    } else if (!isCommand && result === ignoreButton) {
      //  executeRunCommand(ballerinaExtInstance, configFile, isBi);
    }
}

// Function to group config properties by module
function groupConfigsByModule(configProperties: ConfigProperty[]): Map<string, Map<string, ConfigProperty[]>> {
    const result = new Map<string, Map<string, ConfigProperty[]>>();

    for (const prop of configProperties) {
        const orgKey = prop.orgKey || '';
        const pkgKey = prop.pkgKey || '';

        if (!result.has(orgKey)) {
            result.set(orgKey, new Map<string, ConfigProperty[]>());
        }

        const orgMap = result.get(orgKey)!;
        if (!orgMap.has(pkgKey)) {
            orgMap.set(pkgKey, []);
        }

        orgMap.get(pkgKey)!.push(prop);
    }

    return result;
}


function updateConfigTomlByModule(context: ConfigGenerationContext, groupedValues: Map<string, Map<string, ConfigProperty[]>>, updatedContent: string, configPath: string, includeOptional: boolean): void {
    const allOrgs = Array.from(groupedValues.keys());
    const defaultOrgKey = context.orgName;
    let configObject = context.existingConfigs ? JSON.parse(JSON.stringify(context.existingConfigs)) : {};

    // Process default module first (properties at root level)
    if (groupedValues.has(defaultOrgKey)) {
        const defaultModuleMap = groupedValues.get(defaultOrgKey)!;
        if (defaultModuleMap.has(context.packageName)) {
            const props = defaultModuleMap.get(context.packageName)!;

            // Add the default module properties to the root of the config object
            for (const prop of props) {
                if (propertyExistsInConfig(configObject, prop.name)) {
                    continue;
                }

                if (prop.required || includeOptional) {
                    configObject[prop.name] = getDefaultValueForConfig(prop.property);
                }
            }
        }
    }

    // Process non-default modules (properties in sections)
    for (const orgKey of allOrgs) {
        if (orgKey === defaultOrgKey) {
            continue;
        }

        const orgMap = groupedValues.get(orgKey)!;
        for (const pkgKey of Array.from(orgMap.keys()).sort()) {
            const sectionKey = `${orgKey}.${pkgKey}`;
            const props = orgMap.get(pkgKey)!;
            if (props.length === 0) {
                continue;
            }

            // Check for nested format (e.g. orgKey: { pkgKey: {...} })
            let sectionExists = false;
            let sectionObject = null;
            if (configObject[orgKey]) {
                // Check multiple nesting levels if the package name is hierarchical
                const pkgParts = pkgKey.split('.');
                let current = configObject[orgKey];
                let found = true;

                for (const part of pkgParts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found) {
                    sectionExists = true;
                    sectionObject = current;
                }
            }

            // Create section if it doesn't exist
            if (!sectionExists) {
                configObject[sectionKey] = {};
                sectionObject = configObject[sectionKey];
            }

            // Add properties to the section
            for (const prop of props) {
                if (propertyExistsInSection(sectionObject, prop.name)) {
                    continue;
                }

                if (prop.required || includeOptional) {
                    sectionObject[prop.name] = getDefaultValueForConfig(prop.property);
                }
            }
            configObject[sectionKey] = sectionObject;
        }
    }

    // Convert the config object back to TOML
    let newTomlContent = convertConfigToToml(configObject, groupedValues);

    // Preserve header content, if present
    let headerMatch = updatedContent.match(/^([\s\S]*?)\n\s*([a-zA-Z]|$|\[)/);
    let header = '';
    if (headerMatch && headerMatch[1]) {
        header = headerMatch[1] + '\n\n';
    }

    // Write the updated TOML content to file
    writeFile(configPath, header + newTomlContent, function (error) {
        if (error) {
            return window.showErrorMessage("Unable to update the configurable values: " + error);
        }
        window.showInformationMessage("Successfully updated the configurable values.");
    });
}

/**
 * Helper to get default value for a config property.
 */
function getDefaultValueForConfig(property: Property): any {
    if (!property || !property.type) {
        return "";
    }

    switch (property.type) {
        case ConfigTypes.BOOLEAN:
            return false;
        case ConfigTypes.INTEGER:
            return { type: ConfigTypes.INTEGER, value: 0 };
        case ConfigTypes.NUMBER:
            return { type: ConfigTypes.NUMBER, value: 0.0 };
        case ConfigTypes.STRING:
            return "";
        case ConfigTypes.ARRAY:
            return [];
        case ConfigTypes.OBJECT:
            if (property.properties) {
                const obj = {};
                if (property.required && property.required.length > 0) {
                    for (const key of property.required) {
                        if (property.properties[key]) {
                            obj[key] = getDefaultValueForConfig(property.properties[key]);
                        }
                    }
                }
                return obj;
            }
            return {};
        default:
            if (Constants.ANY_OF in property) {
                const anyType: Property = property.anyOf[0];
                return getDefaultValueForConfig(anyType);
            }
            return "";
    }
}

/** 
 * Helper to convert config object to TOML string.
 */
function convertConfigToToml(config: any, groupedValues: Map<string, Map<string, ConfigProperty[]>>): string {
    let result = '';
    const rootProps = Object.keys(config).filter(key =>
        !key.includes('.')
    );

    for (const key of rootProps) {
        const value = config[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Check if this is a nested module structure or a regular object property
            const isNestedModule = Object.values(value).some(v =>
                typeof v === 'object' && v !== null && !Array.isArray(v) &&
                Object.keys(v).length > 0
            );

            if (!isNestedModule) {
                result += `${key} = ${formatTomlValue(value)}\n`;
            }
        } else {
            // Handle primitive values and arrays
            result += `${key} = ${formatTomlValue(value)}\n`;
        }
    }
    if (rootProps.length > 0) {
        result += '\n';
    }

    // collect all existing sections
    const existingDottedSections = new Set(
        Object.keys(config).filter(key => key.includes('.'))
    );

    // Process nested objects that need to be converted to proper sections
    const nestedOrgKeys = Object.keys(config).filter(key =>
        !key.includes('.') &&
        typeof config[key] === 'object' &&
        config[key] !== null &&
        !Array.isArray(config[key])
    );

    // Use groupedValues to generate sections in the correct format
    for (const [orgName, packageMap] of groupedValues) {
        for (const [pkgName, _] of packageMap) {
            const sectionKey = `${orgName}.${pkgName}`;
            if (existingDottedSections.has(sectionKey)) {
                continue;
            }

            let sectionContent = {};
            let sectionExists = false;
            if (config[orgName]) {
                const pkgParts = pkgName.split('.');
                let current = config[orgName];
                let found = true;
                for (const part of pkgParts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found && current && typeof current === 'object') {
                    sectionContent = current;
                    sectionExists = true;
                }
            }

            // If section exists in nested format, add it to result
            if (sectionExists) {
                result += `[${sectionKey}]\n`;
                for (const propKey of Object.keys(sectionContent)) {
                    result += `${propKey} = ${formatTomlValue(sectionContent[propKey])}\n`;
                }
                result += '\n';
            }
        }
    }

    // Process existing module configs
    for (const sectionKey of Array.from(existingDottedSections).sort()) {
        result += `[${sectionKey}]\n`;
        const sectionObj = config[sectionKey];

        for (const propKey of Object.keys(sectionObj)) {
            result += `${propKey} = ${formatTomlValue(sectionObj[propKey])}\n`;
        }
        result += '\n';
    }

    // Process new module configs
    for (const orgKey of nestedOrgKeys) {
        if (groupedValues.has(orgKey)) {
            continue;
        }

        const orgObj = config[orgKey];
        for (const pkgKey of Object.keys(orgObj).sort()) {
            const pkgObj = orgObj[pkgKey];

            if (typeof pkgObj !== 'object' || pkgObj === null || Array.isArray(pkgObj)) {
                continue;
            }

            const sectionKey = `${orgKey}.${pkgKey}`;
            result += `[${sectionKey}]\n`;

            for (const propKey of Object.keys(pkgObj)) {
                result += `${propKey} = ${formatTomlValue(pkgObj[propKey])}\n`;
            }
            result += '\n';
        }
    }

    return result;
}

/**
 *  Helper to format values for TOML.
 */
function formatTomlValue(value: any): string {
    if (value === null || value === undefined) {
        return '""';
    } else if (typeof value === 'object' && 'type' in value && 'value' in value) {
        if (value.type === ConfigTypes.NUMBER) {
            return value.value.toFixed(1); // Ensure it has a decimal point
        } else if (value.type === ConfigTypes.INTEGER) {
            return String(value.value);
        }
    } else if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    } else if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]';
        }
        const items = value.map(item => formatTomlValue(item));
        return `[${items.join(', ')}]`;
    } else if (typeof value === 'object') {
        if (Object.keys(value).length === 0) {
            return '{}';
        }
        const entries = Object.entries(value).map(([k, v]) => `${k} = ${formatTomlValue(v)}`);
        return `{ ${entries.join(', ')} }`;
    }

    return '""';
}

/**
 * Helper to check if a property exists at the root level of config object.
 */
function propertyExistsInConfig(configObject: any, propertyName: string): boolean {
    if (!configObject) {
        return false;
    }
    // Direct match
    if (propertyName in configObject) {
        return true;
    }

    // Check if property exists in a dotted path
    if (propertyName.includes('.')) {
        const parts = propertyName.split('.');
        let current = configObject;

        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Helper to check if a property exists in a section.
 */
function propertyExistsInSection(sectionObject: any, propertyName: string): boolean {
    if (!sectionObject) {
        return false;
    }
    // Direct match
    if (propertyName in sectionObject) {
        return true;
    }

    // Check if property exists in a dotted path
    if (propertyName.includes('.')) {
        const parts = propertyName.split('.');
        let current = sectionObject;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
}

// async function executeRunCommand(ballerinaExtInstance: BallerinaExtension, filePath: string, isBi?: boolean) {
//     if (ballerinaExtInstance.enabledRunFast() || isBi) {
//         const projectHasErrors = await cleanAndValidateProject(ballerinaExtInstance.langClient, filePath);
//         if (projectHasErrors) {
//             window.showErrorMessage("Project contains errors. Please fix them and try again.");
//         } else {
//             clearTerminal();
//             await startDebugging(Uri.file(filePath), false, true, true);
//         }
//     } else {
//         commands.executeCommand(PALETTE_COMMANDS.RUN_CMD);
//     }
// }

export async function cleanAndValidateProject(langClient: ExtendedLangClient, path: string): Promise<boolean> {
    try {
        // Get initial project diagnostics
        const projectPath = ballerinaExtInstance?.getDocumentContext()?.getCurrentProject()?.path || path;
        let response: ProjectDiagnosticsResponse = await langClient.getProjectDiagnostics({
            projectRootIdentifier: {
                uri: Uri.file(projectPath).toString()
            }
        });

        if (!response.errorDiagnosticMap || Object.keys(response.errorDiagnosticMap).length === 0) {
            return false;
        }

        // Process each file with diagnostics
        for (const [filePath, diagnostics] of Object.entries(response.errorDiagnosticMap)) {
            // Filter the unused import diagnostics
            const diagnostic = diagnostics.find(d => d.code === UNUSED_IMPORT_ERR_CODE);
            if (!diagnostic) {
                continue;
            }
            const codeActions = await langClient.codeAction({
                textDocument: { uri: filePath },
                range: {
                    start: diagnostic.range.start,
                    end: diagnostic.range.end
                },
                context: { diagnostics: [diagnostic] }
            });

            // Find and apply the appropriate code action
            const action = codeActions.find(action => action.title === "Remove all unused imports");
            if (!action?.edit?.documentChanges?.length) {
                continue;
            }
            const docEdit = action.edit.documentChanges[0] as TextDocumentEdit;

            // Apply modifications to syntax tree
            const syntaxTree = await langClient.stModify({
                documentIdentifier: { uri: docEdit.textDocument.uri },
                astModifications: docEdit.edits.map(edit => ({
                    startLine: edit.range.start.line,
                    startColumn: edit.range.start.character,
                    endLine: edit.range.end.line,
                    endColumn: edit.range.end.character,
                    type: "INSERT",
                    isImport: true,
                    config: { STATEMENT: edit.newText }
                }))
            });

            // Update file content
            const { source } = syntaxTree as SyntaxTree;
            const absolutePath = fileURLToPath(filePath);
            await modifyFileContent({ filePath: absolutePath, content: source });
        }

        // Check if errors still exist after fixes
        const updatedResponse: ProjectDiagnosticsResponse = await langClient.getProjectDiagnostics({
            projectRootIdentifier: {
                uri: Uri.file(projectPath).toString()
            }
        });

        return updatedResponse.errorDiagnosticMap && updatedResponse.errorDiagnosticMap.size > 0;
    } catch (error) {
        return true;
    }
}

export function getConfigValue(name: string, obj: Property, comment: { value: string }): string {
    let newConfigValue = '';
    switch (obj.type) {
        case ConfigTypes.BOOLEAN:
            newConfigValue = `${name} = false\t`;
            break;
        case ConfigTypes.INTEGER:
            newConfigValue = `${name} = 0\t`;
            break;
        case ConfigTypes.NUMBER:
            newConfigValue = `${name} = 0.0\t`;
            break;
        case ConfigTypes.STRING:
            newConfigValue = `${name} = ""\t`;
            break;
        case ConfigTypes.ARRAY:
            newConfigValue = getArrayConfigValue(comment, name, obj);
            break;
        case ConfigTypes.OBJECT:
            // Use inline object format for nested objects
            newConfigValue = getInlineObjectConfigValue(name, obj);
            comment.value = `# ${typeOfComment} ${ConfigTypes.OBJECT.toUpperCase()}`;
            break;
        default:
            if (Constants.ANY_OF in obj) {
                const anyType: Property = obj.anyOf[0];
                if (anyType.type === ConfigTypes.INTEGER || anyType.type === ConfigTypes.NUMBER) {
                    comment.value = `# ${typeOfComment} ${ConfigTypes.NUMBER.toUpperCase()}`;
                    newConfigValue = `${name} = 0\t`;
                } else if (anyType.type === ConfigTypes.STRING) {
                    newConfigValue = `${name} = ""\t`;
                } else if (anyType.type === ConfigTypes.OBJECT) {
                    // For other objects, use inline format
                    newConfigValue = getInlineObjectConfigValue(name, anyType);
                    comment.value = `# ${typeOfComment} ${ConfigTypes.OBJECT.toUpperCase()}`;
                } else {
                    newConfigValue = `${name} = ""\t`;
                }
            } else {
                newConfigValue = `${name} = ""\t`;
            }
            break;
    }
    return newConfigValue;
}

/**
 * Generate an inline TOML object format for nested objects
 */
function getInlineObjectConfigValue(name: string, property: Property): string {
    if (!property || !property.properties) {
        return `${name} = {}\t`;
    }

    let configValue = `${name} = { `;
    const parts: string[] = [];

    // Add required properties if any
    if (property.required && property.required.length > 0) {
        for (const requiredKey of property.required) {
            if (property.properties[requiredKey]) {
                const propValue = getDefaultValueForType(property.properties[requiredKey]);
                parts.push(`${requiredKey} = ${propValue}`);
            }
        }
    } else {
        const propertyKeys = Object.keys(property.properties);
        const keysToInclude = propertyKeys.slice(0, Math.min(3, propertyKeys.length));

        for (const key of keysToInclude) {
            const propValue = getDefaultValueForType(property.properties[key]);
            parts.push(`${key} = ${propValue}`);
        }
    }

    configValue += parts.join(", ");
    configValue += " }\t";
    return configValue;
}

/**
 * Get default value string for different property types
 */
function getDefaultValueForType(property: Property): string {
    if (!property || !property.type) {
        return '""';
    }

    switch (property.type) {
        case ConfigTypes.INTEGER:
            return "0";
        case ConfigTypes.NUMBER:
            return "0.0";
        case ConfigTypes.BOOLEAN:
            return "false";
        case ConfigTypes.OBJECT:
            return "{}";
        case ConfigTypes.ARRAY:
            return "[]";
        case ConfigTypes.STRING:
        default:
            return '""';
    }
}

function getArrayConfigValue(comment: { value: string }, name: string, item: Property): string {
    let newConfigValue = '';
    switch (item.items?.type) {
        case ConfigTypes.BOOLEAN:
            comment.value = ``;
            newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.BOOLEAN.toUpperCase()} array\n`;
            break;
        case ConfigTypes.INTEGER:
            comment.value = ``;
            newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.INTEGER.toUpperCase()} array\n`;
            break;
        case ConfigTypes.NUMBER:
            comment.value = ``;
            newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.NUMBER.toUpperCase()} array\n`;
            break;
        case ConfigTypes.STRING:
            comment.value = ``;
            newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.STRING.toUpperCase()} array\n`;
            break;
        case ConfigTypes.OBJECT:
            comment.value = ``;
            if (item.items.additionalProperties && item.items.additionalProperties.type === ConfigTypes.STRING) {
                // For arrays of map-like objects
                newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.OBJECT.toUpperCase()} array\n`;
            } else if (item.items.properties) {
                // For arrays of structured objects
                newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.OBJECT.toUpperCase()} array\n`;
            } else {
                newConfigValue = `${name} = []\t# ${typeOfComment} ${ConfigTypes.OBJECT.toUpperCase()} array\n`;
            }
            break;
        case ConfigTypes.ARRAY:
            comment.value = `# ${typeOfComment} ${ConfigTypes.ARRAY.toUpperCase()} of array\n`;
            newConfigValue = `${name} = []\t# ${typeOfComment} Nested array\n`;
            break;
        default:
            newConfigValue = `${name} = []\t# ${typeOfComment} Array\n`;
            break;
    }
    return newConfigValue;
}

function getObjectConfigValue(comment: { value: string }, name: string, property: Property, parentObject?: string): string {
    let newConfigValue = `[${name}]\t# ${typeOfComment} ${ConfigTypes.OBJECT.toUpperCase()}\n`;
    comment.value = ``;
    if (parentObject) {
        newConfigValue = ``;
    }

    if (property && property.required?.length > 0) {
        property.required.forEach(val => {
            const obj: Property = property.properties[val];
            let propertyValue = '';
            // TODO: Following code block gives errors when parsing the toml file due to the dotted object notations. Find a better parser for toml
            // if (parentObject) {
            //     val = `${parentObject}.${val}`;
            // }
            switch (obj.type) {
                case ConfigTypes.INTEGER:
                    propertyValue = `${val} = 0\n`;
                    break;
                case ConfigTypes.STRING:
                    propertyValue = `${val} = ""\n`;
                    break;
                case ConfigTypes.NUMBER:
                    propertyValue = `${val} = 0.0\n`;
                    break;
                case ConfigTypes.ARRAY:
                    propertyValue = getArrayConfigValue(comment, name, obj);
                    break;
                case ConfigTypes.OBJECT:
                    propertyValue = getObjectConfigValue(comment, name, obj, val);
                    break;
                default:
                    propertyValue = `${val} = ""\n`;
                    break;
            }
            newConfigValue += propertyValue;
        });
    }
    return newConfigValue;
}

export interface ConfigGenerationContext {
    orgName: string;
    packageName: string;
    projectPath: string;
    configFilePath: string;
    configSchema?: PackageConfigSchema;
    existingConfigs?: object;
}

export interface ConfigRequirementResult {
    needsConfig: boolean;
    context?: ConfigGenerationContext;
    newValues?: ConfigProperty[];
    updatedContent?: string;
}
