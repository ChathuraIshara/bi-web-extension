/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { PortModel, PortModelAlignment } from '@projectstorm/react-diagrams';

export class EntityPortModel extends PortModel {
    constructor(id: string, portType: PortModelAlignment) {
        super({
            type: 'entityPort',
            name: `${portType}-${id}`,
            id: `${portType}-${id}`,
            alignment: portType
        });
    }

    isLocked(): boolean {
        return true;
    }
}
