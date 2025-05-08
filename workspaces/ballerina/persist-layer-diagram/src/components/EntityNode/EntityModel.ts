/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortModelAlignment } from '@projectstorm/react-diagrams';
import { CMEntity as Entity } from '@wso2-enterprise/ballerina-core';
import { SharedNodeModel } from '../shared-node/shared-node';
import { EntityPortModel } from '../EntityPort/EntityPortModel';

export class EntityModel extends SharedNodeModel {
    readonly entityObject: Entity;

    constructor(entityName: string, entityObject: Entity) {
        super('entityNode', entityName);
        this.entityObject = entityObject;

        this.addPort(new EntityPortModel(entityName, PortModelAlignment.LEFT));
        this.addPort(new EntityPortModel(entityName, PortModelAlignment.RIGHT));

        // dedicated ports to connect inheritance links (record inclusions)
        this.addPort(new EntityPortModel(entityName, PortModelAlignment.BOTTOM));
        this.addPort(new EntityPortModel(entityName, PortModelAlignment.TOP));

        this.entityObject.attributes.forEach(attribute => {
            this.addPort(new EntityPortModel(`${entityName}/${attribute.name}`, PortModelAlignment.LEFT));
            this.addPort(new EntityPortModel(`${entityName}/${attribute.name}`, PortModelAlignment.RIGHT));
        })
    }
}
