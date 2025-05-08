/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams';
import { EntityLinkModel } from './EntityLinkModel';
import { EntityLinkWidget } from './EntityLinkWidget';

export class EntityLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('entityLink');
	}

	generateModel(event: { initialConfig: any }): EntityLinkModel {
		return new EntityLinkModel(event.initialConfig.cardinality);
	}

	generateReactWidget(props: { model: EntityLinkModel }): JSX.Element {
		return <EntityLinkWidget link={props.model} engine={this.engine} />;
	}
}
