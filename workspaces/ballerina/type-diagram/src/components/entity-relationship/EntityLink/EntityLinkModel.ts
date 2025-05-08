/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CMCardinality as Cardinality } from '@wso2-enterprise/ballerina-core';
import { SharedLinkModel } from '../../common/shared-link/shared-link';

export class EntityLinkModel extends SharedLinkModel {
	readonly cardinality: Cardinality;
	readonly testId: string;

	constructor(cardinality?: Cardinality, testId?: string) {
		super('entityLink');

		this.cardinality = cardinality;
		this.testId = testId;
	}
}
