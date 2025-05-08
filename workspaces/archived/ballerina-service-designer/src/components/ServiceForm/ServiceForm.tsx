/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import { ActionButtons, Button, SidePanel, SidePanelBody, SidePanelTitleContainer, TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import { Service } from '../../utils/definitions';

export interface ResourceFormProps {
	isOpen: boolean;
	serviceConfig: Service;
	onSave: (serviceConfig: Service) => void;
	onClose: () => void;
}

export function ServiceForm(props: ResourceFormProps) {
	const { isOpen, serviceConfig, onClose, onSave } = props;
	const [config, setConfig] = useState<Service>(serviceConfig);

	const handleSave = () => {
		onSave(config);
		onClose();
	};
	const handlePathChange = (value: string) => {
		setConfig({ ...config, path: value });
	};
	const handlePortChange = (value: string) => {
		setConfig({ ...config, port: parseInt(value) });
	}

	return (
		<>
			<SidePanel
				isOpen={isOpen}
				alignment="right"
				sx={{ width: 312 }}
			>
				<SidePanelTitleContainer>
					<Typography sx={{ margin: 0 }} variant="h3">Configure Service</Typography>
					<Button onClick={onClose} appearance="icon">X</Button>
				</SidePanelTitleContainer>

				<SidePanelBody>
					<TextField
						autoFocus
						errorMsg=""
						label="Path"
						size={70}
						onTextChange={handlePathChange}
						placeholder="Path"
						value={config.path}
					/>

					<TextField
						sx={{ marginTop: 10 }}
						autoFocus
						errorMsg=""
						label="Port"
						size={70}
						onTextChange={handlePortChange}
						placeholder="Port"
						value={`${config.port}`}
					/>

					<ActionButtons
						primaryButton={{ text: "Save", onClick: handleSave, tooltip: "Save" }}
						secondaryButton={{ text: "Cancel", onClick: onClose, tooltip: "Cancel" }}
						sx={{ justifyContent: "flex-end", marginTop: 10 }}
					/>
				</SidePanelBody>

			</SidePanel>
		</>
	);
}
