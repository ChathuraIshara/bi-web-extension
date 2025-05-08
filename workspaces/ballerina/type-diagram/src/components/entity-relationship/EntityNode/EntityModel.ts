/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortModelAlignment } from '@projectstorm/react-diagrams';
import { Type as Entity } from '@wso2-enterprise/ballerina-core';
import { SharedNodeModel } from '../../common/shared-node/shared-node';
import { EntityPortModel } from '../EntityPort/EntityPortModel';
import { isNodeClass } from '../../../utils/model-mapper/entityModelMapper';

export class EntityModel extends SharedNodeModel {
    readonly entityObject: Entity;
    isRootEntity: boolean = false; // to provide a contrasting opacity in the composition diagram
    isGraphqlRoot: boolean = false;

    constructor(entityName: string, entityObject: Entity) {
        super('entityNode', entityName);
        this.entityObject = entityObject;

        this.addPort(new EntityPortModel(entityName, PortModelAlignment.LEFT));
        this.addPort(new EntityPortModel(entityName, PortModelAlignment.RIGHT));

        // dedicated ports to connect inheritance links (record inclusions)
        this.addPort(new EntityPortModel(entityName, PortModelAlignment.BOTTOM));
        this.addPort(new EntityPortModel(entityName, PortModelAlignment.TOP));

        const members = isNodeClass(this.entityObject?.codedata?.node) ? this.entityObject.functions : this.entityObject.members; // Use functions if it's a CLASS

        if(members === undefined) return;
        
        Object.entries(members)?.forEach(([_, member]) => {
            this.addPort(new EntityPortModel(`${entityName}/${member.name}`, PortModelAlignment.LEFT));
            this.addPort(new EntityPortModel(`${entityName}/${member.name}`, PortModelAlignment.RIGHT));
        });
    }
}
