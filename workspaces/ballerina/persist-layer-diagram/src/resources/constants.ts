/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { DagreEngine } from '@projectstorm/react-diagrams-routing';

export const dagreEngine = new DagreEngine({
    graph: {
        rankdir: 'LR',
        ranksep: 175,
        edgesep: 20,
        nodesep: 20,
        ranker: 'longest-path',
        marginx: 40,
        marginy: 40
    }
});

export const NO_ENTITIES_DETECTED = 'Could not detect any entities in the Persist model.';
export const ERRONEOUS_MODEL = 'Please resolve the diagnostics to view the ER diagram.';
