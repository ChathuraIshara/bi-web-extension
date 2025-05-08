/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { type FC } from "react";
import { Button } from "../Button";
import { Codicon } from "../Codicon";

interface Props {
	webviewSection: string;
	tooltip?: string;
	params?: object;
}

export const ContextMenu: FC<Props> = ({ webviewSection, tooltip = "More Actions", params = {} }) => {
	return (
		<Button
			appearance="icon"
			onClick={(event) => {
				event.preventDefault();
				event.target.dispatchEvent(
					new MouseEvent("contextmenu", {
						bubbles: true,
						clientX: event.currentTarget.getBoundingClientRect().left,
						clientY: event.currentTarget.getBoundingClientRect().bottom,
					}),
				);
				event.stopPropagation();
			}}
			data-vscode-context={JSON.stringify({
				preventDefaultContextMenuItems: true,
				webviewSection,
				...params,
			})}
			title={tooltip}
		>
			<Codicon name="ellipsis" />
		</Button>
	);
};
