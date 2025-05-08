/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';

import { DMType } from '@wso2-enterprise/mi-core';
import { Icon, ProgressRing, Tooltip, Typography } from '@wso2-enterprise/ui-toolkit';
import { useIONodesStyles } from '../../../styles';
import styled from '@emotion/styled';

const ItemContainer = styled.div`
	
`;

export interface UnionTypeSelectorItemProps {
	dmType: DMType;
	onHandleSelect: (resolvedUnionType: DMType) => Promise<void>;
}

export function UnionTypeSelectorItem(props: UnionTypeSelectorItemProps) {
	const { dmType, onHandleSelect } = props;
	const [isAddingTypeCast, setIsAddingTypeCast] = useState(false);
	const classes = useIONodesStyles();

	const onClickOnListItem = async () => {
		setIsAddingTypeCast(true)
		await onHandleSelect(dmType);
	};

	return (
		<Tooltip
			content={`Initialize as ${dmType.typeName}`}
			position="right"
		>
			<div
				onMouseDown={onClickOnListItem}
				className={classes.treeLabel}
			>
				{isAddingTypeCast ? (
					<ProgressRing />
				) : (
					<Icon
						name="symbol-struct-icon"
						sx={{ height: "15px", width: "15px"}}
					/>
				)}
				<Typography variant="h4" className={classes.label} sx={{ margin: "0 0 0 6px" }} >
					{dmType.typeName}
				</Typography>
			</div>
		</Tooltip>
	);

}
