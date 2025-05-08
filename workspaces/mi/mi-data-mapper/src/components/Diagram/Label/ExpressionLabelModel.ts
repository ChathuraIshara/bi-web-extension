/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import { LabelModel } from '@projectstorm/react-diagrams';
import { Node } from "ts-morph";

import { IDataMapperContext } from '../../../utils/DataMapperContext/DataMapperContext';
import { DataMapperLinkModel } from '../Link';
import { InputOutputPortModel, MappingType } from '../Port';

export interface ExpressionLabelOptions extends BaseModelOptions {
	value?: string;
	valueNode?: Node;
	context?: IDataMapperContext;
	link?: DataMapperLinkModel;
	field?: Node;
	editorLabel?: string;
	isSubLinkLabel?: boolean;
	deleteLink?: () => void;
}

export class ExpressionLabelModel extends LabelModel {
	value?: string;
	valueNode?: Node;
	context: IDataMapperContext;
	link?: DataMapperLinkModel;
	field?: Node;
	editorLabel?: string;
	pendingMappingType?: MappingType;
	isSubLinkLabel?: boolean;
	deleteLink?: () => void;

	constructor(options: ExpressionLabelOptions = {}) {
		super({
			...options,
			type: 'expression-label'
		});
		this.value = options.value || '';
		this.valueNode = options.valueNode;
		this.context = options.context;
		this.link = options.link;
		this.field = options.field;
		this.editorLabel = options.editorLabel;
		this.isSubLinkLabel = options.isSubLinkLabel;
		this.updateSource = this.updateSource.bind(this);
		this.deleteLink = options.deleteLink;
	}

	serialize() {
		return {
			...super.serialize(),
			value: this.value
		};
	}

	deserialize(event: DeserializeEvent<this>): void {
		super.deserialize(event);
		this.value = event.data.value;
	}

	updateSource(): void {
		// TODO: Implement update source logic
	}

	setPendingMappingType(mappingType: MappingType): void {
		const sourcePort = this.link?.getSourcePort();
		const targetPort = this.link?.getTargetPort();

		this.pendingMappingType = mappingType;

		if (sourcePort instanceof InputOutputPortModel && targetPort instanceof InputOutputPortModel) {
			sourcePort.setPendingMappingType(mappingType);
			targetPort.setPendingMappingType(mappingType);
		}
	}
}
