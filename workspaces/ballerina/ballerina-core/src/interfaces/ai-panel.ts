/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum Command {
    Code = '/code',
    Tests = '/tests',
    DataMap = '/datamap',
    TypeCreator = '/typecreator',
    Healthcare = '/healthcare',
    Ask = '/ask',
    NaturalProgramming = '/natural-programming (experimental)',
    OpenAPI = '/openapi',
}

export enum TemplateId {
    // Shared
    Wildcard = 'wildcard',

    // Command.Code
    GenerateCode = 'generate-code',
    GenerateFromReadme = 'generate-from-readme',

    // Command.Tests
    TestsForService = 'tests-for-service',
    TestsForFunction = 'tests-for-function',

    // Command.DataMap
    MappingsForRecords = 'mappings-for-records',
    MappingsForFunction = 'mappings-for-function',

    // Command.TypeCreator
    TypesForAttached = 'types-for-attached',

    // Command.NaturalProgramming
    CodeDocDriftCheck = 'code-doc-drift-check',
    GenerateCodeFromRequirements = 'generate-code-from-requirements',
    GenerateTestFromRequirements = 'generate-test-from-requirements',
    GenerateCodeFromFollowingRequirements = 'generate-code-from-following-requirements',
}
