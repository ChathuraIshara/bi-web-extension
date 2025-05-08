/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Command } from '@wso2-enterprise/ballerina-core';
import { Tag } from '../models/tag.model';
import { commandTemplates } from './commandTemplates.const';

type CommandTemplates = typeof commandTemplates;

export type PlaceholderTagMap = {
    [C in keyof CommandTemplates]: {
        [T in CommandTemplates[C][number]['id']]: {
            [P in Extract<CommandTemplates[C][number], { id: T }>['placeholders'][number]['id']]: Tag[];
        };
    };
};

// NOTE: if the placeholders are known at compiletime, define here, otherwise inject at runtime.
export const placeholderTags: PlaceholderTagMap = {
    [Command.Code]: {
        'wildcard': {},
        'generate-code': {
            usecase: [],
        },
        'generate-from-readme': {},
    },
    [Command.Tests]: {
        'tests-for-service': {
            servicename: [],
        },
        'tests-for-function': {
            methodPath: [],
        },
    },
    [Command.DataMap]: {
        'mappings-for-records': {
            inputRecords: [],
            outputRecord: [],
            functionName: [],
        },
        'mappings-for-function': {
            functionName: []
        }
    },
    [Command.TypeCreator]: {
        'types-for-attached': {}
    },
    [Command.Healthcare]: {
        'wildcard': {},
    },
    [Command.Ask]: {
        'wildcard': {},
    },
    [Command.NaturalProgramming]: {
    },
    [Command.OpenAPI]: {
        'wildcard': {},
    },
};
