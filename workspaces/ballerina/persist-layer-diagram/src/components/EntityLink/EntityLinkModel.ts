/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CMCardinality as Cardinality } from '@wso2-enterprise/ballerina-core';
import { SharedLinkModel } from '../shared-link/shared-link';

interface LinkOrigins {
	nodeId: string;
	attributeId: string;
}

export class EntityLinkModel extends SharedLinkModel {
	readonly cardinality: Cardinality;
	sourceNode: LinkOrigins;
	targetNode: LinkOrigins;

	constructor(id: string, cardinality: Cardinality) {
		super(id, 'entityLink');
		this.cardinality = cardinality;
	}

	setSourceNode(nodeId: string, attributeId: string = '') {
		this.sourceNode = { nodeId, attributeId };
	}
	
	setTargetNode(nodeId: string, attributeId: string = '') {
		this.targetNode = { nodeId, attributeId };
	}
}
