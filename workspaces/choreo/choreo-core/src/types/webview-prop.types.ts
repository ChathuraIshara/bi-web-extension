/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { ComponentKind, Environment, Organization, Project } from "./common.types";

export type WebviewTypes = "NewComponentForm" | "ComponentsListActivityView" | "ComponentDetailsView" | "ChoreoCellView";

export interface NewComponentWebviewProps {
	type: "NewComponentForm";
	directoryUriPath: string;
	directoryFsPath: string;
	directoryName: string;
	organization: Organization;
	project: Project;
	existingComponents: ComponentKind[];
	initialValues?: { type?: string; buildPackLang?: string; name?: string };
}

export interface ComponentsDetailsWebviewProps {
	type: "ComponentDetailsView";
	organization: Organization;
	project: Project;
	component: ComponentKind;
	directoryFsPath?: string;
	initialEnvs: Environment[];
}

export interface ComponentsListActivityViewProps {
	type: "ComponentsListActivityView";
	directoryFsPath?: string;
}

export type WebviewProps = ComponentsDetailsWebviewProps | NewComponentWebviewProps | ComponentsListActivityViewProps;
