/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import classNames from "classnames";
import React from "react";
import type { PropsWithChildren, ReactNode } from "react";
import type { FC } from "react";
import { Button } from "../Button";
import { Codicon } from "../Codicon";

interface Props extends PropsWithChildren {
	open?: boolean;
	onClose?: () => void;
	title?: ReactNode;
	maxWidthClassName?: string;
}

export const Drawer: FC<Props> = ({ open, children, title, onClose, maxWidthClassName = "max-w-3xl" }) => {
	return (
		<Dialog open={open} onClose={onClose} className="relative z-10">
			<DialogBackdrop transition className="fixed inset-0 bg-vsc-widget-shadow transition-opacity duration-200 ease-in-out data-[closed]:opacity-0" />

			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
						<DialogPanel
							transition
							className={classNames(
								"pointer-events-auto relative w-screen transform border-l-[0.5px] border-l-vsc-editorIndentGuide-background transition duration-300 ease-in-out data-[closed]:translate-x-full",
								maxWidthClassName,
							)}
						>
							<div className="flex h-full flex-col gap-4 bg-vsc-panel-background pt-6 shadow-xl">
								<div className="flex items-start justify-between gap-2 px-4 sm:px-6">
									<DialogTitle className="font-semibold text-base leading-6">{title}</DialogTitle>
									<Button appearance="icon" title="Close" onClick={onClose}>
										<Codicon name="close" />
									</Button>
								</div>
								{children}
							</div>
						</DialogPanel>
					</div>
				</div>
			</div>
		</Dialog>
	);
};
