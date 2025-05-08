/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TemplateDefinition } from "../models/template.model";
import { AIPanelPrompt, Command, TemplateId } from "@wso2-enterprise/ballerina-core/";

// All command templates are defined here.
export const commandTemplates = {
    [Command.Code]: [
        {
            id: TemplateId.Wildcard,
            text: '',
            placeholders: [],
        },
        {
            id: TemplateId.GenerateCode,
            text: 'generate code for the use-case: <usecase>',
            placeholders: [
                {
                    id: 'usecase',
                    text: '<usecase>',
                    multiline: true,
                }
            ],
        },
        {
            id: TemplateId.GenerateFromReadme,
            text: 'generate an integration according to the given Readme file',
            placeholders: [],
        },
    ],
    [Command.Tests]: [
        {
            id: TemplateId.TestsForService,
            text: 'generate tests for <servicename> service',
            placeholders: [
                {
                    id: 'servicename',
                    text: '<servicename>',
                    multiline: false,
                }
            ],
        },
        {
            id: TemplateId.TestsForFunction,
            text: 'generate tests for resource <method(space)path> function',
            placeholders: [
                {
                    id: 'methodPath',
                    text: '<method(space)path>',
                    multiline: false,
                }
            ],
        },
    ],
    [Command.DataMap]: [
        {
            id: TemplateId.MappingsForRecords,
            text: 'generate mappings using input as <recordname(s)> and output as <recordname> using the <functionname> function',
            placeholders: [
                {
                    id: 'inputRecords',
                    text: '<recordname(s)>',
                    multiline: false,
                },
                {
                    id: 'outputRecord',
                    text: '<recordname>',
                    multiline: false,
                },
                {
                    id: 'functionName',
                    text: '<functionname>',
                    multiline: false,
                },
            ],
        },
        {
            id: TemplateId.MappingsForFunction,
            text: 'generate mappings for the <functionname> function',
            placeholders: [
                {
                    id: 'functionName',
                    text: '<functionname>',
                    multiline: false,
                }
            ],
        },
    ],
    [Command.TypeCreator]: [
        {
            id: TemplateId.TypesForAttached,
            text: 'generate types using the attatched file',
            placeholders: []
        }
    ],
    [Command.Healthcare]: [
        {
            id: TemplateId.Wildcard,
            text: '',
            placeholders: [],
        },
    ],
    [Command.Ask]: [
        {
            id: TemplateId.Wildcard,
            text: '',
            placeholders: [],
        },
    ],
    [Command.NaturalProgramming]: [

    ],
    [Command.OpenAPI]: [
        {
            id: TemplateId.Wildcard,
            text: '',
            placeholders: [],
        },
    ],
} as const;

export type CommandTemplates = typeof commandTemplates;

// Natural Programming templates
export const NATURAL_PROGRAMMING_TEMPLATES: TemplateDefinition[] = [
    {
        id: TemplateId.CodeDocDriftCheck,
        text: 'Check drift between code and documentation',
        placeholders: [],
    },
    {
        id: TemplateId.GenerateCodeFromRequirements,
        text: 'Generate code based on the requirements',
        placeholders: [],
    },
    {
        id: TemplateId.GenerateTestFromRequirements,
        text: 'Generate tests against the requirements',
        placeholders: [],
    },
    {
        id: TemplateId.GenerateCodeFromFollowingRequirements,
        text: 'Generate code based on the following requirements: <requirements>',
        placeholders: [
            {
                id: 'requirements',
                text: '<requirements>',
                multiline: true,
            }
        ],
    },
];

// Suggested command templates are defined here.
export const suggestedCommandTemplates: AIPanelPrompt[] = [
    {
        type: 'command-template',
        command: Command.Code,
        templateId: TemplateId.Wildcard,
        text: 'write a hello world http service',
    },
    {
        type: 'command-template',
        command: Command.Ask,
        templateId: TemplateId.Wildcard,
        text: 'how to write a concurrent application?',
    },
];
