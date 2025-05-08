/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { Project } from "@wso2-enterprise/choreo-core";
import { EventEmitter } from "vscode";

interface IChoreoExtensionAPI {
	/** Deprecated function. Exists due to backward compatibility with Ballerina extension */
	waitForLogin(): Promise<boolean>;
	/** Deprecated function. Exists due to backward compatibility with Ballerina extension */
	getChoreoProject(): Promise<Project | undefined>;
	/** Deprecated function. Exists due to backward compatibility with Ballerina extension */
	isChoreoProject(): Promise<boolean>;
	/** Deprecated function. Exists due to backward compatibility with Ballerina extension */
	enrichChoreoMetadata(model: Map<string, any>): Promise<Map<string, any> | undefined>;
	/** Deprecated function. Exists due to backward compatibility with Ballerina extension */
	getNonBalComponentModels(): Promise<{ [key: string]: any }>;
	/** Deprecated function. Exists due to backward compatibility with Ballerina extension */
	deleteComponent(projectId: string, path: string): Promise<void>;
}

export class ChoreoExtensionApi implements IChoreoExtensionAPI {
	private _onRefreshWorkspaceMetadata = new EventEmitter();
	public onRefreshWorkspaceMetadata = this._onRefreshWorkspaceMetadata.event;

	public async waitForLogin() {
		return false;
	}

	public async getChoreoProject() {
		return undefined;
	}

	public async isChoreoProject() {
		return false;
	}

	public async enrichChoreoMetadata() {
		return undefined;
	}

	public async getNonBalComponentModels() {
		return {};
	}

	public async deleteComponent() {}
}
