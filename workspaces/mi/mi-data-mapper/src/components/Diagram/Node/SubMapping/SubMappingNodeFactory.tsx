/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from 'react';

import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

import { InputOutputPortModel } from '../../Port';
import { InputSearchNoResultFound, SearchNoResultFoundKind } from "../commons/Search";

import { SubMappingNode, SUB_MAPPING_SOURCE_NODE_TYPE } from "./SubMappingNode";
import { SubMappingTreeWidget } from "./SubMappingTreeWidget";

export class SubMappingNodeFactory extends AbstractReactFactory<SubMappingNode, DiagramEngine> {
    constructor() {
        super(SUB_MAPPING_SOURCE_NODE_TYPE);
    }

    generateReactWidget(event: { model: SubMappingNode; }): JSX.Element {
        return (
            <>
                {event.model.hasNoMatchingFields ? (
                    <InputSearchNoResultFound kind={SearchNoResultFoundKind.SubMapping} />
                ) : (
                    <SubMappingTreeWidget
                        engine={this.engine}
                        subMappings={event.model.subMappings}
                        context={event.model.context}
                        getPort={(portId: string) => event.model.getPort(portId) as InputOutputPortModel}
                    />
                )}
            </>
        );
    }

    generateModel(): SubMappingNode {
        return undefined;
    }
}
