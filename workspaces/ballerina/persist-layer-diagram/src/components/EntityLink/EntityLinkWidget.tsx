/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { SVGProps, useEffect, useState } from 'react';
import { DiagramEngine, PortModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';
import { EntityLinkModel } from './EntityLinkModel';
import { ThemeColors } from '@wso2-enterprise/ui-toolkit';

interface WidgetProps {
	engine: DiagramEngine,
	link: EntityLinkModel
}

export function EntityLinkWidget(props: WidgetProps) {
	const { engine, link } = props;

	const [isSelected, setIsSelected] = useState<boolean>(false);

	useEffect(() => {
		if (link.cardinality) {
			link.initLinks(engine);
		}

		link.registerListener({
			'SELECT': selectPath,
			'UNSELECT': unselectPath
		})
	}, [link])

	const selectPath = () => {
		setIsSelected(true);
		link.selectLinkedNodes();
	}

	const unselectPath = () => {
		setIsSelected(false);
		link.resetLinkedNodes();
	}

	const multiLinkedSource: boolean = Object.entries(link.getSourcePort().getLinks()).length > 1;
	const multiLinkedTarget: boolean = Object.entries(link.getTargetPort().getLinks()).length > 1;

	const getCardinalityProps = (port: PortModel): SVGProps<SVGTextElement> => {
		let position: Point = port.getPosition();
		let props: SVGProps<SVGTextElement> = {
			fontFamily: isSelected ? 'GilmerBold' : 'GilmerRegular',
			fontSize: 11,
			fontWeight: isSelected ? 'bold' : 'normal',
			textAnchor: 'start',
			y: position.y - 5
		};

		if (port.getOptions().alignment === PortModelAlignment.LEFT) {
			return { ...props, x: position.x - 20 };
		} else {
			return { ...props, x: position.x + 18 };
		}
	}

	return (
		<g>
			{link.cardinality ?
				<>
					<text {...getCardinalityProps(link.getSourcePort())} style={{fill: ThemeColors.ON_SURFACE}}>
						{isSelected || !multiLinkedSource ? transformCardinality(link.cardinality.self) : '...'}
					</text>

					<text {...getCardinalityProps(link.getTargetPort())} style={{fill: ThemeColors.ON_SURFACE}}>
						{isSelected || !multiLinkedTarget ? transformCardinality(link.cardinality.associate) : '...'}
					</text>
				</> :
				<polygon
					points={link.getArrowHeadPoints()}
					fill={isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}
				/>
			}
			<path
				id={link.getID()}
				d={link.getCurvePath()}
				cursor={'pointer'}
				fill={'none'}
				onMouseLeave={unselectPath}
				onMouseOver={selectPath}
				pointerEvents={'all'}
				stroke={isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}
				strokeWidth={0.75}
			/>
		</g>
	)
}

function transformCardinality(cardinality: string): string {
	cardinality = cardinality.replace('-', '..');
	cardinality = cardinality.replace('m', '*');
	return cardinality;
}
