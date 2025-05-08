/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { LayerModel, LayerModelGenerics } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';

import { OverlayModel } from './OverlayModel/OverlayModel';

export interface OverlayLayerModelGenerics extends LayerModelGenerics {
	CHILDREN: OverlayModel;
	ENGINE: DiagramEngine;
}

export class OverlayLayerModel<G extends OverlayLayerModelGenerics = OverlayLayerModelGenerics> extends LayerModel<G> {
	constructor() {
		super({
			type: 'diagram-overlays',
			isSvg: false,
			transformed: true
		});
	}

	addModel(model: G['CHILDREN']): void {
		if (!(model instanceof OverlayModel)) {
			throw new Error('Can only add overlays to this layer');
		}
		model.registerListener({
			entityRemoved: () => {
				// (this.getParent() as DiagramModel).removeNode(model);
			}
		});
		super.addModel(model);
	}

	getChildModelFactoryBank(engine: G['ENGINE']) {
		return engine.getNodeFactories();
	}

	getOverlayItems() {
		return this.getModels();
	}
}
