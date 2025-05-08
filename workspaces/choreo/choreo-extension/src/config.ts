/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { GHAppConfig } from "@wso2-enterprise/choreo-core";
import { workspace } from "vscode";

interface IChoreoEnvConfig {
	ghApp: GHAppConfig;
	choreoConsoleBaseUrl: string;
	billingConsoleBaseUrl: string;
}

const DEFAULT_CHOREO_ENV_CONFIG: IChoreoEnvConfig = {
	ghApp: {
		installUrl: "https://github.com/apps/wso2-cloud-app/installations/new",
		authUrl: "https://github.com/login/oauth/authorize",
		clientId: "Iv1.804167a242012c66",
		redirectUrl: "https://console.choreo.dev/ghapp",
	},
	choreoConsoleBaseUrl: "https://console.choreo.dev",
	billingConsoleBaseUrl: "https://subscriptions.wso2.com",
};

const CHOREO_ENV_CONFIG_STAGE: IChoreoEnvConfig = {
	ghApp: {
		installUrl: "https://github.com/apps/wso2-cloud-app-stage/installations/new",
		authUrl: "https://github.com/login/oauth/authorize",
		clientId: "Iv1.20fd2645fc8a5aab",
		redirectUrl: "https://console.st.choreo.dev/ghapp",
	},
	choreoConsoleBaseUrl: "https://console.st.choreo.dev",
	billingConsoleBaseUrl: "https://subscriptions.st.wso2.com",
};

const CHOREO_ENV_CONFIG_DEV: IChoreoEnvConfig = {
	ghApp: {
		installUrl: "https://github.com/apps/wso2-cloud-app-dev/installations/new",
		authUrl: "https://github.com/login/oauth/authorize",
		clientId: "Iv1.f6cf2cd585148ee7",
		redirectUrl: "https://consolev2.preview-dv.choreo.dev/ghapp",
	},
	choreoConsoleBaseUrl: "https://consolev2.preview-dv.choreo.dev",
	billingConsoleBaseUrl: "https://subscriptions.dv.wso2.com",
};

class ChoreoEnvConfig {
	constructor(private _config: IChoreoEnvConfig = DEFAULT_CHOREO_ENV_CONFIG) {}

	public getGHAppConfig(): GHAppConfig {
		return this._config.ghApp;
	}

	public getConsoleUrl(): string {
		return this._config.choreoConsoleBaseUrl;
	}

	public getBillingUrl(): string {
		return this._config.billingConsoleBaseUrl;
	}
}

const choreoEnv = process.env.TEST_CHOREO_EXT_ENV ?? workspace.getConfiguration().get("Advanced.ChoreoEnvironment");

let pickedEnvConfig: IChoreoEnvConfig;

switch (choreoEnv) {
	case "prod":
		pickedEnvConfig = DEFAULT_CHOREO_ENV_CONFIG;
		break;
	case "stage":
		pickedEnvConfig = CHOREO_ENV_CONFIG_STAGE;
		break;
	case "dev":
		pickedEnvConfig = CHOREO_ENV_CONFIG_DEV;
		break;
	default:
		pickedEnvConfig = DEFAULT_CHOREO_ENV_CONFIG;
}

export const choreoEnvConfig: ChoreoEnvConfig = new ChoreoEnvConfig(pickedEnvConfig);
