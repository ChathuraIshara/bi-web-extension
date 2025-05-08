/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import { Point } from "@projectstorm/geometry";

export class ArrowLinkModel extends DefaultLinkModel {
    constructor() {
      super({
        type: 'arrow'
      });
    }

    getSVGPath(): string {
		if (this.points.length === 2) {
			const sourcePoint: Point = new Point(this.getFirstPoint().getPosition().x,
				this.getFirstPoint().getPosition().y);
			const targetPoint: Point = new Point(this.getLastPoint().getPosition().x,
				this.getLastPoint().getPosition().y - 5);

            return `M${sourcePoint.x},${sourcePoint.y} L${sourcePoint.x},${targetPoint.y}`;
		}
	}
}
